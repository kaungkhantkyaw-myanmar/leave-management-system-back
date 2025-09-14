import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";

export interface JwtPayload {
  sub: number;
  email: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive: boolean;
  };
  loginTime: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  // VALIDATE USER CREDENTIALS
  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        console.log(`Login failed: User not found for email: ${email}`);
        return null;
      }

      if (!user.isActive) {
        console.log(
          `Login failed: User account is deactivated for email: ${email}`
        );
        throw new UnauthorizedException(
          "Your account has been deactivated. Please contact administrator."
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log(`Login failed: Invalid password for email: ${email}`);
        return null;
      }

      console.log(`Login successful for email: ${email}`);
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error("Validation error:", error.message);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      return null;
    }
  }

  // LOGIN METHOD
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    // Validate credentials
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = this.jwtService.sign(payload);

    // Log successful login
    console.log(
      `User logged in successfully: ${user.email} at ${new Date().toISOString()}`
    );

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: process.env.JWT_EXPIRES_IN || "24h",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isActive: user.isActive,
      },
      loginTime: new Date().toISOString(),
    };
  }

  // REGISTER METHOD
  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Create new user
    const newUser = await this.usersService.create(registerDto);

    // Generate token for new user (auto-login after registration)
    const payload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };

    const accessToken = this.jwtService.sign(payload);

    console.log(`User registered and logged in: ${newUser.email}`);

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: process.env.JWT_EXPIRES_IN || "24h",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        isActive: newUser.isActive,
      },
      loginTime: new Date().toISOString(),
    };
  }

  // GET USER PROFILE
  async getProfile(userId: number) {
    return await this.usersService.findOne(userId);
  }

  // GENERATE TOKEN FOR EXISTING USER (for refresh token feature)
  async generateTokenForUser(user: any): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: process.env.JWT_EXPIRES_IN || "24h",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || null,
        isActive: user.isActive || true,
      },
      loginTime: new Date().toISOString(),
    };
  }
}
