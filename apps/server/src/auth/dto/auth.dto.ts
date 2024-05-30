import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class RegisterDto extends LoginDto{
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;
}

export class VerifyDto {
    @IsString()
    @IsNotEmpty()
    access_token: string;

    @IsString()
    @IsNotEmpty()
    provider: string;
}