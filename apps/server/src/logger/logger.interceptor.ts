import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map, tap } from "rxjs";
import { MyLogger } from "./logger.service";
import { Request, Response } from "express";

/*
Using this interceptor to log results of HTTP route calls.
The all exceptions filter will also write a log if an exception was caught.
*/
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: MyLogger) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    const ctx = context.switchToHttp();
                    const request = ctx.getRequest<Request>();
                    const response = ctx.getResponse<Response>();

                    this.logger.logHttp(request, response, now)
                }),
            )
    }
}