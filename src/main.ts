import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// import { WinstonModule } from 'nest-winston';
// import { instance } from './logger/winston.config';
import { MyLogger } from './logger/logger.service';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: WinstonModule.createLogger({
    //   instance: instance
    // }),
  });
  app.useLogger(new MyLogger())
  await app.listen(PORT);
}
bootstrap();
