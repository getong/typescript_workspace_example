import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SqlFileLoaderService } from "./sql-file-loader.service.js";

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value == null) {
    return fallback;
  }

  const normalized = value.toLowerCase().trim();
  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const synchronize = parseBoolean(
          process.env.POSTGRES_SYNCHRONIZE ??
            process.env.TYPEORM_SYNCHRONIZE ??
            process.env.TYPEORM_SYNC,
          true,
        );

        const logging = parseBoolean(
          process.env.POSTGRES_LOGGING ??
            process.env.TYPEORM_LOGGING ??
            process.env.TYPEORM_LOG,
          false,
        );

        const portRaw = process.env.POSTGRES_PORT ?? "5432";
        const port = Number.parseInt(portRaw, 10);

        return {
          type: "postgres" as const,
          host: process.env.POSTGRES_HOST ?? "127.0.0.1",
          port: Number.isFinite(port) ? port : 5432,
          username: process.env.POSTGRES_USER ?? "nestapp",
          password: process.env.POSTGRES_PASSWORD ?? "supersecret",
          database: process.env.POSTGRES_DB ?? "nestlibp2p",
          synchronize,
          autoLoadEntities: true,
          logging,
        };
      },
    }),
  ],
  providers: [SqlFileLoaderService],
})
export class DatabaseModule {}
