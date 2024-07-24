import { UnprocessableEntityException } from "@nestjs/common"
import { Transform } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  accountType: string

  @IsNumber({maxDecimalPlaces: 2})
  @IsNotEmpty()
  @Transform(({ value }) => {
    const valueAsNum = Number(value);
    if (isNaN(valueAsNum)) {
      throw new UnprocessableEntityException("balance must be a number conforming to the specified constraints");
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
