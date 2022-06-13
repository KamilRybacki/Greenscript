import {gsap} from 'gsap';

export type PossibleAnimationTarget = string | HTMLElement;

export type AnimationStep = {
  targets: string | HTMLElement
  name: string
  type: string
  vars: gsap.AnimationVars
};

export type AnimationsInterface = {
  [index: string]: CallableFunction;
};
