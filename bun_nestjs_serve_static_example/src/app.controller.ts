import { Controller, Get, Req, Res, All } from "@nestjs/common";
import { join } from "path";
import * as fs from "fs";

@Controller()
export class AppController {
  @Get("api/health")
  getHealth() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  private serveStaticFile(res: any, filePath: string, notFoundMessage: string) {
    if (fs.existsSync(filePath)) {
      console.log(`[Controller] Serving file: ${filePath}`);
      return res.sendFile(filePath);
    } else {
      console.log(`[Controller] File not found: ${filePath}`);
      return res.status(404).send(notFoundMessage);
    }
  }

  @Get("about.html")
  serveAboutPage(@Res() res: any) {
    const aboutPath = join(import.meta.dir, "..", "public", "about.html");
    return this.serveStaticFile(res, aboutPath, "About page not found");
  }

  @Get("about.html/*")
  serveAboutPageWithTrailingSlash(@Res() res: any) {
    return this.serveAboutPage(res);
  }

  @All("*")
  fallback(@Req() req: any, @Res() res: any) {
    return res.status(404).send("Not Found");
  }
}
