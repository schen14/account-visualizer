import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import * as pactum from 'pactum';
import { LoginDto, RegisterDto } from '../src/auth/dto';
import { AccountType, Prisma } from '@prisma/client';
import { CreateAccountDto, UpdateAccountDto } from '../src/accounts/dto';
import { CreateRecordDto, UpdateRecordDto } from '../src/records/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let db: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init();
    await app.listen(3333);

    db = app.get(DatabaseService);
    await db.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  })

  describe('Auth', () => {
    const dto: RegisterDto = {
      firstName: 'Stanley',
      lastName: 'Chen',
      email: 'schen8999@gmail.com',
      password: 'test',
    };

    describe('Register', () => {
      it('should throw if email empty', () => {
        return pactum.spec()
        .post('/auth/register')
        .withBody({
          password: '123',
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if password empty', () => {
        return pactum.spec()
        .post('/auth/register')
        .withBody({
          email: 'schen8999@gmail.com',
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if no body', () => {
        return pactum.spec()
        .post('/auth/register')
        .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should register', () => {
        return pactum.spec()
        .post('/auth/register')
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Login', () => {
      it('should throw if email empty', () => {
        return pactum.spec()
        .post('/auth/login')
        .withBody({
          password: '123',
        })
        .expectStatus(HttpStatus.BAD_REQUEST)
      });

      it('should throw if password empty', () => {
        return pactum.spec()
        .post('/auth/login')
        .withBody({
          email: 'schen8999@gmail.com',
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw if no body', () => {
        return pactum.spec()
        .post('/auth/login')
        .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should login', () => {
        return pactum.spec()
        .post('/auth/login')
        .withBody(dto as LoginDto)
        .expectStatus(HttpStatus.OK)
        .stores('userAt', 'access_token')  // sets var into test execution context
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum.spec()
        .get('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',  // syntax to get execution context var
        })
        .expectStatus(HttpStatus.OK)
      })
    });

    describe('Update user', () => {
      it('should update user', () => {
        const dto : Prisma.UserUpdateInput = {
          "firstName": "Stan",
        };
        return pactum.spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(HttpStatus.OK)
        .expectBodyContains(dto.firstName)
      })
    });
  });

  describe('Account', () => {
    describe('Get empty accounts', () => {
      it('should get empty accounts', () => {
        return pactum.spec()
        .get('/accounts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectBody([])
      })
    });

    describe('Create account', () => {
      const dto: CreateAccountDto = {
        "name": "Test Checking Account",
        "accountType": AccountType.CHECKING,
        "note": "test 1",
      }
      const dto2: CreateAccountDto = {
        "name": "Test Savings Account",
        "accountType": AccountType.SAVINGS,
        "note": "test 2",
      }

      it('should create account', () => {
        return pactum.spec()
        .post('/accounts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED)
        .stores('accountId', 'id')
      })

      it('should create another account', () => {
        return pactum.spec()
        .post('/accounts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto2)
        .expectStatus(HttpStatus.CREATED)
        .stores('accountId2', 'id')
      })
    });

    describe('Get accounts', () => {
      it('should get accounts', () => {
        return pactum.spec()
        .get('/accounts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectJsonLength(2)
      })
    });

    describe('Get account by id', () => {
      it('should get account by id', () => {
        return pactum.spec()
        .get('/accounts/{id}')
        .withPathParams('id', '$S{accountId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('$S{accountId}')
      })
    });

    describe('Update account by id', () => {
      const dto: UpdateAccountDto = {
        note: "updated note"
      }
      it('should update account', () => {
        return pactum.spec()
        .patch('/accounts/{id}')
        .withPathParams('id', '$S{accountId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(HttpStatus.OK)
        .expectBodyContains(dto.note)
      })
    });

    describe('Delete account by id', () => {
      it('should delete account', () => {
        return pactum.spec()
        .delete('/accounts/{id}')
        .withPathParams('id', '$S{accountId2}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.NO_CONTENT)
      })

      it('should get non-deleted accounts', () => {
        return pactum.spec()
        .get('/accounts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectJsonLength(1)
      })
    });
  });

  describe('Record', () => {
    describe('Get empty records', () => {
      it('should get empty records', () => {
        return pactum.spec()
        .get('/accounts/{accountId}/records')
        .withPathParams('accountId', '$S{accountId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectBody([])
      })
    });

    describe('Create record', () => {
      const dto: CreateRecordDto = {
        value: 999.99
      }
      const dto2: CreateRecordDto = {
        value: 123.45
      }
      it('should create record', () => {
        return pactum.spec()
        .post('/accounts/{accountId}/records')
        .withPathParams('accountId', '$S{accountId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED)
        .stores('recordId', 'id')
      })

      it('should create another record', () => {
        return pactum.spec()
        .post('/accounts/{accountId}/records')
        .withPathParams('accountId', '$S{accountId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto2)
        .expectStatus(HttpStatus.CREATED)
        .stores('recordId2', 'id')
        .stores('value2', 'value')
      })
    });

    describe('Get records', () => {
      it('should get records', () => {
        return pactum.spec()
        .get('/accounts/{accountId}/records')
        .withPathParams('accountId', '$S{accountId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectJsonLength(2)
      })
    });

    describe('Get latest record', () => {
      it('should get latest record', () => {
        return pactum.spec()
        .get('/accounts/{accountId}/records/latest')
        .withPathParams('accountId', '$S{accountId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('$S{value2}')
      })
    });

    describe('Get record by id', () => {
      it('should get record by id', () => {
        return pactum.spec()
        .get('/accounts/{accountId}/records/{recordId}')
        .withPathParams({
          'accountId': '$S{accountId}', 
          'recordId': '$S{recordId}'
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('$S{accountId}')
      })
    });

    describe('Update record by id', () => {
      const dto: UpdateRecordDto = {
        value: 6789.10
      }
      it('should update record', () => {
        return pactum.spec()
        .patch('/accounts/{accountId}/records/{recordId}')
        .withPathParams({
          'accountId': '$S{accountId}', 
          'recordId': '$S{recordId2}'
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(HttpStatus.OK)
        .expectBodyContains(dto.value)
      })
    });

    describe('Delete record by id', () => {
      it('should delete record', () => {
        return pactum.spec()
        .delete('/accounts/{accountId}/records/{recordId}')
        .withPathParams({
          'accountId': '$S{accountId}', 
          'recordId': '$S{recordId2}'
        })
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.NO_CONTENT)
      })

      it('should get updated latest record', () => {
        return pactum.spec()
        .get('/accounts/{accountId}/records/latest')
        .withPathParams('accountId', '$S{accountId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('$S{recordId}')
      })
    });
  });
});