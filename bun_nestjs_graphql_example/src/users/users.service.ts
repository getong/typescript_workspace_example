import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    this.logger.log(
      `Creating new user: ${createUserInput.name} (${createUserInput.email})`,
    );
    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    this.logger.log("Fetching all users");
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    this.logger.log(`Fetching user with ID: ${id}`);
    try {
      const user = await this.usersRepository.findOneOrFail({ where: { id } });
      return user;
    } catch (error) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    await this.usersRepository.update(id, updateUserInput);
    return this.findOne(id);
  }

  async remove(id: number): Promise<User> {
    this.logger.log(`Removing user with ID: ${id}`);
    const user = await this.findOne(id);
    await this.usersRepository.delete(id);
    return user;
  }

  async checkExists(id: string): Promise<void> {
    this.logger.log(`Checking if user with ID ${id} exists`);
    const userId = parseInt(id);
    const exists = await this.usersRepository.exist({ where: { id: userId } });
    if (!exists) {
      this.logger.warn(`User with ID ${id} not found during existence check`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
