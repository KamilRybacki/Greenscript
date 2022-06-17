const gst = () => {
  return (classesTemplateLiteral: TemplateStringsArray) => {
    console.log(classesTemplateLiteral.raw[0]);
  };
};

export default gst;
