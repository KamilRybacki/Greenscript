import {gsap} from 'gsap';

export type PrecompiledLine = {
  targets: string[],
  options: TranslatedSectionOptions[],
  type: string,
};

export type TranslatedSectionOptions = gsap.AnimationVars | gsap.TimelineVars;

export type CompiledTimeline = {
  name: string,
  timelineOptions: gsap.TimelineVars[],
};

export type CompiledAnimation = {
  targets: string[],
  type: string,
  vars: gsap.AnimationVars[],
};

export type CompiledScript = {
  name: string,
  options: gsap.TimelineVars,
  animations: CompiledAnimation[],
};
