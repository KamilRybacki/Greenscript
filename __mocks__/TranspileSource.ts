
export const simpleSource = `
  [Test](t=1, d=0.25)
  >from[#firstTarget](o=0, x=10)
  >to[#firstTarget](o=0.5, y=-20, x=2)
  >fromTo[#secondTarget](o=0.25, r=15)(o=0, r=45)
`;

export const expectedSectionsData = [
  {source: 'from', sectionType: 'handleType'},
  {source: '#firstTarget', sectionType: 'target'},
  {source: 'o=0, x=10', sectionType: 'options'},
];
