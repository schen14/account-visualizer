import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { RecordsModule } from './records/records.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './logger/all-exceptions.filter';
import { LoggerModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { LoggingInterceptor } from './logger/logger.interceptor';
import { ConfigModule } from '@nestjs/config';
import { PlaidModule } from './plaid/plaid.module';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    AccountsModule, 
    RecordsModule, 
    LoggerModule, 
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PlaidModule.forRootAsync(),
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    // Logger, 
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
})
export class AppModule {}
