import { IsEmail, IsString, } from "class-validator";

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  // @IsStrongPassword()
  @IsString()
  password: string;
}
