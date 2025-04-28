import { Test, TestingModule } from "@nestjs/testing";
import { NotesResolver } from "./notes.resolver";
import { NotesService } from "./notes.service";
import { UsersService } from "../users/users.service";

describe("NotesResolver", () => {
  let resolver: NotesResolver;

  const mockNotesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesResolver,
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get<NotesResolver>(NotesResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
