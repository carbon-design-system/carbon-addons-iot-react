export const barChartData = {
  empty: {
    labels: ['Dataset 1', 'Dataset 2', 'Dataset 3', 'Dataset 4', 'Dataset 5'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [],
      },
    ],
  },
  simple: {
    labels: ['Dataset 1', 'Dataset 2', 'Dataset 3', 'Dataset 4', 'Dataset 5'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65000, 29123, 35213, 51213, 16932],
      },
    ],
  },
  timeSeries: {
    labels: ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          {
            date: new Date(2019, 0, 1),
            value: 10000,
          },
          {
            date: new Date(2019, 0, 2),
            value: 65000,
          },
          {
            date: new Date(2019, 0, 3),
            value: 10000,
          },
          {
            date: new Date(2019, 0, 6),
            value: 49213,
          },
          {
            date: new Date(2019, 0, 7),
            value: 51213,
          },
        ],
      },
    ],
  },
  grouped: {
    labels: ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65000, -29123, -35213, 51213, 16932],
      },
      {
        label: 'Dataset 2',
        data: [32432, -21312, -56456, -21312, 34234],
      },
      {
        label: 'Dataset 3',
        data: [-12312, 23232, 34232, -12312, -34234],
      },
      {
        label: 'Dataset 4',
        data: [-32423, 21313, 64353, 24134, 32423],
      },
    ],
  },
  stacked: {
    labels: ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'],
    datasets: [
      {
        label: 'Dataset 1',
        fillColors: ['#d91e28'],
        data: [65000, 29123, 35213, 51213, 16932],
      },
      {
        label: 'Dataset 2',
        fillColors: ['#ff832c'],
        data: [32432, 21312, 56456, 21312, 34234],
      },
      {
        label: 'Dataset 3',
        fillColors: ['#fdd13a'],
        data: [12312, 23232, 34232, 12312, 34234],
      },
      {
        label: 'Dataset 4',
        fillColors: ['#feeaaa'],
        data: [32423, 21313, 64353, 24134, 32423],
      },
    ],
  },
  stackedTimeSeries: {
    labels: ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          {
            date: new Date(2019, 0, 1),
            value: 10000,
          },
          {
            date: new Date(2019, 0, 5),
            value: 65000,
          },
          {
            date: new Date(2019, 0, 8),
            value: 10000,
          },
          {
            date: new Date(2019, 0, 13),
            value: 49213,
          },
          {
            date: new Date(2019, 0, 17),
            value: 51213,
          },
        ],
      },
      {
        label: 'Dataset 2',
        data: [
          {
            date: new Date(2019, 0, 3),
            value: 75000,
          },
          {
            date: new Date(2019, 0, 6),
            value: 57312,
          },
          {
            date: new Date(2019, 0, 8),
            value: 21432,
          },
          {
            date: new Date(2019, 0, 15),
            value: 70323,
          },
          {
            date: new Date(2019, 0, 19),
            value: 21300,
          },
        ],
      },
      {
        label: 'Dataset 3',
        data: [
          {
            date: new Date(2019, 0, 1),
            value: 50000,
          },
          {
            date: new Date(2019, 0, 5),
            value: 15000,
          },
          {
            date: new Date(2019, 0, 8),
            value: 20000,
          },
          {
            date: new Date(2019, 0, 13),
            value: 39213,
          },
          {
            date: new Date(2019, 0, 17),
            value: 61213,
          },
        ],
      },
      {
        label: 'Dataset 4',
        data: [
          {
            date: new Date(2019, 0, 2),
            value: 10,
          },
          {
            date: new Date(2019, 0, 6),
            value: 37312,
          },
          {
            date: new Date(2019, 0, 8),
            value: 51432,
          },
          {
            date: new Date(2019, 0, 15),
            value: 40323,
          },
          {
            date: new Date(2019, 0, 19),
            value: 31300,
          },
        ],
      },
    ],
  },
};
