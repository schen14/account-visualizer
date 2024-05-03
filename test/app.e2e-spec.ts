import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import * as pactum from 'pactum';
import { LoginDto, RegisterDto } from '../src/auth/dto';
import { AccountType, Prisma } from '@prisma/client';
import { CreateAccountDto, UpdateAccountDto } from '../src/accounts/dto';

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
        "note": "test",
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
    });

    describe('Get accounts', () => {
      it('should get accounts', () => {
        return pactum.spec()
        .get('/accounts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectJsonLength(1)
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
        .withPathParams('id', '$S{accountId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.NO_CONTENT)
      })

      it('should get empty accounts', () => {
        return pactum.spec()
        .get('/accounts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(HttpStatus.OK)
        .expectJsonLength(0)
      })
    });
  });

  describe('Record', () => {
    describe('Create record', () => {});

    describe('Get records', () => {});

    describe('Get record by id', () => {});

    describe('Update record by id', () => {});

    describe('Delete record by id', () => {});
  });
});