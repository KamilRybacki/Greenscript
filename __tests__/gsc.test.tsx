import {gsap} from 'gsap';

import gsc from '../src/hooks/gsc';

import * as Mocks from '../__mocks__/greenscriptMocks';

describe('Test using Greenscript with template strings ONLY', () => {
  beforeEach(() => {
    const redirectToNormalLog = (message) => {
      console.log(`[JEST] Error/warn redirected to normal log\nMESSAGE: ${message}`);
    };
    jest.spyOn(console, 'warn').mockImplementation(redirectToNormalLog);
    jest.spyOn(console, 'error').mockImplementation(redirectToNormalLog);
  });
  describe('Test for valid script', () => {
    const greenscriptInterfaceFromValidLiteral = gsc({})`
      [GSCTest](t=2.0, d=1.0)
      >set[#testEelement](t=2.0, d=1.0)
    `;
    const compiledValidInterfaceTimeline = greenscriptInterfaceFromValidLiteral.getTimeline();

    test('Check if timeline has been returned', () => {
      expect(greenscriptInterfaceFromValidLiteral).toBeTruthy();
      expect(compiledValidInterfaceTimeline).toBeInstanceOf(gsap.core.Timeline);
    });
    test('Check if timeline properties are correct', () => {
      expect(compiledValidInterfaceTimeline.greenscriptName).toBe('GSCTest');
      expect(compiledValidInterfaceTimeline.vars[0].delay).toBe(1.0);
    });
  });
  describe('Test for invalid script', () => {
    const greenscriptInterfaceFromInvalidLiteral = gsc({})`
      [GSCTest]
      >[#testEelement](t=2.0, d=1.0)
    `;
    test('Check if undefined interface is returned', () => {
      expect(greenscriptInterfaceFromInvalidLiteral).toBeUndefined();
    });
  });
});

describe('Test using Greenscript with template strings and additional options', () => {
  describe('Test for valid script', () => {
    const greenscriptInterfaceFromLiteralAndExtras = gsc({
      timeline: {
        repeat: -1,
        yoyo: true,
        callbacks: {
          onComplete: {
            callbackFunction: (firstParameter: string, secondParameter: string) => {
              console.log(`Parameters:  ${firstParameter}, ${secondParameter}`);
              console.log('[JEST] onComplete callback function called');
            },
            callbackParams: ['param1', 'param2'],
          },
        },
      },
      steps: [
        {
          stepIndex: 0,
          data: {
            testKey: 'testValue',
          },
          timeScale: 2.0,
        },
      ],
    })`
      [GSCTest](t=2.0, d=1.0)
      >set[#testEelement](t=2.0, d=1.0)
    `;
    const compiledInterfaceAugumentedTimeline = greenscriptInterfaceFromLiteralAndExtras.getTimeline();

    test('Check if timeline has been returned', () => {
      expect(greenscriptInterfaceFromLiteralAndExtras).toBeTruthy();
      expect(compiledInterfaceAugumentedTimeline).toBeInstanceOf(gsap.core.Timeline);
    });
    test('Check if basic timeline properties are correct', () => {
      expect(compiledInterfaceAugumentedTimeline.greenscriptName).toBe('GSCTest');
      expect(compiledInterfaceAugumentedTimeline.vars[0].delay).toBe(1.0);
    });
    test('Check if additional timeline properties are correct', () => {
      expect(compiledInterfaceAugumentedTimeline.repeat).toBe(-1);
      expect(compiledInterfaceAugumentedTimeline.yoyo).toBe(true);
      expect(compiledInterfaceAugumentedTimeline.vars.onComplete).toBeInstanceOf(Function);
      expect(compiledInterfaceAugumentedTimeline.vars.onCompleteParams).toEqual(['param1', 'param2']);
    });
    test('Check if step has been modified', () => {
      const modifiedStep = greenscriptInterfaceFromLiteralAndExtras.steps[0];
      const modifiedStepCode = modifiedStep.toString().replace(/\s/g, '');;
      const expectedStepCode = Mocks.modifiedCompiledStepCode.replace(/\s/g, '');
      expect(modifiedStepCode).toBe(expectedStepCode);
    });
  });
});
