import { AccountType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(AccountType)
  @IsNotEmpty()
  accountType: AccountType

  @IsString()
  @IsOptional()
  note?: string

  @IsString()
  @IsOptional()
  iconPath?: string
}
