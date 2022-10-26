import winston from "winston";
import path from "path";
import { ILogger } from "..";


const errorsFile = path.join(__dirname, "..", "..", "..", "logs", "errors.log");


const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

// const logLikeFormat = {
//     transform(info: any) {
//         const { timestamp, label, message } = info;
//         const level = info[Symbol.for('level')];
//         const args = info[Symbol.for('splat')];
//         const strArgs = args.map((x: any) => JSON.stringify(x)).join(' ');
//         info[Symbol.for('message')] = `${timestamp} [${label}] ${level}: ${message} ${strArgs}`;
//         return info;
//     }
// };

export const logger: ILogger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        // debugFormat, // uncomment to see the internal log structure
        winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A', // 2022-01-25 03:23:10.350 PM
        }),
        winston.format.label({ label: 'myLabel' }),
        winston.format.json(),

        // logLikeFormat,
        // debugFormat, // uncomment to see the internal log structure
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'],
        }),
        new winston.transports.File({ filename: errorsFile, level: "error" }),
    ],
});
