import * as Types from '../types/utils';

export const specialCharacters: Types.CharactersMapping = {
  '[': 'target',
  '>': 'step',
  '(': 'options',
};

export const sectionClosingCharacters: Types.CharactersMapping = {
  '[': ']',
  '(': ')',
  '>': '[',
};

export const specialCharactersRegexp: RegExp = RegExp(
    `${
      Object.keys(specialCharacters).map((char: string) => {
        return '\\' + char;
      }).join('|')
    }`, 'g',
);
