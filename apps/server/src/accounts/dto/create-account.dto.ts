import { AccountType } from "@prisma/client"
import { Transform } from "class-transformer"
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
  @Transform(({ value }) => {
    const valueAsNum = Number(value);
    if (isNaN(valueAsNum)) {
      throw new Error("balance must be a number conforming to the specified constraints");
    }
    return valueAsNum;
  })
  balance: number

  @IsString()
  @IsOptional()
  note?: string

  @IsString()
  @IsOptional()
  iconPath?: string
}
