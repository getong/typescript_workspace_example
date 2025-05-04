import { UserService } from "../services/UserService";
import { User } from "../entity/User";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userService.findById(id);
  }

  async createUser(userData: {
    firstName: string;
    lastName: string;
    age?: number;
  }): Promise<User> {
    return this.userService.create(userData);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    return this.userService.update(id, userData);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userService.delete(id);
  }
}
