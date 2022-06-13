import {createUniqueId} from 'solid-js';

import {render} from 'solid-testing-library';

const TestComponent = (props) => {
  const testComponentStyle = {
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
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

const renderTestElement = () => {
  const testElementId = createUniqueId();
  render(() => <TestComponent id={testElementId}>This is test element</TestComponent>);
  return testElementId;
};

export default renderTestElement;
