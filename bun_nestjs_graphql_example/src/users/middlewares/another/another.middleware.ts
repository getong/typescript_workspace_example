import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AnotherMiddleware implements NestMiddleware {
  private readonly logger = new Logger("UsersMiddleware");

  use(req: Request, res: Response, next: NextFunction) {
    // Log the incoming request
    this.logger.log(
      `anothermiddle ${req.method} ${req.originalUrl} - Processing request`,
    );

    // Add timestamp to request
    req["timestamp"] = new Date().toISOString();

    // Check for authentication header (example only)
    const authHeader = req.headers.authorization;
    if (authHeader) {
      this.logger.debug(
        `anothermiddle Request has authorization header: ${authHeader.substring(0, 15)}...`,
      );
      // In a real app, you would validate JWT tokens here
    } else {
      this.logger.debug("anothermiddle No authorization header present");
    }

    // Track request start time for performance monitoring
    const start = Date.now();

    // Handle response finishing
    res.on("finish", () => {
      const duration = Date.now() - start;
      this.logger.log(
        `anothermiddle ${req.method} ${req.originalUrl} - Response ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
