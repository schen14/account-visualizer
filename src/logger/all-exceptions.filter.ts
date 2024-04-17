import { ArgumentsHost, Catch, HttpException, HttpStatus, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from "express";
// import { CustomHttpExceptionResponse, HttpExceptionResponse } from "./models/http-exception-interface";
import { BaseExceptionFilter, HttpAdapterHost } from "@nestjs/core";
import { MyLogger } from "./logger.service";

type CustomResponseObj = {
    statusCode: number,
    timeStamp: string,
    path: string,
    response: string | object,
    method: string,
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: MyLogger) {
        this.logger.setContext(AllExceptionsFilter.name)
    }

    // Typecasted exception as any instead of unknown, because I need to access exception.stack for Winston logger
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let errorMessage: string | object;
        
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            errorMessage = exception.getResponse();
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = 'Internal Server Error'
        }

        const errorResponse: CustomResponseObj = this.getErrorResponse(status, errorMessage, request)

        response.status(errorResponse.statusCode)
                .json(errorResponse)
        
        this.logger.error(errorResponse.response, exception.stack);
    }

    private getErrorResponse = (
        status: HttpStatus, 
        errorMessage: string | object,
        request: Request,
    ): CustomResponseObj => ({
        statusCode: status,
        response: errorMessage,
        method: request.method,
        path: request.url,
        timeStamp: new Date().toISOString(),
        
    })

}