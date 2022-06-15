
const MockTimeline = {
  options: {
    delay: 0.25,
    default: {
      duration: 0.1,
      ease: 'linear',
    },
  },
  animations: {
    from: {
      name: 'fromTest',
      type: 'from',
      vars: {
        opacity: 0.25,
      },
    },
    to: {
      name: 'toTest',
      type: 'to',
      vars: {
        opacity: 0.25,
      },
    },
    fromTo: {
      name: 'fromToTest',
      type: 'from',
      vars: [{
        opacity: 0.25,
      }, {
        opacity: 0.5,
      }],
    },
    set: {
      name: 'setTest',
      type: 'set',
      vars: {
        opacity: 0.25,
      },
    },
  },
};

export default MockTimeline;
