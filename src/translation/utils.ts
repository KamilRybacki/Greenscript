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
  't': 'step:duration',
  'd': 'step:delay',
  'dd': 'defaults:delay',
  'dt': 'defaults:duration',
};
