import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

console.log("ORM Config Environment Check:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_DATABASE);
console.log("DB_NAME:", process.env.DB_USERNAME);
console.log("DB_NAME:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_PORT);

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "otmm",
  entities: ["src/**/*.entity{.ts,.js}"],
  migrations: ["src/migrations/*{.ts,.js}"],
  synchronize: false,
  logging: true,
});
