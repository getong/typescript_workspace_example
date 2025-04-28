import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotesService } from "./notes.service";
import { NotesResolver } from "./notes.resolver";
import { Note } from "./entities/note.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UsersModule],
  providers: [NotesResolver, NotesService],
  exports: [NotesService],
})
export class NotesModule {}
