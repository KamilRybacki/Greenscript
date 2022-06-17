import * as Types from '../types/parse';
import * as Utils from './utils';

export const parseGSAPScript = (script: string): Types.ScriptLineData[] => {
  return script
      .split('\n')
      .reduce((readLines: Types.ScriptLineData[], line: string) => {
        readLines.push({
          source: line.trim(),
          type: '',
          sections: [],
        });
        return readLines;
      }, [])
      .filter((lineData: Types.ScriptLineData) => lineData.source)
      .map((line: Types.ScriptLineData): Types.ScriptLineData => parseScriptLine(line))
      .filter((line: Types.ScriptLineData) => line.type);
};

const parseScriptLine = (line: Types.ScriptLineData): Types.ScriptLineData => {
  line.type = determineLineType(line.source);
  if (line.type) splitLineIntoSections(line);
  return line;
};

const determineLineType = (lineSource: string): string => {
  const firstCharacterInLine = lineSource.charAt(0);
  const recognizedCharacters = Object.keys(Utils.specialCharacters);
  return recognizedCharacters.includes(firstCharacterInLine) ?
  Utils.specialCharacters[firstCharacterInLine] : '';
};

const splitLineIntoSections = (lineData: Types.ScriptLineData) => {
  let match: RegExpMatchArray | null;
  while (
    (match = Utils.specialCharactersRegexp.exec(lineData.source))
  ) {
    const matchedCharacter = match.toString();
    const characterTag = Utils.specialCharacters[matchedCharacter];
    const closingCharacter = Utils.sectionClosingCharacters[matchedCharacter];
    if (closingCharacter) {
      const sectionSource = getSectionSource(lineData.source, match.index, closingCharacter);
      lineData.sections.push({
        source: sectionSource,
        sectionType: characterTag === 'step' ? 'handleType' : characterTag,
      });
    };
  }
};

const getSectionSource = (lineSource: string, index: number | undefined, targetCharacter: string): string => {
  const substringStart = typeof index === 'undefined' ? lineSource.length: index;
  const targetCharacterRegexp = RegExp(`\\${targetCharacter}`);
  const lineSubstring = lineSource.substring(substringStart);
  const closingCharacterMatch = targetCharacterRegexp.exec(lineSubstring);

  return closingCharacterMatch?.index ?
  lineSubstring.substring(1, closingCharacterMatch?.index): '';
};
