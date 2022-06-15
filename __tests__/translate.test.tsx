/* eslint-disable no-unused-vars */
// @ts-ignore
import * as Compile from '../src/translate/compile';
// @ts-ignore
import * as Parse from '../src/translate/parse';
// @ts-ignore
import * as Utils from '../src/translate/utils';

import {simpleSource} from '../__mocks__/TranspileSource';

describe('Test parser', () => {
  test('Parse timeline config', () => {
    const parsedSource = Parse.parseGSAPScript(simpleSource); 
    console.log(parsedSource);
  });
});
