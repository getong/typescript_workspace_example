import { createLogger, format, transports } from "winston";

const { combine, timestamp, errors, printf, colorize, splat } = format;

const logFormat = printf(
  ({ timestamp, level, message, context, stack, ...metadata }) => {
    const contextLabel = context ? `[${context}] ` : "";
    const metadataString =
      metadata && Object.keys(metadata).length > 0
        ? ` ${JSON.stringify(metadata)}`
        : "";
    const stackOutput = stack ? `\n${stack}` : "";
    return `${timestamp} ${level}: ${contextLabel}${message}${metadataString}${stackOutput}`;
  },
);

const defaultLogLevel =
  process.env.LOG_LEVEL ??
  (process.env.NODE_ENV === "production" ? "info" : "debug");

export const logger = createLogger({
  level: defaultLogLevel,
  format: combine(timestamp(), errors({ stack: true }), splat(), logFormat),
  transports: [
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

export function createContextLogger(context: string) {
  return logger.child({ context });
}

export type AppLogger = ReturnType<typeof createContextLogger>;
