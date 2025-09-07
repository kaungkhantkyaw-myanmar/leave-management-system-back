import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

export const getDatabaseConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => ({
  type: "mysql",
  host: configService.get("DB_HOST") as string,
  port: configService.get("DB_PORT") as number,
  username: configService.get("DB_USERNAME") as string,
  password: configService.get("DB_PASSWORD") as string,
  database: configService.get("DB_DATABASE") as string,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
  synchronize: false,
  migrationsRun: true,
});
