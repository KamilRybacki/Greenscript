
export const validHookTestScript = `
  [HookTest](t=0.25,dt=0.1,de=linear)
  >set[#testElement](o=0.75)
  >to[#testElement](o=0.25)
  >fromTo[#testElement](o=0.25)(o=0.5)
`;

export const bogusStepScript = `
  [HookTest](t=0.25,dt=0.1,de=linear)
  >bogus[#testElement](t=0.25,dt=0.1,de=linear)
  >to[#testElement](o=0.25)
`;

export const scriptsWithBlanks = {
  timeline: {
    name: `[](t=0.25,dt=0.1,de=linear)
      >set[#testElement](o=0.75)
      >to[#testElement](o=0.25) 
    `,
    options: `[HookTest]()
      >set[#testElement](o=0.75)
      >to[#testElement](o=0.25) 
    `,
  },
  step: {
    handleType: `[HookTest](t=0.25,dt=0.1,de=linear)
      >[#testElement](o=0.75)
      >to[#testElement](o=0.25) 
    `,
    target: `[HookTest](t=0.25,dt=0.1,de=linear)
      >set[](o=0.75)
      >to[#testElement](o=0.25) 
    `,
    options: `[HookTest](t=0.25,dt=0.1,de=linear)
      >set[#testElement]()
      >to[#testElement](o=0.25) 
    `,
  },
};

export const generalCompiledStepCode = `
() => {
        const targetsList = prepareTargetsList(step.targets);
        if (targetsList) {
          const handle = getGSAPHandle(currentTimeline, step.type);
          targetsList.forEach(targetElement => {
            handle(targetElement, ...Object.values(step.vars));
          });
          return targetsList;
        }
      }
`;
