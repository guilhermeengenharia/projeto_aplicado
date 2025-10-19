import { LogLevel } from '../log';
import { GenericLogDecorator } from './generic-log-decorator';

class LogDecorator extends GenericLogDecorator {
    /**
     * Decorator for logging method at debug level.
     * LogLevel.DEBUG has the lowest priority and includes logs of level `debug`, `info`, and `warn`.
     * 
     * @remarks 
     * Use this decorator to track methods with detailed information for debugging purposes.
     * Provides detailed information to identify and fix issues during development or testing.
     */
    log = () => (target: any, key: PropertyKey, descriptor: PropertyDescriptor) => LogDecorator.apply(key, descriptor, LogLevel.DEBUG);

    /**
     * Decorator for logging method at info level.
     * LogLevel.INFO has a medium priority and includes logs of level `info` and `warn`.
     * 
     * @remarks 
     * Use this decorator to track methods during normal or routine operations.
     * Provides information about the application's execution flow without overloading the logs with excessive details.
     */
    info = () => (target: any, key: PropertyKey, descriptor: PropertyDescriptor) => LogDecorator.apply(key, descriptor, LogLevel.INFO);

    /**
     * Decorator for logging method at warn level.
     * LogLevel.WARN has the highest priority and includes logs of level `warn`.
     * 
     * @remarks 
     * Use this decorator to track methods in potentially problematic situations.
     * Identifies and resolves issues and unexpected conditions.
     */
    warn = () => (target: any, key: PropertyKey, descriptor: PropertyDescriptor) => LogDecorator.apply(key, descriptor, LogLevel.WARN);
}
const decorator: LogDecorator = new LogDecorator();
const { log } = decorator;
const { info } = decorator;
const { warn } = decorator;
export { log, info, warn };
