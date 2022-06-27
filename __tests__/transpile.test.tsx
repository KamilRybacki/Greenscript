/* eslint-disable no-unused-vars */
import * as Parse from '../src/translation/parse';
import * as Compile from '../src/translation/compile';
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
    expect(transpiledMockOptions).toStrictEqual(Mocks.expectedTranspiledOptions);
  });
  test('Transpile line data', () => {
    const transpiledLine = Compile.transpileLine(parsedSource[2]);
    expect(transpiledLine).toStrictEqual(Mocks.expectedTranspiledLine);
  });
  test('Compile line with timeline declaration', () => {
    const compileLineWithTimelineDeclaration = Compile.compileLine(parsedSource[0]);
    expect(compileLineWithTimelineDeclaration).toStrictEqual(Mocks.expectedTimelineDeclaration);
  });
  test('Compile step line to GSAP function without declaring timeline', () => {
    window.localStorage.setItem('currentTimeline', '');
    const compiledStepLine = Compile.compileLine(parsedSource[3]);
    expect(compiledStepLine).toStrictEqual(Mocks.expectedCompiledStepLine);
  });
});

test('Parse and compile whole script', () => {
  const parsedFinalScript = Parse.parseGSAPScript(Mocks.finalSource);
  const compiledFinalScript = Compile.compileGSAPScript(parsedFinalScript);
  expect(compiledFinalScript).toStrictEqual(Mocks.expectedCompiledFinalScript);
});
