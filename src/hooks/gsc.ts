import useGreenscript from "./useGreenscript";
import {isListValid} from "../utils"; 
import {apply} from "../upgrade/additionalOptions";

const gsc = (additionalOptions: object[] = []) => {
  return (literalScript: TemplateStringsArray) => {
    if (!literalScript) return undefined;
    const scriptToCompile = literalScript.raw[0];
    const greenscriptInterfaceFromLiteral = useGreenscript(scriptToCompile);
    if (isListValid(additionalOptions)) apply(greenscriptInterfaceFromLiteral, additionalOptions);
    return greenscriptInterfaceFromLiteral;
  };
};

export default gsc;
