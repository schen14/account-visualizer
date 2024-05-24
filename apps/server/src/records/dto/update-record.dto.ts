import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRecordDto {
    @IsNumber({maxDecimalPlaces: 2})
    @IsNotEmpty()
    value: number

    @IsString()
    @IsOptional()
    updatedBy?: string
}
