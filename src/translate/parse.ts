import * as Types from '../types/parse';

const parseScriptLines = (lines: Types.ScriptLineData[]) => {
  const parsedLines = lines;
  return parsedLines;
};

export const parseGSAPScript = (script: string) => {
  const rawScriptLines = script.split('\n').map((line: string) => {
    return {
      _source: line,
      type: '',
      data: {},
    };
  }).filter((lineData: Types.ScriptLineData) => lineData._source);
  return parseScriptLines(rawScriptLines);
};
