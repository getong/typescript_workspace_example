import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";
import path from "path";

@Controller()
export class AppController {
  @Get()
  serveIndex(@Res() res: Response) {
    return res.sendFile(path.join(process.cwd(), "public", "index.html"));
  }
}
