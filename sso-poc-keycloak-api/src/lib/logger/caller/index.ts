/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import * as FileSystem from 'fs';
import * as Path from 'path';
import * as util from 'util';
import * as StackTrace from './stack-trace';

type CallSite = {
  getFileName(): string;
  getLineNumber(): number;
  getColumnNumber(): number;
  isNative(): boolean;
};

class CallerModule {
  public name = '';
  public root = '';
  public callSite: StackTrace.CallSite;

  constructor(callSite: StackTrace.CallSite) {
    this.callSite = callSite;
  }

  get path(): string {
    return this.callSite.getFileName() ?? '';
  }

  toString(): string {
    return `${this.path}:${this.callSite.getLineNumber()}:${this.callSite.getColumnNumber()}`;
  }
}

function GetCallerModule(method?: Function | number, level?: number): CallerModule {
  let origin: Function | undefined;
  let frames: number | undefined;

  if (typeof method === 'number') {
    origin = GetCallerModule;
    frames = method;
  } else if (method !== null && method !== undefined) {
    origin = method;
    frames = level;
  }

  const stack: StackTrace.CallSite[] = StackTrace.callsites(frames, origin);

  if (!stack || stack.length === 0) {
    throw new Error('Stack trace could not be determined.');
  }
  
  const frameIndex = stack.length > 1 ? 1 : 0;
  const result = new CallerModule(stack[frameIndex]);

  if (result.path === Path.basename(result.path)) {
    result.name = result.path;
    result.root = result.callSite.isNative() ? 'V8' : 'node';
  } else {
    if (!result.path.split(Path.sep).includes('node_modules')) {
      let root = Path.dirname(result.path);
      let oldRoot: string | null = null;

      const isModuleRoot = (dir: string): boolean => {
        try {
          const files = FileSystem.readdirSync(dir).filter(
            (file) => !FileSystem.lstatSync(Path.join(dir, file)).isDirectory()
          );
          return files.includes('package.json');
        } catch {
          return false;
        }
      };

      while (!isModuleRoot(root) && root !== oldRoot) {
        oldRoot = root;
        root = Path.resolve(root, '..');
      }

      result.root = root;
    } else {
      const pathTree = result.path.split(Path.sep);
      const moduleFolderIndex = pathTree.indexOf('node_modules') + 1;
      result.root = pathTree.slice(0, moduleFolderIndex + 1).join(Path.sep);
    }

    try {
      const pkg = require(Path.join(result.root, 'package.json'));
      result.name = pkg.name;
    } catch {
      result.name = Path.basename(result.root);
    }
  }

  return result;
}

export { GetCallerModule };
