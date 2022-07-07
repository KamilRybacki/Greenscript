
import {gsap} from 'gsap';

import gsc from '../src/hooks/gsc';

describe('Test adding ScrollTrigger to Greenscript', () => {
  const testElement = document.createElement('div');
  const stepDummyElement = document.createElement('p');

  const testScrollTrigger = {
    trigger: testElement,
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
  const stepWithScrollTriggerFromGSAP = gsap.to(
      stepDummyElement, {
        opacity: 0.5,
        scrollTrigger: testScrollTrigger,
      },
  );

  describe('Check if passing ScrollTrigger works using additional options', () => {
    test('Test prepared mock HTML elements and GSAP objects', () => {
      [testElement, timelineCreatedWithGSAP, stepWithScrollTriggerFromGSAP]
          .forEach((element) => expect(element).toBeTruthy());

      expect(testElement).toBeInstanceOf(HTMLDivElement);
      expect(timelineCreatedWithGSAP).toBeInstanceOf(gsap.core.Timeline);
      expect(stepWithScrollTriggerFromGSAP).toBeInstanceOf(gsap.core.Tween);

      [timelineCreatedWithGSAP, stepWithScrollTriggerFromGSAP]
          .forEach(({vars}) => expect(Object.keys(vars)).toContain('scrollTrigger'));
    });
    test('ScrollTrigger for timeline', () => {
      const interfaceWithScrollTriggerForTimeline = gsc({
        timeline: {
          scrollTrigger: testScrollTrigger,
        },
      })`
          [ScrollTriggerTest](d=2.0)
          >fromTo[#anotherTestElement](o=0.25)(o=0.5)
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
          >fromTo[#anotherTestElement](o=0.25)(o=0.5)
      `;
      const modifiedStep = interfaceWithScrollTriggerForStep.steps[0];
    });
  });
});
