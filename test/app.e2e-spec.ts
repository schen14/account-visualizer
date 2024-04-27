import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';

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

    db = app.get(DatabaseService);
    await db.cleanDb();
  });

  afterAll(() => {
    app.close();
  })

  it.todo('should pass');
});