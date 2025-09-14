import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || "i am superman",
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
};
