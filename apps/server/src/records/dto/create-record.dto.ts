import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateRecordDto {
    @IsNumber({maxDecimalPlaces: 2})
    @IsNotEmpty()
    value: number

    @IsString()
    @IsOptional()
    createdBy?: string
}
