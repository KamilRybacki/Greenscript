
export const simpleSource = `
  [Test]{duration: 1, delay: 0.25}
    >from[#firstTarget]{opacity:0}
    >to[#firstTarget]{opacity:0.5}
    >fromTo[#secondTarget]{opacity:0.25}{opacity:0.75}
`;
