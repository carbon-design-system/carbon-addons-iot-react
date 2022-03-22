import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React, { useState, useEffect, createElement } from 'react';

import StackedAreaChartCard from './StackedAreaChartCard';

const mockValues = [
  {
    group: 'Dummy',
    date: '2019-01-01T02:00:00.000Z',
    value: 10000,
  },

  {
    group: 'Dummy 2',
    date: '2019-01-05T02:00:00.000Z',
    value: 65000,
  },
  {
    group: 'Dummy 3',
    date: '2019-01-05T02:00:00.000Z',
    value: 65000,
  },
  {
    group: 'Dummy',
    date: '2019-01-02T02:00:00.000Z',
    value: 50400,
  },

  {
    group: 'Dummy 2',
    date: '2019-01-03T02:00:00.000Z',
    value: 32200,
  },
  {
    group: 'Dummy 3',
    date: '2019-01-07T02:00:00.000Z',
    value: 59293,
  },
];
jest.unmock('@carbon/charts-react');

describe('StackedAreaChartCard - unmock @carbon/charts-react', () => {
  it('change values data', () => {
    const { container } = render(
      createElement(() => {
        const [mock, setMock] = useState([]);
        useEffect(() => {
          setMock([...mockValues]);
        }, []);
        return (
          <StackedAreaChartCard
            title="Card title"
            content={{
              xLabel: 'xlabel prop',
              yLabel: 'y label prop',
              xProperty: 'date',
              yProperty: 'value',
            }}
            values={mock}
            size="MEDIUM"
            breakpoint="md"
            isExpanded
            locale="en"
            availableActions={{ expand: true }}
            footerContent={() => <div>Occured on ... </div>}
            onCardAction={() => {}}
          />
        );
      })
    );
    expect(container.querySelectorAll('.bx--chart-holder')).toHaveLength(1);
  });
});
