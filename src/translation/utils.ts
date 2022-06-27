import * as Types from '../types';

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
