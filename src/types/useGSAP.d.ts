import {gsap} from 'gsap';

export type PossibleAnimationTarget = string | HTMLElement;

export type AnimationOptions = gsap.AnimationVars & {
  type: string
  name: string
};

export type AnimationStep = {
  targets: string | HTMLElement
  name: string
  options: AnimationOptions
};

type AnimationStepHandle = (timeline: gsap.core.Timeline) => void;
export type AnimationsInterface = {
  [index: string]: AnimationStepHandle;
};
