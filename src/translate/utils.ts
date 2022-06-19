import * as Types from '../types';

export const linePrefixCharacters: Types.Utils.CharactersMapping = {
  '[': 'timeline',
  '>': 'step',
};

export const sectionPrefixCharacters: Types.Utils.CharactersMapping = {
  '[': 'target',
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
  'o': 'opacity',
  'r': 'rotate',
  'x': 'x',
  'y': 'y',
};
