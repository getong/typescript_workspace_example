import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { NotesService } from "./notes.service";
import { Note } from "./entities/note.entity";
import { UsersService } from "../users/users.service";

describe("NotesService", () => {
  let service: NotesService;

  const mockNotesRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((note) => Promise.resolve({ id: 1, ...note })),
    find: jest.fn().mockResolvedValue([]),
    findOneOrFail: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
  };

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: mockNotesRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
