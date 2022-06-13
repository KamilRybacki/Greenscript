
export const isItAnAnimatonFunction = (input: CallableFunction | null) => {
  const sourceCode = input.toString();
  return input &&
    (input instanceof Function) &&
    (sourceCode.includes('getGSAPHandle') || sourceCode.includes('availableHandles.reduce'));
};

export const testTimelineOptions = {
  delay: 0.25,
};

export const testAnimations = {
  from: {
    name: 'fromTest',
    type: 'from',
    vars: {
      opacity: 0,
    },
  },
  to: {
    name: 'toTest',
    type: 'to',
    vars: {
      x: 100,
      y: 100,
    },
  },
  fromTo: {
    name: 'fromToTest',
    type: 'from',
    vars: [{
      opacity: 0.25,
    }, {
      opacity: 0.75,
    }],
  },
  set: {
    name: 'setTest',
    type: 'set',
    vars: {
      x: 666,
    },
  },
};
