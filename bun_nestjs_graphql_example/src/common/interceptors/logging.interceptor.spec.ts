import { Test, TestingModule } from "@nestjs/testing";
import { LoggingInterceptor } from "./logging.interceptor";
import { ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, of } from "rxjs";

describe("LoggingInterceptor", () => {
  let interceptor: LoggingInterceptor;

  beforeEach(async () => {
    interceptor = new LoggingInterceptor();
  });

  it("should be defined", () => {
    expect(interceptor).toBeDefined();
  });

  it("should log HTTP requests and responses", (done) => {
    const mockContext = {
      getType: () => "http",
      switchToHttp: () => ({
        getRequest: () => ({
          method: "GET",
          url: "/test",
        }),
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler = {
      handle: () => of({ data: "test" }),
    } as CallHandler;

    const result$ = interceptor.intercept(mockContext, mockCallHandler);

    result$.subscribe({
      next: (value) => {
        expect(value).toEqual({ data: "test" });
        done();
      },
    });
  });
});
