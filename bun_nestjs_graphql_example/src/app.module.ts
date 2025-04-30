import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { NotesModule } from "./notes/notes.module";
import { User } from "./users/entities/user.entity";
import { Note } from "./notes/entities/note.entity";
import { ClientModule } from "./client/client.module";
import { DatabaseModule } from "./database/database.module";
import { GraphqlModule } from "./graphql/graphql.module";
import { TypeormModule } from "./typeorm/typeorm.module";

@Module({
  imports: [
    GraphqlModule,
    TypeormModule,
    UsersModule,
    NotesModule,
    DatabaseModule,
    ClientModule,
  ],
})
export class AppModule {}
