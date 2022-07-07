import {ScrollTrigger} from 'gsap/ScrollTrigger.js';

export type AdditionalOptions = {
  timeline?: TimelineAdditionalOptions,
  steps?: AnimationStepAdditionalOptions[]
};

export type TimelineAdditionalOptions = TimingOptions & {
  autoRemove?: boolean,
  callbacks: {
    onComplete?: TimelineCallbackOptions,
    onStart?: TimelineCallbackOptions,
    onUpdate?: TimelineCallbackOptions,
    onReverseComplete?: TimelineCallbackOptions,
    onReverseStart?: TimelineCallbackOptions,
    onReverseUpdate?: TimelineCallbackOptions,
  }
}

export type AnimationStepAdditionalOptions = {
  stepIndex: number,
  data?: any,
} & TimingOptions;

export type TimelineCallbackOptions = {
  callbackFunction: CallableFunction,
  callbackParams?: any[],
};

export type TimingOptions = {
  scrollTrigger?: ScrollTrigger,
  yoyo?: boolean,
  timeScale?: number,
  repeat?: number,
  repeatDelay?: number,
};
