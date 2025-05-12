import { Module } from "@nestjs/common";
import { AppGateway } from "./web-socket";
import { AppController } from "./app.controller";
import { ServeStaticModule } from "@nestjs/serve-static";
import path from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), "public"),
      serveRoot: "/",
    }),
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {}
