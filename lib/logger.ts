/**
 * Simple logger utility for consistent error logging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, any>;
    error?: Error;
}

class Logger {
    private formatMessage(entry: LogEntry): string {
        const { level, message, timestamp, context, error } = entry;
        let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

        if (context && Object.keys(context).length > 0) {
            logMessage += ` | Context: ${JSON.stringify(context)}`;
        }

        if (error) {
            logMessage += ` | Error: ${error.message}`;
            if (error.stack) {
                logMessage += ` | Stack: ${error.stack}`;
            }
        }

        return logMessage;
    }

    private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            error,
        };

        const formattedMessage = this.formatMessage(entry);

        switch (level) {
            case 'error':
                console.error(formattedMessage);
                // In production, you might want to send to error tracking service
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'debug':
                if (process.env.NODE_ENV === 'development') {
                    console.debug(formattedMessage);
                }
                break;
            default:
                console.log(formattedMessage);
        }
    }

    info(message: string, context?: Record<string, any>) {
        this.log('info', message, context);
    }

    warn(message: string, context?: Record<string, any>) {
        this.log('warn', message, context);
    }

    error(message: string, error?: Error, context?: Record<string, any>) {
        this.log('error', message, context, error);
    }

    debug(message: string, context?: Record<string, any>) {
        this.log('debug', message, context);
    }
}

export const logger = new Logger();

