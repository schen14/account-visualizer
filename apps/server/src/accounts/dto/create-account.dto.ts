import { AccountType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(AccountType)
  @IsNotEmpty()
  accountType: AccountType

  @IsNumber({maxDecimalPlaces: 2})
  @IsNotEmpty()
  balance: number

  @IsString()
  @IsOptional()
  note?: string

  @IsString()
  @IsOptional()
  iconPath?: string
}
