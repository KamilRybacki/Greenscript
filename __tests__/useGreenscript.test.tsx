import {gsap} from 'gsap';
import { isExportDeclaration } from 'typescript';

import useGreenscript from '../src/hooks/useGreenscript';

import * as Mocks from '../__mocks__/greenscriptMocks';

const greenscriptInterface = useGreenscript(Mocks.validHookTestScript);

describe('Test useGreenscript output', () => {
  beforeEach(() => {
    const redirectToNormalLog = (message) => {
      console.log(`[JEST] Error/warn redirected to normal log\nMESSAGE: ${message}`);
    };
    jest.spyOn(console, 'warn').mockImplementation(redirectToNormalLog);
    jest.spyOn(console, 'error').mockImplementation(redirectToNormalLog);
  });

  describe('Check for valid input script', () => {
    test('Check if valid Timeline object is returned', () => {
      const outputTimeline: gsap.core.Timeline = greenscriptInterface.timeline;
      expect(outputTimeline).toBeInstanceOf(gsap.core.Timeline);
      outputTimeline.play();
      expect(outputTimeline.greenscriptName).toBe('HookTest');
      expect(outputTimeline.vars[0].delay).toBe(0.5);
    });
    test('Check if animation steps have been compiled', () => {
      expect(greenscriptInterface.steps).toBeTruthy();
      expect(greenscriptInterface.steps).toHaveLength(3);
    });
    test('Check if compiled code is valid', () => {
      greenscriptInterface.steps.forEach((step) => {
        const trimmedStepCode = step.toString().replace(/\s/g, '');
        const trimmedMockCode = Mocks.generalCompiledStepCode.replace(/\s/g, '');
        expect(trimmedStepCode).toEqual(trimmedMockCode);
      });
    });
  });
  describe('Check for invalid inputs', () => {
    test('Check for empty script', () => {
      const emptyScriptInterface = useGreenscript('');
      expect(emptyScriptInterface).toBeUndefined();
    });
    test('Check for script without timeline declaration', () => {
      const timelineDeclaration = '[HookTest](t=0.25,d=0.5,dt=0.1,de=linear)';
      const scriptWithTimelelineTrimmed = Mocks.validHookTestScript.replace(timelineDeclaration, '').trim();
      const interfaceWithoutTimeline = useGreenscript(scriptWithTimelelineTrimmed);
      expect(interfaceWithoutTimeline).toBeUndefined();
    });
    test('Check declaration for bogus GSAP handle', () => {
      const interfaceWithBogusHandle = useGreenscript(Mocks.bogusStepScript);
      expect(greenscriptInterface.steps).toBeTruthy();
      expect(interfaceWithBogusHandle.steps).toHaveLength(1);
    });
    describe('Check declarations with empty fields', () => {
      Object.keys(Mocks.scriptsWithBlanks).forEach((declarationType: string) => {
        describe(`Check for blanks in ${declarationType} declaration`, () => {
          const scriptsWithBlanksForDeclaration = Mocks.scriptsWithBlanks[declarationType];
          Object.keys(scriptsWithBlanksForDeclaration).forEach((scriptType: string) => {
            test(`Blank inserted in ${scriptType} field`, () => {
              const interfaceWithBlankField = useGreenscript(scriptsWithBlanksForDeclaration[scriptType]);
              expect(interfaceWithBlankField).toBeUndefined();
            });
          });
        });
      });
    });
  });
});
