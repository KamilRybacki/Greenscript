import * as Types from '../types';
import * as Utils from './utils';

export const compileScript = (script: Types.Parse.ScriptLineData[]) => {
  return script.map((line: Types.Parse.ScriptLineData) => compileLine(line));
};

export const compileLine = (lineData: Types.Parse.ScriptLineData) => {
  const {target, handleType, options} = transpileLine(lineData);
  switch (lineData.type) {
    case 'timeline':
      window.localStorage.setItem('currentTimeline', target);
      return `const ${target} = gsap.timeline(${options});`;
    case 'step':
      const targetTimeline = window.localStorage.getItem('currentTimeline') || 'gsap.globalTimeline';
      return `${targetTimeline}.${handleType}(${target}, ${options});`;
    default:
      return '';
  }
};

export const transpileLine = (lineData: Types.Parse.ScriptLineData) => {
  return lineData.sections.reduce((codeMap: Types.Compile.CodeMapping, section: Types.Parse.LineSectionData) => {
    if (section.sectionType === 'options') {
      if (!codeMap[section.sectionType]) {
        codeMap[section.sectionType] = transpileOptions(section.source);
      } else {
        codeMap[section.sectionType] = `${codeMap[section.sectionType]}, ${transpileOptions(section.source)}`;
      }
    } else codeMap[section.sectionType] = section.source;

    return codeMap;
  }, {});
};

export const transpileOptions = (sectionOptions: string): string => {
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
  return JSON.stringify(transpiledOptions);
};
