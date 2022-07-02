import {gsap} from 'gsap';

import {isListValid} from '../utils';

import {compileAdditionalOptions} from '../translation/compile';
import * as Types from '../types';

const apply = (
    baseInterface: Types.Hooks.GreenscriptInterface,
    additionalOptions: Types.Upgrade.AdditionalOptions,
) : Types.Hooks.GreenscriptInterface => {
  if (typeof additionalOptions === 'string') {
    additionalOptions = compileAdditionalOptions(additionalOptions);
  }
  if (isListValid([additionalOptions])) {
    const newInterface = {...baseInterface};
    if ('timeline' in additionalOptions && additionalOptions.timeline) {
      goThroughTimelineAdditionalOptions(additionalOptions.timeline, newInterface.getTimeline());
    }
    if ('steps' in additionalOptions && additionalOptions.steps) {
      modifyChosenTimelineSteps(additionalOptions.steps, newInterface.steps);
    }
    return newInterface;
  }
  console.warn('Additional options dictionary is not valid. Returning original interface');
  return baseInterface;
};

const goThroughTimelineAdditionalOptions = (
    timelineAdditionalOptions: Types.Upgrade.TimelineAdditionalOptions,
    timeline: gsap.core.Timeline,
) : void => {
  if ('scrollTrigger' in timelineAdditionalOptions) gsap.registerPlugin(ScrollTrigger);
  const {callbacks, ...otherOptions} = timelineAdditionalOptions;
  for (const callback in callbacks) {
    if (callbacks.hasOwnProperty(callback)) {
      const callbackOptions = callbacks[callback as keyof typeof callbacks];
      if (callbackOptions?.callbackFunction && callbackOptions?.callbackParams) {
        const {callbackFunction, callbackParams} = callbackOptions;
        timeline.eventCallback(callback as gsap.CallbackType, callbackFunction, callbackParams);
      }
    }
  }
  for (const option in otherOptions) {
    if (otherOptions.hasOwnProperty(option)) {
      timeline[option] = otherOptions[option as keyof typeof otherOptions];
    }
  }
};

const modifyChosenTimelineSteps = (
    stepsToModify: Types.Upgrade.AnimationStepAdditionalOptions[], interfacedSteps: CallableFunction[],
) => {
  stepsToModify.forEach((stepToModify) => {
    const {stepIndex, ...otherStepAdditionalVars} = stepToModify;
    interfacedSteps[stepIndex] = () => {
      interfacedSteps[stepIndex](otherStepAdditionalVars);
    };
  });
};

export default apply;
