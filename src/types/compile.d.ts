import {gsap} from 'gsap';

export type TranspiledLine = {
  targets: string[],
  options: TranspiledSectionOptions[],
  type: string,
};

export type TranspiledSectionOptions = gsap.AnimationVars | gsap.TimelineVars;

export type CompiledTimeline = {
  timelineOptions: gsap.TimelineVars,
};

export type CompiledAnimation = {
  targets: string[],
  type: string,
  vars: gsap.AnimationVars,
};

export type CompiledScript = {
  options: gsap.TimelineVars,
  animations: CompiledAnimation[],
};
