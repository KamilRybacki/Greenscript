import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

import {isListValid} from '../utils';
import * as Types from '../types';

const apply = (
    baseInterface: Types.Hooks.GreenscriptInterface,
    additionalOptions: Types.Upgrade.AdditionalOptions,
) : Types.Hooks.GreenscriptInterface => {
  if (isListValid([additionalOptions])) {
    const newInterface = {...baseInterface};
    if ('timeline' in additionalOptions && additionalOptions.timeline) {
      applyTimelineAdditionalOptions(additionalOptions.timeline, newInterface.timeline);
    }
    if ('steps' in additionalOptions && additionalOptions.steps) {
      applyStepsAdditionalOptions(additionalOptions.steps, newInterface.steps);
    }
    return newInterface;
  }
  if (additionalOptions !== {}) console.warn('Additional options are not valid. Returning original interface');
  return baseInterface;
};

const applyTimelineAdditionalOptions = (
    timelineAdditionalOptions: Types.Upgrade.TimelineAdditionalOptions,
    timeline: gsap.core.Timeline,
) : void => {
  if ('scrollTrigger' in timelineAdditionalOptions) gsap.registerPlugin(ScrollTrigger);
  const {callbacks, scrollTrigger, ...otherOptions} = timelineAdditionalOptions;
  for (const callback in callbacks) {
    if (callbacks.hasOwnProperty(callback)) {
      const callbackOptions = callbacks[callback as keyof typeof callbacks];
      if (callbackOptions?.callbackFunction && callbackOptions?.callbackParams) {
        const {callbackFunction, callbackParams} = callbackOptions;
        timeline.eventCallback(callback as gsap.CallbackType, callbackFunction, callbackParams);
      }
    }
  }
  if (scrollTrigger) {
    const spawnedScrollTrigger = ScrollTrigger.create(scrollTrigger);
    // @ts-ignore
    timeline.scrollTrigger = spawnedScrollTrigger;
  };
  for (const option in otherOptions) {
    if (otherOptions.hasOwnProperty(option)) {
      timeline[option] = otherOptions[option as keyof typeof otherOptions];
    }
  }
};

const applyStepsAdditionalOptions = (
    stepsToModify: Types.Upgrade.AnimationStepAdditionalOptions[], interfacedSteps: CallableFunction[],
) => {
  stepsToModify.forEach((stepToModify) => {
    const {stepIndex, ...otherStepAdditionalVars} = stepToModify;
    const clonedStepFunction = interfacedSteps[stepIndex].bind({});
    interfacedSteps[stepIndex] = () => {
      return clonedStepFunction(otherStepAdditionalVars);
    };
  });
};

export default apply;
