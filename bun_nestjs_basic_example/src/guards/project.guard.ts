import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class ProjectGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log("ProjectGuard: Validating project request...");
    console.log({
      method: request.method,
      url: request.url,
      // Log project-specific details
      projectId: request.params.id || "Not specified",
      timestamp: new Date().toISOString(),
    });

    // Add project-specific validation logic here
    // For example, check if the user has access to the requested project

    return true;
  }
}
