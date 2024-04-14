import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [AuthModule, UsersModule, AccountsModule, RecordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
