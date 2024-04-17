import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
