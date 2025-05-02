import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ProjectGuard } from "../guards/project.guard";

@Controller("projects")
@UseGuards(ProjectGuard) // Apply ProjectGuard to all routes in this controller
export class ProjectsController {
  @Get()
  findAll() {
    return {
      projects: [
        { id: 1, name: "Project 1" },
        { id: 2, name: "Project 2" },
      ],
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return { id: parseInt(id), name: `Project ${id}` };
  }
}
