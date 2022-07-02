import * as Types from '../types';
import * as Utils from './utils';

export const compileGreenscript = (script: Types.Parse.ScriptLineData[]): Types.Compile.CompiledScript => {
  const output = script
      .map((line: Types.Parse.ScriptLineData) => compileLine(line))
      .slice(0) // Make a copy of the array to avoid mutating the original
      .reduce(
          (acc: Types.Compile.CompiledScript,
              line: Types.Compile.CompiledTimeline | Types.Compile.CompiledAnimation,
              lineIndex, compiledLinesArray,
          ) => {
            const noErrorCode = isScriptLineValid(line);
            if (!noErrorCode) {
              if ('timelineOptions' in line) {
                acc.options = line.timelineOptions;
                acc.name = line.name;
              }
              if ('vars' in line) acc.animations.push(line);
            } else {
              console.error(`Script line ${lineIndex + 1} is invalid! Reason: ${Utils.possibleErrors[noErrorCode-1]}`);
              acc = {
                name: '',
                options: {},
                animations: [],
              };
              compiledLinesArray.length = 0;
            }
            return acc;
          }, {
            name: '',
            options: {},
            animations: [],
          });
  return output;
};

const isScriptLineValid = (line: Types.Compile.CompiledTimeline | Types.Compile.CompiledAnimation): number => {
  let errorCode: number = 0;
  if ('type' in line && !line.type) errorCode = 1;
  if ('timelineOptions' in line) {
    if ('name' in line && !line.name) errorCode = 2;
    if (!isListValid(line.timelineOptions)) errorCode = 3;
  }
  if ('vars' in line && !isListValid(line.vars)) errorCode = 4;
  if ('targets' in line && !isListValid(line.targets)) errorCode = 5;
  return errorCode;
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
          name: precompiledLineSource.targets[0],
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
        vars: [{}],
      };
  }
};

export const precompileLine = (lineData: Types.Parse.ScriptLineData): Types.Compile.PrecompiledLine => {
  const precompiledLine = lineData.sections.reduce(
      (transpiledLine: Types.Compile.PrecompiledLine,
          section: Types.Parse.LineSectionData,
      ) => {
        const type: string = section.sectionType;
        switch (type) {
          case 'targets':
            const translatedTargets = section.source.split(',').map((target: string) => target.trim()).filter(Boolean);
            transpiledLine[type] = translatedTargets;
            break;
          case 'options':
            const translatedOptions: Types.Compile.TranslatedSectionOptions = translateOptions(section.source);
            if (translatedOptions !== {}) transpiledLine[type].push(translatedOptions);
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
  if (!isPrecompiledLineValid(precompiledLine)) precompiledLine.type = '';
  return precompiledLine;
};

const isPrecompiledLineValid = (line: Types.Compile.PrecompiledLine): boolean => {
  if (!line.targets.every((target: string) => Boolean(target))) return false;
  if (line.type.length == 0) return false;
  return true;
};

const isListValid = (list: Array<object | string>): boolean => {
  if (list.length) {
    return list.every((listElement: object | string) => {
      if (typeof listElement === 'string') return Boolean(listElement.length);
      return Boolean(Object.keys(listElement).length);
    });
  };
  return false;
};

export const translateOptions = (sectionOptions: string): Types.Compile.TranslatedSectionOptions => {
  let transpiledOptions: Types.Compile.TranslatedSectionOptions = {};
  if (sectionOptions) {
    const splitOptions = sectionOptions.split(',');
    transpiledOptions = splitOptions.reduce(
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
  }
  return transpiledOptions;
};
