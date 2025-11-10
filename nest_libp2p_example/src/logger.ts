import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mapSourcePosition } from "source-map-support";
import {
  createLogger,
  format,
  transports,
  type Logger as WinstonLogger,
} from "winston";

const { combine, timestamp, errors, printf, colorize, splat } = format;

type LogMetadata = Record<string, unknown>;

type CallerLocation = {
  file?: string;
  line?: number;
};

type StackFrameLocation = {
  filePath: string;
  lineNumber: number;
  columnNumber: number;
};

const logFormat = printf(
  ({
    timestamp,
    level,
    message,
    module,
    context,
    line,
    file,
    pid,
    stack,
    ...metadata
  }) => {
    const moduleLabel = module ?? context;
    const locationBits = [moduleLabel, line, file]
      .filter((value) => value != null && value !== "")
      .map((value) => `${value}`);
    const locationLabel =
      locationBits.length > 0 ? `[${locationBits.join(":")}] ` : "";
    const pidLabel = pid != null ? `[pid:${pid}] ` : "";
    const metadataString =
      metadata && Object.keys(metadata).length > 0
        ? ` ${JSON.stringify(metadata)}`
        : "";
    const stackOutput = stack ? `\n${stack}` : "";
    return `${timestamp} ${pidLabel}${level}: ${locationLabel}${message}${metadataString}${stackOutput}`;
  },
);

const defaultLogLevel =
  process.env.LOG_LEVEL ??
  (process.env.NODE_ENV === "production" ? "info" : "debug");

const configuredLogFile = process.env.LOG_FILE ?? "logs/app.log";
const logFilePath = path.isAbsolute(configuredLogFile)
  ? configuredLogFile
  : path.resolve(process.cwd(), configuredLogFile);

function ensureLogDirectory(filePath: string): void {
  try {
    mkdirSync(path.dirname(filePath), { recursive: true });
  } catch {
    // ignore directory creation errors; Winston will surface write issues
  }
}

ensureLogDirectory(logFilePath);

export const logger = createLogger({
  level: defaultLogLevel,
  format: combine(timestamp(), errors({ stack: true }), splat(), logFormat),
  transports: [
    new transports.File({
      filename: logFilePath,
      handleExceptions: true,
      format: combine(timestamp(), errors({ stack: true }), splat(), logFormat),
    }),
    new transports.Console({
      handleExceptions: true,
      format: combine(
        colorize({ all: true }),
        timestamp(),
        errors({ stack: true }),
        splat(),
        logFormat,
      ),
    }),
  ],
});

function getCallerLocation(): CallerLocation {
  const stack = new Error().stack;
  if (stack == null) {
    return {};
  }

  const [, ...stackLines] = stack.split("\n");
  for (const line of stackLines) {
    const frame = parseStackLine(line);
    if (frame == null) {
      continue;
    }
    if (
      frame.filePath.includes("logger.ts") ||
      frame.filePath.includes("logger.js")
    ) {
      continue;
    }
    return mapToSource(frame);
  }

  return {};
}

function parseStackLine(line: string): StackFrameLocation | undefined {
  const trimmed = line.trim();
  if (trimmed.length === 0 || !trimmed.startsWith("at ")) {
    return undefined;
  }

  const locationMatch =
    trimmed.match(/at [^(]*\((.+):(\d+):(\d+)\)$/) ??
    trimmed.match(/at (.+):(\d+):(\d+)$/);
  if (!locationMatch) {
    return undefined;
  }

  const [, rawPath, rawLine, rawColumn] = locationMatch;
  const filePath = normalizeFilePath(rawPath ?? "");
  const lineNumber = Number.parseInt(rawLine ?? "", 10);
  const columnNumber = Number.parseInt(rawColumn ?? "", 10);
  if (!Number.isFinite(lineNumber) || !Number.isFinite(columnNumber)) {
    return undefined;
  }

  return {
    filePath,
    lineNumber,
    columnNumber,
  };
}

function normalizeFilePath(filePath: string): string {
  if (filePath.startsWith("file://")) {
    try {
      return fileURLToPath(filePath);
    } catch {
      return filePath;
    }
  }
  return filePath;
}

function mapToSource(location: StackFrameLocation): CallerLocation {
  try {
    const mapped = mapSourcePosition({
      source: location.filePath,
      line: location.lineNumber,
      column: location.columnNumber,
    });
    const resolvedPath = mapped.source
      ? normalizeFilePath(mapped.source)
      : location.filePath;
    return {
      file: formatDisplayPath(resolvedPath),
      line: mapped.line ?? location.lineNumber,
    };
  } catch {
    return {
      file: formatDisplayPath(location.filePath),
      line: location.lineNumber,
    };
  }
}

function formatDisplayPath(filePath: string): string {
  const relative = path.relative(process.cwd(), filePath);
  if (relative.length === 0 || relative.startsWith("..")) {
    return path.basename(filePath);
  }
  return relative;
}

type LogMethod = (message: string, meta?: unknown) => WinstonLogger;

function normalizeMeta(meta?: unknown): LogMetadata {
  if (meta == null) {
    return {};
  }
  if (typeof meta === "object" && !Array.isArray(meta)) {
    return meta as LogMetadata;
  }
  return { value: meta } satisfies LogMetadata;
}

function createLevelLogger(
  destination: WinstonLogger,
  level: string,
  moduleName: string,
): LogMethod {
  return (message: string, meta?: unknown) => {
    const callerLocation = getCallerLocation();
    const mergedMeta = {
      pid: process.pid,
      module: moduleName,
      context: moduleName,
      ...callerLocation,
      ...normalizeMeta(meta),
    } satisfies Record<string, unknown>;
    return destination.log(level, message, mergedMeta);
  };
}

export interface AppLogger {
  error: LogMethod;
  warn: LogMethod;
  info: LogMethod;
  debug: LogMethod;
}

export function createContextLogger(context: string): AppLogger {
  const destination = logger.child({ module: context, context });
  return {
    error: createLevelLogger(destination, "error", context),
    warn: createLevelLogger(destination, "warn", context),
    info: createLevelLogger(destination, "info", context),
    debug: createLevelLogger(destination, "debug", context),
  } satisfies AppLogger;
}
