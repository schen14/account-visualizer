import { createLogger, format, transports, addColors } from "winston";
import 'winston-daily-rotate-file';
// import * as SlackHook from 'winston-slack-webhook-transport';
// import * as winstonMongoDB from 'winston-mongodb';

addColors({context: 'yellow'})
const customFormat = format.printf(({timestamp, level, context, stack, message}) => {
    let colorizer = format.colorize()
    let ts = new Date(timestamp).toLocaleString()
    return `${ts} - [${level}] - [${colorizer.colorize('context', context)}] - ${stack ? stack + '\n' + message : message}`
})

const options = {
    file: {
        filename: 'logs/error.log',
        level: 'error',
    },
    console: {
        level: 'silly',
    },
    dailyRotateFile: {
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
    },
}

const devLogger = {
    format: format.combine(
        format.timestamp(),
        format.errors({stack: true}),
        format.colorize({all: true}),
        // format.align(),
        customFormat,
    ),
    transports: [new transports.Console(options.console)]
}

const prodLogger = {
    format: format.combine(
        format.timestamp(),
        format.errors({stack: true}),
        format.json()
    ),
    transports: [
        new transports.DailyRotateFile(options.dailyRotateFile),
        new transports.File({
            filename: 'combine.log',
            level: 'info'
        })
    ]
}

const instanceLogger = (process.env.NODE_ENV === 'production') ? prodLogger : devLogger

export const instance = createLogger(instanceLogger)