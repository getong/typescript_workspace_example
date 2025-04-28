import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/entities/user.entity";
import { join } from "path";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      playground: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: join(process.cwd(), "database.sqlite"),
      entities: [User],
      synchronize: true, // Auto-create database schema (use with caution in production)
    }),
    UsersModule,
  ],
})
export class AppModule {}
