import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Logger,
  Param,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";

@Controller("tasks")
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {
    this.logger.log("TasksController initialized");
  }

  @Get("cached-data")
  getCachedData(@Query("key") key?: string) {
    return this.tasksService.getCachedData(key);
  }

  @Get("products")
  getProducts() {
    return this.tasksService.getCachedData("products");
  }

  @Get("users")
  getUsers() {
    return this.tasksService.getCachedData("users");
  }

  @Get("categories")
  getCategories() {
    return this.tasksService.getCachedData("categories");
  }

  @Post("fetch-data")
  async fetchDataFromUrl(@Body("url") url: string) {
    if (!url) {
      return { error: "URL is required" };
    }

    const data = await this.tasksService.fetchDataFromUrl(url);

    if (data) {
      return { success: true, data };
    } else {
      return { success: false, message: "Failed to fetch data" };
    }
  }

  @Post("refresh/products")
  async refreshProducts() {
    await this.tasksService.fetchProductsUpdate();
    return { success: true, message: "Products data refreshed" };
  }

  @Post("refresh/quick-updates")
  async refreshQuickUpdates() {
    await this.tasksService.fetchQuickUpdates();
    return { success: true, message: "Quick updates refreshed" };
  }
}
