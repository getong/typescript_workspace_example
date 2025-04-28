import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNoteInput } from "./dto/create-note.input";
import { UpdateNoteInput } from "./dto/update-note.input";
import { Note } from "./entities/note.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    private usersService: UsersService,
  ) {}

  async create(createNoteInput: CreateNoteInput): Promise<Note> {
    // Verify that the user exists first
    try {
      const user = await this.usersService.findOne(createNoteInput.userId);
      this.logger.log(
        `Found user for note creation: ${user.name} (ID: ${user.id})`,
      );
    } catch (error) {
      this.logger.error(
        `User with ID ${createNoteInput.userId} not found`,
        error.stack,
      );
      throw new NotFoundException(
        `User with ID ${createNoteInput.userId} not found. Please create this user first.`,
      );
    }

    this.logger.log(`Creating note with title: ${createNoteInput.title}`);
    const note = this.notesRepository.create(createNoteInput);
    return this.notesRepository.save(note);
  }

  findAll(): Promise<Note[]> {
    return this.notesRepository.find({ relations: ["user"] });
  }

  findOne(id: number): Promise<Note> {
    return this.notesRepository.findOneOrFail({
      where: { id },
      relations: ["user"],
    });
  }

  findByUserId(userId: number): Promise<Note[]> {
    return this.notesRepository.find({
      where: { userId },
      relations: ["user"],
    });
  }

  async update(id: number, updateNoteInput: UpdateNoteInput): Promise<Note> {
    await this.notesRepository.update(id, updateNoteInput);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Note> {
    const note = await this.findOne(id);
    await this.notesRepository.delete(id);
    return note;
  }
}
