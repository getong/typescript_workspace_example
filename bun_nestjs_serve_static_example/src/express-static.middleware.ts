import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express"; // Use proper types
import * as fs from "fs";
import { join } from "path";

@Injectable()
export class ExpressStaticMiddleware implements NestMiddleware {
  private static readonly publicPath = join(import.meta.dir, "..", "public");

  use(req: Request, res: Response, next: NextFunction) {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return next();
    }

    // Special case for about.html with trailing slash
    if (req.path.startsWith("/about.html/")) {
      const aboutPath = join(ExpressStaticMiddleware.publicPath, "about.html");
      if (fs.existsSync(aboutPath)) {
        console.log(
          `[Middleware] Serving about page with trailing slash: ${aboutPath}`,
        );
        return res.sendFile(aboutPath);
      }
    }

    // Handle paths with trailing slashes
    let normalizedPath = req.path;
    if (normalizedPath.length > 1 && normalizedPath.endsWith("/")) {
      normalizedPath = normalizedPath.slice(0, -1);
    }

    // Manual static file serving implementation
    const filePath = join(
      ExpressStaticMiddleware.publicPath,
      normalizedPath === "/" ? "index.html" : normalizedPath,
    );

    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        console.log(`[Middleware] Serving file: ${filePath}`);
        return res.sendFile(filePath);
      }

      // If the file doesn't exist and the path doesn't have an extension,
      // try serving index.html from that directory
      if (!normalizedPath.includes(".") && normalizedPath !== "/") {
        const indexPath = join(
          ExpressStaticMiddleware.publicPath,
          normalizedPath,
          "index.html",
        );
        if (fs.existsSync(indexPath)) {
          console.log(`[Middleware] Serving index file: ${indexPath}`);
          return res.sendFile(indexPath);
        }
      }

      console.log(
        `[Middleware] File not found: ${filePath}, passing to next handler`,
      );
      next();
    } catch (error) {
      console.error(
        `[Middleware] Error serving static file: ${filePath}`,
        error,
      );
      next();
    }
  }
}
