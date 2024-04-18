import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';


/*
Can use @Global() decorator instead of having to importing this in every module,
but might not be good practice.
*/
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
