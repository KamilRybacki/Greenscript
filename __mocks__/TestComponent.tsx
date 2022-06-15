import {createUniqueId} from 'solid-js';

import {createEffect} from 'solid-js';
import {render} from 'solid-testing-library';

import useGSAP from '../src/hooks/useGSAP';
import MockTimeline from './MockTimeline';
// @ts-ignore
import * as Types from '../types/useGSAP';

export const testElementInnerHTML = 'This is a test element';

const TestComponent = (props) => {
  const testComponentStyle = {
    'display': 'block',
    'width': '300px',
    'height': '300px',
    'position': 'fixed',
    'top': '150px',
    'left': '150px',
  };
  return (
    <div style={testComponentStyle} id={props.id}>{props.children}</div>
  );
};

const renderTestElement = (handleToUse: string) => {
  const testElementId = createUniqueId();
  let testInterface: Types.AnimationsInterface;

  render(() => {
    const animation = MockTimeline.animations[handleToUse];
    animation.targets = `#${testElementId}`;
    const allTestTimelineAnimations = [animation, {
      name: 'dummy',
      type: 'to',
      targets: `#${testElementId}`,
      vars: {
        opacity: 0.33,
      },
    }];

    createEffect(()=>{
      testInterface = useGSAP(MockTimeline.options, `${testElementId}_timeline`, allTestTimelineAnimations);
      testInterface.startAll();
    });
    return <TestComponent id={testElementId}>{testElementInnerHTML}</TestComponent>;
  });

  return [
    document.getElementById(testElementId),
    testInterface,
  ];
};

export default renderTestElement;
