import * as Types from './types';

export const isListValid = (list: Array<object | string>): boolean => {
  if (list.length) {
    return list.every((listElement: object | string) => {
      if (typeof listElement === 'string') return Boolean(listElement.length);
      return Boolean(Object.keys(listElement).length);
    });
  };
  return false;
};

export const linePrefixCharacters: Types.Utils.CharactersMapping = {
  '[': 'timeline',
  '>': 'step',
};

export const sectionPrefixCharacters: Types.Utils.CharactersMapping = {
  '[': 'targets',
  '>': 'step',
  '(': 'options',
};

export const sectionClosingCharacters: Types.Utils.CharactersMapping = {
  '[': ']',
  '(': ')',
  '>': '[',
};

export const specialCharactersRegexp: RegExp = RegExp(
    `${
      Object.keys(sectionPrefixCharacters).map((char: string) => {
        return '\\' + char;
      }).join('|')
    }`, 'g',
);

export const optionsKeys: Types.Utils.OptionKeysMapping = {
  'o': 'step:opacity',
  'r': 'step:rotate',
  'x': 'step:x',
  'y': 'step:y',
  'e': 'step:ease',
  't': 'step:duration',
  'd': 'step:delay',
  'dd': 'defaults:delay',
  'de': 'defaults:ease',
  'dt': 'defaults:duration',
};

export const possibleErrors = [
  'Failed to determine line type (timeline declaration or step declaration)',
  'Encountered a problem while parsing timeline name',
  'Encountered a problem while parsing timeline options',
  'Encountered a problem while parsing animation step options',
  'Encountered a problem while parsing animation step targets',
];

