import * as Compile from './translate/compile';
import * as Parse from './translate/parse';
import * as Utils from './translate/utils';

const gst = () => {
  return (classesTemplateLiteral: TemplateStringsArray) => {
    console.log(classesTemplateLiteral.raw[0]);
  };
};

export default gst;
