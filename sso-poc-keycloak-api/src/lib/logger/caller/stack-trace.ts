/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const limit = Error.stackTraceLimit;
const trace = Error.prepareStackTrace;

type CallSite = {
    getThis(): unknown;
    getTypeName(): string | null;
    getFunction(): Function | undefined;
    getFunctionName(): string | null;
    getMethodName(): string | null;
    getFileName(): string | null;
    getLineNumber(): number | null;
    getColumnNumber(): number | null;
    isNative(): boolean;
    isToplevel(): boolean;
    isConstructor(): boolean;
    isEval(): boolean;
    getEvalOrigin(): string | undefined;
  };

function callsites(frames?: number | Function, origin?: Function) : CallSite[] {
  const originalStackTraceLimit = Error.stackTraceLimit;
  const originalPrepareStackTrace = Error.prepareStackTrace;

  frames = Math.abs(Math.floor(typeof frames === 'number' ? frames : 1)) || 1;
  origin = typeof origin === 'function' ? origin : undefined;

  Error.stackTraceLimit = origin ? frames : frames + 1;
  Error.prepareStackTrace = (_, stack) => stack;

  const error = new Error();
  Error.captureStackTrace(error, origin || callsites);
  const stack = origin ? (error.stack as unknown as CallSite[]) : (error.stack as unknown as CallSite[]).slice(1);

  Error.stackTraceLimit = originalStackTraceLimit;
  Error.prepareStackTrace = originalPrepareStackTrace;

  return stack;
}

export { callsites, CallSite };
