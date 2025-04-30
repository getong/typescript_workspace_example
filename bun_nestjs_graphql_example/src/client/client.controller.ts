import { Controller, Get, Res } from "@nestjs/common";
import { ClientService } from "./client.service";
import type { Response } from "express";

@Controller()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  serveClient(@Res() res: Response): void {
    const html = this.clientService.renderClient();
    res.send(html);
  }
}
