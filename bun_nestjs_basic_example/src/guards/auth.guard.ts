import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Simple example - in a real app you'd validate JWT tokens or similar
    // For now, this always returns true (allows all requests)
    console.log("AuthGuard: Validating request...");
    return true;
  }
}
