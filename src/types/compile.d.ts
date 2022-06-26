import {gsap} from 'gsap';

export type TranspiledLine = {
  targets: string[],
  options: TranspiledSectionOptions[],
  type?: string,
};

export type TranspiledSectionOptions = gsap.AnimationVars | gsap.TimelineVars;

export type CompiledLine = {
  timelineOptions?: gsap.TimelineVars
  targets?: string[],
  name?: string,
  type?: string,
  vars?: gsap.AnimationVars,
};

export type CompiledScript = {
  options: gsap.TimelineVars,
  animations: {
    [key: string]: CompiledAnimation
  }[]
};
