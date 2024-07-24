import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPlaidItemDto } from './create-user-plaid-item.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserPlaidItemDto extends PartialType(CreateUserPlaidItemDto) {
  @IsNumber()
  @IsNotEmpty()
  userId: number
}
