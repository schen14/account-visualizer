import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// import { WinstonModule } from 'nest-winston';
// import { instance } from './logger/winston.config';
import { MyLogger } from './logger/logger.service';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: WinstonModule.createLogger({
    //   instance: instance
    // }),
  });
  // Not needed?
  // app.useLogger(new MyLogger())

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(PORT);
}
bootstrap();
