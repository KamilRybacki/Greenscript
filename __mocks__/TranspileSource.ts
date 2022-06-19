/* eslint-disable max-len */

export const simpleSource = `
  [Test](t=1, d=0.25)
  >from[#firstTarget](o=0, x=10)
  >to[#firstTarget](o=0.5, y=-20, x=2)
  >fromTo[#secondTarget](o=0.25, r=15)(o=0, r=45)
`;

export const simpleLineData = {
  source: '>fromTo[#secondTarget](o=0.25, r=15)(o=0, r=45)',
  type: '',
  sections: [],
};

export const expectedSectionsData = [
  {source: 'from', sectionType: 'handleType'},
  {source: '#firstTarget', sectionType: 'target'},
  {source: 'o=0, x=10', sectionType: 'options'},
];

export const expectedTranspiledOptions = '{\"opacity\":\"0\",\"x\":\"10\"}';

export const expectedTranspiledLine = {
  handleType: 'to',
  target: '#firstTarget',
  options: '{"opacity":"0.5","y":"-20","x":"2"}',
};

export const expectedCompiledLineWithoutTimeline = 'gsap.globalTimeline.to(#firstTarget, {"opacity":"0.5","y":"-20","x":"2"});';

export const expectedCompiledLineWithTimeline = 'testTimeline.fromTo(#secondTarget, {"opacity":"0.25","rotate":"15"}, {"opacity":"0","rotate":"45"});';
