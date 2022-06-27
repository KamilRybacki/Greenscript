/* eslint-disable require-jsdoc */

import useGSAP from '../src/hooks/useGreenscript';

import * as Mocks from '../__mocks__/useGreenscriptMocks';

test('Test useGreenscript output', () => {
  const gsapInterface = useGSAP(Mocks.hookTestScript);
  console.log(gsapInterface.stess);
});
