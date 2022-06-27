import {gsap} from 'gsap';
// @ts-ignore
import {ScrollTrigger} from 'gsap/ScrollTrigger.js';

import {parseGreenscript} from '../translation/parse';
import {compileGreenscript} from '../translation/compile';

import * as Types from '../types';

gsap.registerPlugin(ScrollTrigger);

const useGSAP = (inputScript: string) => {
  const parsedScript = parseGreenscript(inputScript);
  const {animations, options} = compileGreenscript(parsedScript);
  const currentTimeline = gsap.timeline(options);
  currentTimeline.addLabel('timelineID', Date.now().toString());
  const gsapInterface: Types.Hooks.AnimationsInterface = animations.reduce((
      output: Types.Hooks.AnimationsInterface,
      step: Types.Compile.CompiledAnimation,
  ): Types.Hooks.AnimationsInterface => {
    if (step.targets) {
      output.steps.push(() => {
        const targetsList = prepareTargetsList(step.targets);
        if (targetsList) {
          const handle = getGSAPHandle(currentTimeline, step.type);
          targetsList.forEach((targetElement) => {
            handle(targetElement, ...Object.values(step.vars));
          });
          return targetsList;
        }
      });
    }
    return output;
  }, {
    steps: [],
    getTimeline: () => currentTimeline,
    setup: (
        targets: gsap.TweenTarget | Array<string>,
        vars: gsap.TweenVars,
        prehook?: CallableFunction,
        position?: gsap.Position | undefined,
    ) => {
      if (prehook) {
        if (targets instanceof Array) {
          targets.forEach((target: string) => prehook(target));
        }
        if (typeof targets === 'string') prehook(targets);
      }
      currentTimeline.set(targets, vars, position);
    },
    startAll: () => {
      return gsapInterface.steps.reduce((
          handlesResults: {[key: string]: string[]},
          handle: CallableFunction,
      ) => {
        handlesResults[handle.name] = handle();
        return handlesResults;
      }, {});
    },
  } as Types.Hooks.AnimationsInterface);
  return gsapInterface;
};

const getGSAPHandle = (
    timeline: gsap.core.Timeline,
    type: string,
): CallableFunction => {
  const timelinePrototype = Object.getPrototypeOf(timeline);
  const availableHandles = Object.keys(timelinePrototype);
  if (availableHandles.includes(type)) {
    return (target: HTMLElement, vars: gsap.AnimationVars) => {
      if (vars instanceof Array) {
        return timeline[type](target, ...vars);
      }
      return timeline[type](target, vars);
    };
  }
  return () => console.error(`Invalid animation type: ${type}`);
};

const prepareTargetsList = (targets: string[]) => {
  return targets.reduce(
      (targetsList: HTMLElement[],
          target: string,
      ) => {
        const queryFromDOM: HTMLElement | null = document.querySelector(target);
        if (queryFromDOM) targetsList.push(queryFromDOM);
        return targetsList;
      }, []);
};

export default useGSAP;
