import { Injectable } from "@nestjs/common";
import type { OnModuleInit } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DataSource } from "typeorm";
import { createContextLogger } from "../logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");

@Injectable()
export class SqlFileLoaderService implements OnModuleInit {
  private readonly logger = createContextLogger(SqlFileLoaderService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    const sqlFile = this.resolveSqlFilePath();

    try {
      await access(sqlFile);
    } catch {
      this.logger.debug(`SQL bootstrap file not found at ${sqlFile}`);
      return;
    }

    const statements = await this.loadStatements(sqlFile);
    if (statements.length === 0) {
      this.logger.debug(
        `SQL bootstrap file ${sqlFile} contained no statements`,
      );
      return;
    }

    this.logger.info(
      `Executing ${statements.length} SQL statement(s) from ${sqlFile}`,
    );

    for (const statement of statements) {
      const preview =
        statement.length > 120 ? `${statement.slice(0, 117)}...` : statement;
      try {
        await this.dataSource.query(statement);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Failed to execute SQL statement "${preview}": ${message}`,
        );
      }
    }
  }

  private resolveSqlFilePath(): string {
    const override = process.env.POSTGRES_SQL_FILE;
    if (override != null && override.length > 0) {
      return path.resolve(projectRoot, override);
    }

    return path.resolve(projectRoot, "sql", "schema.sql");
  }

  private async loadStatements(filePath: string): Promise<string[]> {
    const raw = await readFile(filePath, "utf8");
    const withoutLineComments = raw
      .split("\n")
      .map((line) => line.replace(/--.*$/, ""))
      .join("\n");

    const statements = withoutLineComments
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    return statements;
  }
}
