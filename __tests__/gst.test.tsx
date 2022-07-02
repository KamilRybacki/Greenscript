import gsc from '../src/hooks/gsc';

describe('Test using Greenscript with template strings', () => {
  test('Test for valid script', () => {
    const greenscriptInterfaceFromLiteral = gsc()`
    ej
    `;
  });
  test('Test for invalid script', () => {

  });
});
