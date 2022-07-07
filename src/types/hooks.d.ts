import * as Compile from './compile';

export type GreenscriptInterface = {
  rawSource: string,
  compiledSource: Compile.CompiledScript,
  steps: CallableFunction[],
  getTimeline: CallableFunction,
  setup: CallableFunction,
  startAll: CallableFunction,
};
