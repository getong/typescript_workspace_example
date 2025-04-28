import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { CreateUserInput } from "../users/dto/create-user.input";

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly usersService: UsersService) {}

  /**
   * Automatically run when the module is initialized
   */
  async onModuleInit() {
    this.logger.log("Seeder automatically starting on module init");
    try {
      await this.seed();
    } catch (error) {
      this.logger.error("Failed to seed database on module init", error.stack);
    }
  }

  async seed(): Promise<void> {
    this.logger.log("Running database seeder...");
    await this.seedUsers();
    this.logger.log("Database seeding completed");
  }

  private async seedUsers(): Promise<User[]> {
    this.logger.log("Seeding users");

    try {
      // Check if we already have users
      const existingUsers = await this.usersService.findAll();

      if (existingUsers && existingUsers.length > 0) {
        this.logger.log(
          `Found ${existingUsers.length} existing users, skipping seeding`,
        );
        return existingUsers;
      }

      // Create sample users
      const sampleUsers: CreateUserInput[] = [
        { name: "John Doe", email: "john@example.com" },
        { name: "Jane Smith", email: "jane@example.com" },
        { name: "Bob Johnson", email: "bob@example.com" },
      ];

      this.logger.log(`Creating ${sampleUsers.length} sample users...`);

      const createdUsers: User[] = [];
      for (const userData of sampleUsers) {
        try {
          const user = await this.usersService.create(userData);
          createdUsers.push(user);
          this.logger.log(`Created user: ${userData.name} (ID: ${user.id})`);
        } catch (error) {
          this.logger.error(
            `Failed to create user ${userData.name}: ${error.message}`,
          );
        }
      }

      this.logger.log(
        `Successfully created ${createdUsers.length} sample users`,
      );
      return createdUsers;
    } catch (error) {
      this.logger.error("Error seeding users", error.stack);
      return [];
    }
  }
}
