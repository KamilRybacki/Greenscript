import {gsap} from 'gsap';
// @ts-ignore
import {ScrollTrigger} from 'gsap/ScrollTrigger.js';

import {parseGreenscript} from '../translation/parse';
import {compileGreenscript} from '../translation/compile';

import * as Types from '../types';

gsap.registerPlugin(ScrollTrigger);

const useGreenscript = (inputScript: string): Types.Hooks.GreenscriptInterface | undefined => {
  const parsedScript = parseGreenscript(inputScript);
  const {name, animations, options} = compileGreenscript(parsedScript);
  if (Object.keys(options).length == 0) return undefined;

  const currentTimeline = gsap.timeline(options);
  currentTimeline.greenscriptName = name;
  const gsapInterface: Types.Hooks.GreenscriptInterface = animations.reduce((
      output: Types.Hooks.GreenscriptInterface,
      step: Types.Compile.CompiledAnimation,
  ): Types.Hooks.GreenscriptInterface => {
    const timelinePrototype = Object.getPrototypeOf(currentTimeline);
    const availableHandles = Object.keys(timelinePrototype);
    if (availableHandles.includes(step.type)) {
      if (step.targets) {
        output.steps.push((additionalVars?: gsap.TimelineVars[]) => {
          const targetsList = prepareTargetsList(step.targets);
          if (targetsList) {
            const handle = getGSAPHandle(currentTimeline, step.type);
            targetsList.forEach((targetElement) => {
              const animationStepVars: gsap.TimelineVars[] = step.vars;
              if (additionalVars) {
                additionalVars.forEach((additionalVarsSection: gsap.TimelineVars, sectionIndex: number) => {
                  animationStepVars[sectionIndex] = {...animationStepVars[sectionIndex], ...additionalVarsSection};
                });
              }
              handle(targetElement, ...animationStepVars);
            });
            return targetsList;
          }
        });
      }
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
  } as Types.Hooks.GreenscriptInterface);
  return gsapInterface.steps.length ? gsapInterface : undefined;
};

const getGSAPHandle = (
    timeline: gsap.core.Timeline,
    type: string,
): CallableFunction => {
  return (target: HTMLElement, vars: gsap.AnimationVars) => {
    if (vars instanceof Array) {
      return timeline[type](target, ...vars);
    }
    return timeline[type](target, vars);
  };
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

export default useGreenscript;
