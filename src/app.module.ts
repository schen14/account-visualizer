import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { RecordsModule } from './records/records.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './logger/all-exceptions.filter';
import { LoggerModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, UsersModule, AccountsModule, RecordsModule, LoggerModule, DatabaseModule],
  controllers: [AppController],
  providers: [
    AppService, 
    // Logger, 
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ],
})
export class AppModule {}
