import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class SignAccessTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  id: string;
}
