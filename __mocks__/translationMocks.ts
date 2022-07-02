/* eslint-disable max-len */

export const scripts = {
  initial: {
    source: `
      [Test](t=1, d=0.25, dt=2, dd=0.5)
      >from[#firstTarget](o=0, x=10)
      >to[#firstTarget](o=0.5, y=-20, x=2)
      >fromTo[#secondTarget, #thirdTarget](o=0.25, r=15)(o=0, r=45)
    `,
    parsed: {
      lineData: {
        source: '>fromTo[#secondTarget](o=0.25, r=15)(o=0, r=45)',
        type: '',
        sections: [],
      },
      sectionsData: [
        {source: 'from', sectionType: 'type'},
        {source: '#firstTarget', sectionType: 'targets'},
        {source: 'o=0, x=10', sectionType: 'options'},
      ],
    },
    compiled: {
      options: {
        opacity: '0',
        x: '10',
      },
      line: {
        type: 'to',
        targets: ['#firstTarget'],
        options: [{opacity: '0.5', y: '-20', x: '2'}],
      },
      timeline: {
        name: 'Test',
        timelineOptions: [{
          duration: '1',
          delay: '0.25',
          defaults: {
            duration: '2',
            delay: '0.5',
          },
        }],
      },
      step: {
        targets: ['#secondTarget', '#thirdTarget'],
        type: 'fromTo',
        vars: [{
          opacity: '0.25',
          rotate: '15',
        }, {
          opacity: '0',
          rotate: '45',
        }],
      },
    },
  },
  final: {
    source: `
      [Final](d=1.5, dd=0.25)
      >fromTo[#firstTarget, #thirdTarget](r=0)(r=30)
      >fromTo[#secondTarget](o=0.25, x=-200)(o=0.5, x=200)
      >to[#firstTarget](x=200, y=300)
      >set[#fourthTarget](y=400)
      >to[#fourthTarget](o=0.5, y=-20, x=2)
    `,
    compiled: {
      script: {
        name: 'Final',
        options: [{
          delay: '1.5',
          defaults: {delay: '0.25'},
        }],
        animations: [
          {
            targets: ['#firstTarget', '#thirdTarget'],
            type: 'fromTo',
            vars: [{
              rotate: '0',
            }, {
              rotate: '30',
            }],
          },
          {
            targets: ['#secondTarget'],
            type: 'fromTo',
            vars: [{
              opacity: '0.25',
              x: '-200',
            }, {
              opacity: '0.5',
              x: '200',
            }],
          },
          {
            targets: ['#firstTarget'],
            type: 'to',
            vars: [{x: '200', y: '300'}],
          },
          {
            targets: ['#fourthTarget'],
            type: 'set',
            vars: [{y: '400'}],
          },
          {
            targets: ['#fourthTarget'],
            type: 'to',
            vars: [{opacity: '0.5', y: '-20', x: '2'}],
          },
        ],
      },
    },
  },
};
