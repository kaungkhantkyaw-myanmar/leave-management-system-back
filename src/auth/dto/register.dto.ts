import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString({ message: "First name must be a string" })
  @IsNotEmpty({ message: "First name is required" })
  @MinLength(2, { message: "First name must be at least 2 characters long" })
  @MaxLength(50, { message: "First name must not exceed 50 characters" })
  firstName: string;

  @IsString({ message: "Last name must be a string" })
  @IsNotEmpty({ message: "Last name is required" })
  @MinLength(2, { message: "Last name must be at least 2 characters long" })
  @MaxLength(50, { message: "Last name must not exceed 50 characters" })
  lastName: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @MaxLength(100, { message: "Password must not exceed 100 characters" })
  password: string;

  @IsOptional()
  @IsString({ message: "Phone must be a string" })
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: "Please provide a valid phone number",
  })
  phone?: string;
}
