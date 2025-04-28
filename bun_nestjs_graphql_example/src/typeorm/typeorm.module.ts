import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Note } from "../notes/entities/note.entity";
import { join } from "path";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: join(process.cwd(), "database.sqlite"),
      entities: [User, Note],
      synchronize: true, // Auto-create database schema (use with caution in production)
      logging: true, // Enable SQL query logging
      logger: "advanced-console",
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeormModule {}
