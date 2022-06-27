
export type ScriptLineData = {
  source: string,
  type: string,
  sections: LineSectionData[],
};

export type LineSectionData = {
  source: string,
  sectionType: string,
};
