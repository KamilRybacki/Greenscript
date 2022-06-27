/* eslint-disable no-unused-vars */
import * as Parse from '../src/translation/parse';
import * as Compile from '../src/translation/compile';
import * as Mocks from '../__mocks__/translationMocks';

// @ts-ignore
import {ScriptLineData, LineSectionData} from '../src/types/parse';

const parsedSource = Parse.parseGreenscript(Mocks.scripts.initial.source);

describe('Test parser', () => {
  test('Read config lines source', () => {
    const initialScriptSourceLines = Mocks.scripts.initial.source.split('\n')
        .filter(Boolean)
        .map((line: string) => line.trim());
    parsedSource.map((lineData: ScriptLineData, lineIndex: number) => {
      expect(lineData.source).toEqual(initialScriptSourceLines[lineIndex]);
    });
  });
  test('Split line into sections', () => {
    const animationStepLineSections = parsedSource[1].sections;
    animationStepLineSections.map((
        extractedSectionData: LineSectionData,
        sectionIndex: number,
    ) => {
      expect(extractedSectionData.source)
          .toEqual(Mocks.scripts.initial.parsed.sectionsData[sectionIndex].source);
      expect(extractedSectionData.sectionType)
          .toEqual(Mocks.scripts.initial.parsed.sectionsData[sectionIndex].sectionType);
    });
  });
});

describe('Test compiler', () => {
  test('Transpile section options', () => {
    const mockOptions = Mocks.scripts.initial.parsed.sectionsData[2].source;
    const transpiledMockOptions = Compile.translateOptions(mockOptions);
    expect(transpiledMockOptions).toStrictEqual(
        Mocks.scripts.initial.compiled.options,
    );
  });
  test('Transpile line data', () => {
    const transpiledLine = Compile.precompileLine(parsedSource[2]);
    expect(transpiledLine).toStrictEqual(
        Mocks.scripts.initial.compiled.line,
    );
  });
  test('Compile line with timeline declaration', () => {
    const compileLineWithTimelineDeclaration = Compile.compileLine(parsedSource[0]);
    expect(compileLineWithTimelineDeclaration).toStrictEqual(
        Mocks.scripts.initial.compiled.timeline,
    );
  });
  test('Compile step line to GSAP function without declaring timeline', () => {
    window.localStorage.setItem('currentTimeline', '');
    const compiledStepLine = Compile.compileLine(parsedSource[3]);
    expect(compiledStepLine).toStrictEqual(
        Mocks.scripts.initial.compiled.step,
    );
  });
});

test('Parse and compile whole script', () => {
  const parsedFinalScript = Parse.parseGreenscript(Mocks.scripts.final.source);
  const compiledFinalScript = Compile.compileGreenscript(parsedFinalScript);
  expect(compiledFinalScript).toStrictEqual(
      Mocks.scripts.final.compiled.script,
  );
});
