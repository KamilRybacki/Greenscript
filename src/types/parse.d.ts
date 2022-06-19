
export type TranspileCache = {
  lastTarget: string,
  lastHandle: string
};

export type ScriptLineData = {
  source: string,
  type: string,
  sections: LineSectionData[],
};

export type LineSectionData = {
  source: string,
  sectionType: string,
};
