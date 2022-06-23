/* eslint-disable no-unused-vars */
import * as Parse from '../src/translate/parse';
import * as Compile from '../src/translate/compile';
import * as Mocks from '../__mocks__/TranspileSource';

// @ts-ignore
import {ScriptLineData, LineSectionData} from '../src/types/parse';

const splitSource = Mocks.simpleSource.split('\n')
    .filter(Boolean)
    .map((line: string) => line.trim());
const parsedSource = Parse.parseGSAPScript(Mocks.simpleSource);

describe('Test parser', () => {
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

describe('Test compiler', () => {
  test('Transpile section options', () => {
    const mockOptions = Mocks.expectedSectionsData[2].source;
    const transpiledMockOptions = Compile.transpileOptions(mockOptions);
    expect(transpiledMockOptions).toEqual(Mocks.expectedTranspiledOptions);
  });
  test('Transpile line data', () => {
    const transpiledLine = Compile.transpileLine(parsedSource[2]);
    expect(transpiledLine).toStrictEqual(Mocks.expectedTranspiledLine);
  });
  test('Compile line with timeline declaration', () => {
    const compileLineWithTimelineDeclaration = Compile.compileLine(parsedSource[0]);
    expect(compileLineWithTimelineDeclaration).toBe(Mocks.expectedTimelineDeclaration)
    console.log(compileLineWithTimelineDeclaration);
  });
  test('Compile step line to GSAP function without declaring timeline', () => {
    window.localStorage.setItem('currentTimeline', '');
    const compiledLineWithoutTimeline = Compile.compileLine(parsedSource[2]);
    expect(compiledLineWithoutTimeline).toEqual(Mocks.expectedCompiledLineWithoutTimeline);
  });
  test('Compile step line to GSAP function for declared timeline', () => {
    window.localStorage.setItem('currentTimeline', 'testTimeline');
    const compiledLineWithTimeline = Compile.compileLine(parsedSource[3]);
    expect(compiledLineWithTimeline).toEqual(Mocks.expectedCompiledLineWithTimeline);
  });
});
