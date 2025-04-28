import { Module, Logger } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { NotesModule } from "./notes/notes.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/entities/user.entity";
import { Note } from "./notes/entities/note.entity";
import { join } from "path";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      playground: true,
      formatError: (error) => {
        const logger = new Logger("GraphQL");
        logger.error(
          `GraphQL Error: ${error.message}`,
          error.extensions?.exception?.stacktrace,
        );
        return error;
      },
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: join(process.cwd(), "database.sqlite"),
      entities: [User, Note],
      synchronize: true, // Auto-create database schema (use with caution in production)
      logging: true, // Enable SQL query logging
      logger: "advanced-console",
    }),
    UsersModule,
    NotesModule,
    DatabaseModule,
  ],
})
export class AppModule {}
