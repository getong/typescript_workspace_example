import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { NotesService } from "./notes.service";
import { Note } from "./entities/note.entity";
import { CreateNoteInput } from "./dto/create-note.input";
import { UpdateNoteInput } from "./dto/update-note.input";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

@Resolver(() => Note)
export class NotesResolver {
  constructor(
    private readonly notesService: NotesService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => Note)
  createNote(@Args("createNoteInput") createNoteInput: CreateNoteInput) {
    return this.notesService.create(createNoteInput);
  }

  @Query(() => [Note], { name: "notes" })
  findAll() {
    return this.notesService.findAll();
  }

  @Query(() => Note, { name: "note" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.notesService.findOne(id);
  }

  @Query(() => [Note], { name: "notesByUser" })
  findByUserId(@Args("userId", { type: () => Int }) userId: number) {
    return this.notesService.findByUserId(userId);
  }

  @Mutation(() => Note)
  updateNote(@Args("updateNoteInput") updateNoteInput: UpdateNoteInput) {
    return this.notesService.update(updateNoteInput.id, updateNoteInput);
  }

  @Mutation(() => Note)
  removeNote(@Args("id", { type: () => Int }) id: number) {
    return this.notesService.remove(id);
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() note: Note) {
    if (!note.userId) return null;
    return this.usersService.findOne(note.userId);
  }
}
