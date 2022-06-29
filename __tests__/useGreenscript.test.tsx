import {gsap} from 'gsap';
import * as Solid from 'solid-js';
import {screen} from '@testing-library/dom';

import {render as renderWithSolid} from 'solid-testing-library';

import useGreenscript from '../src/hooks/useGreenscript';

import * as Mocks from '../__mocks__/useGreenscriptMocks';

describe('Test useGreenscript output', () => {
  const greenscriptInterface = useGreenscript(Mocks.hookTestScript);
  test('Check if valid Timeline object is returned', () => {
    const outputTimeline = greenscriptInterface.getTimeline();
    expect(outputTimeline).toBeInstanceOf(gsap.core.Timeline);
  });
  test('Check if animation steps have been compiled', () => {
    expect(greenscriptInterface.steps).toBeTruthy();
    expect(greenscriptInterface.steps).toHaveLength(4);
  });
  test('Check if compiled code is valid', () => {
    greenscriptInterface.steps.forEach((step) => {
      const trimmedStepCode = step.toString().replace(/\s/g, '');
      const trimmedMockCode = Mocks.generalCompiledStepCode.replace(/\s/g, '');
      expect(trimmedStepCode).toEqual(trimmedMockCode);
    });
  });
});

describe('Test using popular libraries', () => {
  const greenscriptInterface = useGreenscript(Mocks.hookTestScript);
  const testComponentText = Date.now().toString();
  const testElementId = 'testElement';

  let testElement: HTMLElement;

  const renderElementWithLibrary = (renderFunction: CallableFunction, componentFunction: CallableFunction) => {
    renderFunction(componentFunction);
    const element = screen.getByTestId(testElementId);
    element.style.left = '100px';
    element.style.top = '100px';
    element.style.display = 'flex';
    return element;
  };

  const renderMethods = {
    'solid-js': {
      'renderFunction': renderWithSolid,
      'componentFunction': () => {
        const TestComponent: Solid.Component<{text: string}> = (props) => {
          return (
            <div id={testElementId} data-testid={testElementId}>{props.text}</div>
          );
        };
        return (<TestComponent text={testComponentText}/>);
      },
    },
  };

  Object.keys(renderMethods).forEach((key: string) => {
    describe(`Test using ${key}`, () => {
      const renderMethod = renderMethods[key];
      testElement = renderElementWithLibrary(
          renderMethod.renderFunction,
          renderMethod.componentFunction,
      );
      test('Check if element has been rendered at all', () => {
        expect(testElement).toBeTruthy();
      });
      test('Check if test component has correct text', () => {
        expect(testElement.innerHTML).toEqual(testComponentText);
      });
      test('Check if initial position is correct', () => {
        expect(testElement.style.left).toEqual('100px');
        expect(testElement.style.top).toEqual('100px');
        expect(testElement.style.display).toEqual('flex');
      });
    });
  });
});
