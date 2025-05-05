import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { TasksModule } from "./tasks/tasks.module";

// Only import controllers through their respective modules
@Module({
  imports: [UsersModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
