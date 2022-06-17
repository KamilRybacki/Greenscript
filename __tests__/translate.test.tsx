/* eslint-disable no-unused-vars */
import * as Parse from '../src/translate/parse';
import * as Mocks from '../__mocks__/TranspileSource';

// @ts-ignore
import {ScriptLineData, LineSectionData} from '../src/types/parse';


describe('Test parser', () => {
  const splitSource = Mocks.simpleSource.split('\n')
      .filter(Boolean)
      .map((line: string) => line.trim());
  const parsedSource = Parse.parseGSAPScript(Mocks.simpleSource);
  test('Read config lines source', () => {
    parsedSource.map((lineData: ScriptLineData, lineIndex: number) => {
      expect(lineData.source).toEqual(splitSource[lineIndex]);
    });
  });
  test('Split line into sections', () => {
    const animationStepLineSections = parsedSource[1].sections;
    animationStepLineSections.map((
        extractedSectionData: LineSectionData,
        sectionIndex: number,
    ) => {
      expect(extractedSectionData.source)
          .toEqual(Mocks.expectedSectionsData[sectionIndex].source);
      expect(extractedSectionData.sectionType)
          .toEqual(Mocks.expectedSectionsData[sectionIndex].sectionType);
    });
  });
});
