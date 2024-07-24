import { IsNotEmpty, IsString } from "class-validator"

export class CreateUserPlaidItemDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string

    @IsString()
    @IsNotEmpty()
    itemId: string
}
