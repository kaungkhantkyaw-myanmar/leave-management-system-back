import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Public } from "./decorators/public.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // PUBLIC LOGIN ENDPOINT
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    console.log("Login attempt for email:", loginDto.email);
    return await this.authService.login(loginDto);
  }

  // PUBLIC REGISTRATION ENDPOINT
  @Public()
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    console.log("Registration attempt for email:", registerDto.email);
    return await this.authService.register(registerDto);
  }

  // PROTECTED - GET USER PROFILE
  @Get("profile")
  async getProfile(@CurrentUser() user: any) {
    return await this.authService.getProfile(user.id);
  }

  // PROTECTED - VERIFY TOKEN
  @Get("verify")
  async verifyToken(@CurrentUser() user: any) {
    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: "Token is valid",
    };
  }

  // PROTECTED - REFRESH TOKEN (Optional feature)
  @Post("refresh")
  async refreshToken(@CurrentUser() user: any) {
    return await this.authService.generateTokenForUser(user);
  }

  // PROTECTED - LOGOUT
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: any) {
    console.log(`User ${user.email} logged out`);
    return {
      message: "Logged out successfully",
      timestamp: new Date().toISOString(),
    };
  }
}
