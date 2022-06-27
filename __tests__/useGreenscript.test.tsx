import useGreenscript from '../src/hooks/useGreenscript';

import * as Mocks from '../__mocks__/useGreenscriptMocks';

test('Test useGreenscript output', () => {
  const greenscriptInterface = useGreenscript(Mocks.hookTestScript);
  console.log(greenscriptInterface);
});
