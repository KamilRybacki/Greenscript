import * as Types from '../types';
import * as Utils from './utils';

export const compileGSAPScript = (script: Types.Parse.ScriptLineData[]) => {
  return script
      .map((line: Types.Parse.ScriptLineData) => compileLine(line))
      .reduce(
          (acc: Types.Compile.CompiledScript,
              line: Types.Compile.CompiledTimeline | Types.Compile.CompiledAnimation,
          ) => {
            if ('timelineOptions' in line) acc.options = line.timelineOptions;
            if ('vars' in line) acc.animations.push(line);
            return acc;
          }, {
            options: {},
            animations: [],
          });
};

export const compileLine = (
    lineData: Types.Parse.ScriptLineData,
): Types.Compile.CompiledTimeline | Types.Compile.CompiledAnimation => {
  const transpiledLine = transpileLine(lineData);
  switch (lineData.type) {
    case 'timeline':
      if (transpiledLine.targets !== undefined) {
        window.localStorage.setItem('currentTimeline', transpiledLine.targets.toString());
        return {
          timelineOptions: transpiledLine.options,
        } as Types.Compile.CompiledTimeline;
      };
    case 'step':
      return {
        targets: transpiledLine.targets,
        type: transpiledLine.type,
        vars: transpiledLine.options,
      };
    default:
      return {
        targets: [],
        type: '',
        vars: {},
      };
  }
};

export const transpileLine = (lineData: Types.Parse.ScriptLineData): Types.Compile.TranspiledLine => {
  return lineData.sections.reduce(
      (transpiledLine: Types.Compile.TranspiledLine,
          section: Types.Parse.LineSectionData,
      ) => {
        const type: string = section.sectionType;
        switch (type) {
          case 'targets':
            transpiledLine[type] = section.source.split(',').map((target: string) => target.trim());
            break;
          case 'options':
            transpiledLine[type].push(transpileOptions(section.source));
            break;
          case 'type':
            transpiledLine[type] = section.source;
          default:
            break;
        }
        return transpiledLine;
      }, {
        targets: [],
        options: [],
        type: '',
      });
};

export const transpileOptions = (sectionOptions: string): Types.Compile.TranspiledSectionOptions => {
  const splitOptions = sectionOptions.split(',');
  const transpiledOptions = splitOptions.reduce(
      (transpiledOptions: Types.Compile.TranspiledSectionOptions,
          optionSource: string,
      ) => {
        const [optionKey, optionValue] = optionSource.split('=');
        const mappedOptionKey = Utils.optionsKeys[optionKey.trim()];
        const [keyPrefix, actualKey] = mappedOptionKey.split(':');
        switch (keyPrefix) {
          case 'step':
            transpiledOptions[actualKey] = optionValue;
            break;
          case 'timeline':
            transpiledOptions[actualKey] = optionValue;
            break;
          case 'defaults':
            if (transpiledOptions.defaults === undefined) {
              transpiledOptions.defaults = {};
            }
            transpiledOptions.defaults[actualKey] = optionValue;
          default:
            break;
        }
        return transpiledOptions;
      }, {});
  return transpiledOptions;
};
