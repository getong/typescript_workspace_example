import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log("UserGuard: Validating user request...");
    console.log({
      method: request.method,
      url: request.url,
      headers: {
        host: request.headers.host,
        userAgent: request.headers["user-agent"],
        contentType: request.headers["content-type"],
        authorization: request.headers.authorization || "None",
      },
      query: request.query,
      params: request.params,
      body: request.body,
      ip: request.ip,
      timestamp: new Date().toISOString(),
    });

    // Add user-specific validation logic here
    // For example, check if the request has valid user permissions

    return true;
  }
}
