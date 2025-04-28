import { Test, TestingModule } from "@nestjs/testing";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";

describe("UsersResolver", () => {
  let resolver: UsersResolver;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
