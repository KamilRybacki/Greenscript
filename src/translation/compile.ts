import * as Types from '../types';
import * as Utils from './utils';

export const compileGreenscript = (script: Types.Parse.ScriptLineData[]) => {
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
  const precompiledLineSource = precompileLine(lineData);
  switch (lineData.type) {
    case 'timeline':
      if (precompiledLineSource.targets !== undefined) {
        window.localStorage.setItem('currentTimeline', precompiledLineSource.targets.toString());
        return {
          timelineOptions: precompiledLineSource.options,
        } as Types.Compile.CompiledTimeline;
      };
    case 'step':
      return {
        targets: precompiledLineSource.targets,
        type: precompiledLineSource.type,
        vars: precompiledLineSource.options,
      };
    default:
      return {
        targets: [],
        type: '',
        vars: {},
      };
  }
};

export const precompileLine = (lineData: Types.Parse.ScriptLineData): Types.Compile.PrecompiledLine => {
  return lineData.sections.reduce(
      (transpiledLine: Types.Compile.PrecompiledLine,
          section: Types.Parse.LineSectionData,
      ) => {
        const type: string = section.sectionType;
        switch (type) {
          case 'targets':
            transpiledLine[type] = section.source.split(',').map((target: string) => target.trim());
            break;
          case 'options':
            transpiledLine[type].push(translateOptions(section.source));
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

export const translateOptions = (sectionOptions: string): Types.Compile.TranslatedSectionOptions => {
  const splitOptions = sectionOptions.split(',');
  const transpiledOptions = splitOptions.reduce(
      (transpiledOptions: Types.Compile.TranslatedSectionOptions,
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
