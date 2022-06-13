/* eslint-disable require-jsdoc */
import useGSAP from '../src/hooks/useGSAP';

import * as Utils from './utils';
import renderTestElement from './TestComponent';

describe('Test common GSAP handles', () => {
  ['from', 'to', 'fromTo', 'set'].forEach((handleName: string) => {
    test(handleName, () => {
      const target = renderTestElement();
      const animation = Utils.testAnimations[handleName];
      animation.targets = `#${target}`;
      const testInterface = useGSAP(
          Utils.testTimelineOptions,
          [animation, {
            name: 'dummy',
            type: 'to',
            targets: `#${target}`,
            vars: {
              opacity: 0.33,
            },
          }],
      );

      const generatedFunction = testInterface[`${handleName}Test`];
      const animationFunctionIsValid = Utils.isItAnAnimatonFunction(generatedFunction);
      const interfaceHasStartAllHandle = Utils.isItAnAnimatonFunction(testInterface.startAll);

      expect(animationFunctionIsValid).toBeTruthy();
      expect(interfaceHasStartAllHandle).toBeTruthy();

      const animatedElement = generatedFunction()[0];
      console.log(animatedElement.style);

      document.querySelector(`#${target}`).remove();
    });
  });
});


