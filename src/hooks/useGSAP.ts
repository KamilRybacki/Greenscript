import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger.js';

import * as Types from '@types/useGSAP';

gsap.registerPlugin(ScrollTrigger);

const getGSAPHandle = (
    timeline: gsap.core.Timeline,
    handleType: string,
): CallableFunction => {
  const timelinePrototype = Object.getPrototypeOf(timeline);
  const availableHandles = Object.keys(timelinePrototype);
  if (availableHandles.includes(handleType)) {
    return (target: HTMLElement, vars: gsap.AnimationVars) => {
      if (vars instanceof Array) {
        return timeline[handleType](target, ...vars);
      }
      return timeline[handleType](target, vars);
    };
  }
  return () => console.error(`Invalid animation type: ${handleType}`);
};

const prepareTargetsList = (targets: Types.PossibleAnimationTarget | Types.PossibleAnimationTarget[]) => {
  if (typeof targets === 'string') return [document.querySelector(targets)];
  if (targets instanceof HTMLElement) return [targets];
  if (targets instanceof Array) {
    return targets.reduce((targetsList: Types.PossibleAnimationTarget[], target: Types.PossibleAnimationTarget) => {
      if (typeof target === 'string') targetsList.push(document.querySelector(target));
      if (target instanceof HTMLElement) targetsList.push(target);
      return targetsList;
    }, []);
  }
};

const useGSAP = (
    timelineOptions: gsap.TimelineVars,
    animations: Types.AnimationStep[]): Types.AnimationsInterface => {
  const currentTimeline = gsap.timeline(timelineOptions);
  currentTimeline.addLabel('date', Date.now().toString());
  const animationInterface: Types.AnimationsInterface = animations.reduce(
      (outputInterface: Types.AnimationsInterface, step: Types.AnimationStep,
      ) => {
        const {type, name, targets, ...coreOptions} = step;
        if (targets) {
          outputInterface[name] = () => {
            const targetsList = prepareTargetsList(targets);
            if (targetsList) {
              const handle = getGSAPHandle(currentTimeline, type);
              targetsList.forEach((targetElement: HTMLElement) => {
                handle(targetElement, ...Object.values(coreOptions));
              });
            }
          };
        }
        return outputInterface;
      }, {
        'setup': (
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
      });
  animationInterface['startAll'] = () => {
    const availableHandles: Array<CallableFunction> = Object.values<CallableFunction>(animationInterface).slice(1, -1);
    availableHandles.forEach((handle: CallableFunction) => handle());
  };
  return animationInterface;
};

export default useGSAP;
