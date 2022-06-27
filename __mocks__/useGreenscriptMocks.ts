
export const hookTestScript = `
  [HookTest](t=0.25,dt=0.1,de=linear)
  >from[#testElement](o=0.25)
  >to[#testElement](o=0.25)
  >fromTo[#testElement](o=0.25)(o=0.5)
  >set[#testElement](o=0.25)
`;
