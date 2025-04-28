import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { NotesModule } from "./notes/notes.module";
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
  ],
})
export class AppModule {}
