import * as Types from '../types';
import * as Utils from './utils';

export const compileGSAPScript = (script: Types.Parse.ScriptLineData[]) => {
  return script
      .map((line: Types.Parse.ScriptLineData) => compileLine(line))
      .reduce(
          (acc: Types.Compile.CompiledScript,
              line: Types.Compile.CompiledLine,
          ) => {
            if (line.timelineOptions) {
              acc.options = line.timelineOptions;
            }
            if (line.targets) {
              acc.animations.push(line);
            }
            return acc;
          }, {
            options: {},
            animations: [],
          });
};

export const compileLine = (
    lineData: Types.Parse.ScriptLineData,
): Types.Compile.CompiledLine => {
  const {targets, type, options} = transpileLine(lineData);
  switch (lineData.type) {
    case 'timeline':
      window.localStorage.setItem('currentTimeline', targets.toString());
      return {
        timelineOptions: options,
      };
    case 'step':
      return {
        targets: targets,
        type: type,
        vars: options,
      };
    default:
      return {};
  }
};

export const transpileLine = (lineData: Types.Parse.ScriptLineData) => {
  return lineData.sections.reduce((codeMap: Types.Compile.CodeMapping, section: Types.Parse.LineSectionData) => {
    const source = section.source;
    if (section.sectionType === 'options') {
      if (!codeMap[section.sectionType]) {
        codeMap[section.sectionType] = transpileOptions(source);
      } else {
        codeMap[section.sectionType] = [codeMap[section.sectionType], transpileOptions(source)];
      }
    } else {
      codeMap[section.sectionType] = source.includes('#') ?
        source.split(',').map((target: string) => target.trim()) :
        source;
    }
    return codeMap;
  }, {});
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
