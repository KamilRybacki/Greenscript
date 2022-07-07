import useGreenscript from './useGreenscript';
import apply from '../upgrade/additionalOptions';

import * as Types from '../types';

const gsc = (additionalOptions?: Types.Upgrade.AdditionalOptions) => {
  return (literalScript: TemplateStringsArray) => {
    if (!literalScript) return undefined;
    const scriptToCompile = literalScript.raw[0];
    const greenscriptInterfaceFromLiteral = useGreenscript(scriptToCompile);
    if (greenscriptInterfaceFromLiteral && additionalOptions) {
      apply(greenscriptInterfaceFromLiteral, additionalOptions);
      return greenscriptInterfaceFromLiteral;
    }
  };
};

export default gsc;
