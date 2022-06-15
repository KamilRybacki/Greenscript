/* eslint-disable require-jsdoc */
import renderTestElement from '../__mocks__/TestComponent';
import {testElementInnerHTML} from '../__mocks__/TestComponent';

export const isItAnAnimatonFunction = (input: CallableFunction | null) => {
  const sourceCode = input?.toString();
  return sourceCode ? input &&
    (input instanceof Function) &&
    (sourceCode.includes('getGSAPHandle') || sourceCode.includes('availableHandles.reduce')) : false;
};

describe('Test common GSAP handles', () => {
  ['from', 'to', 'fromTo', 'set'].forEach((handleName: string) => {
    test(handleName, () => {
      const [renderedElement, testInterface] = renderTestElement(handleName);
      expect(renderedElement.innerHTML).toEqual(testElementInnerHTML);

      const generatedFunction = testInterface[`${handleName}Test`];
      expect([
        isItAnAnimatonFunction(generatedFunction),
        isItAnAnimatonFunction(testInterface.startAll),
      ]).not.toContain(false);

      const testTimeline = testInterface.getTimeline();
      const timelineLastStep = testTimeline._last.vars;
      const timelineFirstStep = testTimeline._first.vars;

      expect([
        timelineFirstStep.opacity === 0.25,
        timelineLastStep.opacity === 0.33,
      ]).not.toContain(false);

      renderedElement.remove();
    });
  });
});
