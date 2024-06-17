import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DatabaseModule } from '../database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot()],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
