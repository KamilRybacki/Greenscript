import {gsap} from 'gsap';

export type ScriptLineData = {
  _source: string,
  type: string,
  data: gsap.TimelineVars | gsap.AnimationVars,
};
