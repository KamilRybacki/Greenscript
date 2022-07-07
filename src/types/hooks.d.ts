import gsap from 'gsap';

import * as Compile from './compile';

export type GreenscriptInterface = {
  rawSource: string,
  compiledSource: Compile.CompiledScript,
  steps: CallableFunction[],
  timeline: gsap.core.Timeline,
  setup: CallableFunction,
  startAll: CallableFunction,
};
