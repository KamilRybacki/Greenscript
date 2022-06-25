import {gsap} from 'gsap';

export type TranspiledSectionOptions = gsap.AnimationVars | gsap.TimelineVars;

export type CodeMapping = {
  [key: string]: {

  }
};

export type CompiledLine = {
  timelineOptions?: gsap.TimelineVars
} & CompiledAnimation;

export type CompiledAnimation = {
  targets?: string[] | string,
  name?: string,
  type?: string,
  vars?: gsap.AnimationVars,
}

export type CompiledScript = {
  options: gsap.TimelineVars,
  animations: {
    [key: string]: CompiledAnimation
  }[]
};
