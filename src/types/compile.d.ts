import {gsap} from 'gsap';

export type TranspiledSectionOptions = gsap.AnimationVars | gsap.TimelineVars;

export type CodeMapping = {
  [key: string]: string
};
