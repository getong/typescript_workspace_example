import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { ExpressStaticMiddleware } from "./express-static.middleware";
import { AppController } from "./app.controller";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply middleware to all routes except controller routes
    consumer
      .apply(ExpressStaticMiddleware)
      .exclude("/api/(.*)", "/about.html", "/about.html/(.*)")
      .forRoutes("*");
  }
}
