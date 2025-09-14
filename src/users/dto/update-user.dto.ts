import { PartialType } from "@nestjs/mapped-types";
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsBoolean,
  IsPhoneNumber,
  MaxLength,
} from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @IsOptional()
  @IsString({ message: "First name must be a string" })
  @MaxLength(50, { message: "First name must not exceed 50 characters" })
  firstName?: string;

  @IsOptional()
  @IsString({ message: "Last name must be a string" })
  @MaxLength(50, { message: "Last name must not exceed 50 characters" })
  lastName?: string;

  @IsOptional()
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password?: string;

  @IsOptional()
  @IsString({ message: "Phone must be a string" })
  @MaxLength(15, { message: "Phone number must not exceed 15 characters" })
  phone?: string;

  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean value" })
  isActive?: boolean;
}
