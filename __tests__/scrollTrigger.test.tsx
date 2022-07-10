import {gsap} from 'gsap';

import gsc from '../src/hooks/gsc';

import * as Mocks from '../__mocks__/greenscriptMocks';

describe('Test adding ScrollTrigger to Greenscript', () => {
  const triggerElement = document.createElement('div');
  const testElement = document.createElement('div');
  testElement.id = 'testElement';

  const testScrollTrigger = {
    trigger: triggerElement,
    start: 'bottom top',
    end: 'bottom bottom',
    scrub: 1,
    once: true,
    onScrubComplete: () => {
      console.log('[JEST] onScrubComplete callback function called');
    },
  };
  const timelineCreatedWithGSAP = gsap.timeline({
    delay: 0.5,
    scrollTrigger: testScrollTrigger,
  });

  describe('Check if passing ScrollTrigger works using additional options', () => {
    test('Test prepared mock HTML elements and GSAP objects', () => {
      [triggerElement, timelineCreatedWithGSAP]
          .forEach((element) => expect(element).toBeTruthy());

      expect(triggerElement).toBeInstanceOf(HTMLDivElement);
      expect(timelineCreatedWithGSAP).toBeInstanceOf(gsap.core.Timeline);

      [timelineCreatedWithGSAP]
          .forEach(({vars}) => expect(Object.keys(vars)).toContain('scrollTrigger'));
    });
    test('ScrollTrigger for timeline', () => {
      const interfaceWithScrollTriggerForTimeline = gsc({
        timeline: {
          scrollTrigger: testScrollTrigger,
        },
      })`
          [ScrollTriggerTest](d=2.0)
          >to[#testElement](o=0.5)
      `;

      const timelineFromInterface = interfaceWithScrollTriggerForTimeline.timeline;
      const scrollTriggerFromOurTimeline = timelineFromInterface.scrollTrigger;
      const scrollTriggerFromGSAPTimelime = timelineCreatedWithGSAP.scrollTrigger;
      expect(scrollTriggerFromOurTimeline.vars).toEqual(scrollTriggerFromGSAPTimelime.vars);
    });
    test('ScrollTrigger for animation step', () => {
      const interfaceWithScrollTriggerForStep = gsc({
        steps: [{
          stepIndex: 0,
          scrollTrigger: testScrollTrigger,
        }],
      })`
          [ScrollTriggerTest](d=2.0)
          >to[#testElement](o=0.5)
      `;
      const modifiedStep = interfaceWithScrollTriggerForStep.steps[0];
      const modifiedStepCode = modifiedStep.toString().replace(/\s/g, '');
      expect(modifiedStepCode).toBe(Mocks.modifiedCompiledStepCode.replace(/\s/g, ''));
    });
  });
});
