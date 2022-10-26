export interface ILogger {
    error(message: string, meta?: { function: string }): void;
    child: any
    log: any
}
