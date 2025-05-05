import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    let requestInfo: string;

    if (context.getType() === "http") {
      // Handle REST API requests
      const request = context.switchToHttp().getRequest();
      const method = request.method;
      const url = request.url;
      requestInfo = `${method} ${url}`;

      this.logger.log(`Request started: ${requestInfo}`);
    } else {
      // Handle GraphQL requests
      const ctx = GqlExecutionContext.create(context);
      const info = ctx.getInfo();
      requestInfo = `GraphQL ${info.parentType.name}.${info.fieldName}`;

      const args = ctx.getArgs();
      this.logger.log(`GraphQL request: ${requestInfo}`);
      if (Object.keys(args).length > 0) {
        this.logger.debug(`GraphQL args: ${JSON.stringify(args)}`);
      }
    }

    return next.handle().pipe(
      tap({
        next: (val) => {
          const duration = Date.now() - now;
          this.logger.log(`Request completed: ${requestInfo} (${duration}ms)`);
        },
        error: (err) => {
          const duration = Date.now() - now;
          this.logger.error(
            `Request failed: ${requestInfo} (${duration}ms)`,
            err.stack,
          );
        },
      }),
    );
  }
}
