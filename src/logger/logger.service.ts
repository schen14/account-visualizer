import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import { WinstonLogger } from 'nest-winston';
import { instance as logger } from './winston.config'
import { Request, Response } from 'express';

/*
Notes:

I think by wrapping WinstonLogger in my own logger and exporting that as a provider/service, 
I can keep dependency injection if I want to test other loggers.

The instance logger defined in the config file is passed into the constructor.

Normally, the logger would be a singleton, so I can't set its context in one module without affecting another.
Transient scope allows for unique instances of loggers in different modules, 
and each can have their own context set from within other constructors, 
so I don't have to keep passing it into the logger methods.

ex: this.logger.log(msg, context) => this.logger.log(msg)
*/

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends WinstonLogger {
    constructor() {
        super(logger)
    }

    logHttp(req: Request, res: Response, startTimestamp?: number) {
        const CONTEXT = 'HTTP'
        const { method, url, body } = req; 
        const jsonBody = method === 'GET' ? null : JSON.stringify(body)
        const { statusCode } = res;
        const statusName = HttpStatus[statusCode]
        const delay = startTimestamp ? ` ${Date.now() - startTimestamp}ms` : null
        
        this.log([`${method} ${url}`, jsonBody, `${statusCode} ${statusName}`, delay]
                    .filter(c => (c))
                    .join(' : '), 
                CONTEXT)
        
    }
  }