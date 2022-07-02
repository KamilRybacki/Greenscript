import useGreenscript from './useGreenscript';
import apply from '../upgrade/additionalOptions';
import {compileAdditionalOptions} from '../translation/compile';

import * as Types from '../types';

const gsc = (additionalOptions: Types.Upgrade.AdditionalOptions | string) => {
  return (literalScript: TemplateStringsArray) => {
    if (!literalScript) return undefined;
    const scriptToCompile = literalScript.raw[0];
    const greenscriptInterfaceFromLiteral = useGreenscript(scriptToCompile);
    if (greenscriptInterfaceFromLiteral) {
      let additionalOptionsToApply: Types.Upgrade.AdditionalOptions = {};
      if (typeof additionalOptions === 'string') additionalOptions = compileAdditionalOptions(additionalOptions);
      else additionalOptionsToApply = additionalOptions;
      apply(greenscriptInterfaceFromLiteral, additionalOptionsToApply);
      return greenscriptInterfaceFromLiteral;
    }
  };
};

export default gsc;
