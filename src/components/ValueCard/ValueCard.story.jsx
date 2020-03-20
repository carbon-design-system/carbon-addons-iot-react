import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object, boolean, number } from '@storybook/addon-knobs';
import { Bee16, Checkmark16 } from '@carbon/icons-react';

import { CARD_SIZES, VALUE_CARD_DATA_STATE } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import ValueCard from './ValueCard';

function getDataStateProp() {
  return {
    label: text('dataState : Label', 'No data available for this score at this time'),
    description: text(
      'dataState : Description',
      'The last successful score was 68 at 13:21 - 10/21/2019 but wait, there is more, according to the latest test results this line is too long.'
    ),
    extraTooltipText: text(
      'dataState : ExtraTooltipText',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    ),
    learnMoreElement: (
      <a className="bx--link" href="#top">
        Learn more
      </a>
    ),
  };
}

storiesOf('Watson IoT/ValueCard', module)
  .add('small / basic', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Occupancy')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'occupancy',
                unit: '%',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ occupancy: number('occupancy', 88) }}
        />
      </div>
    );
  })
  .add('small / long', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Occupancy')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'occupancy',
                unit: '%',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ occupancy: text('occupancy', 'Really really busy') }}
        />
      </div>
    );
  })

  .add('small / wrapping', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', '120px'), margin: 20 }}>
        <ValueCard
          title={text('title', 'Occupancy')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'occupancy',
                unit: '%',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            occupancy: text('occupancy', 'Really really busy loong long long long'),
          }}
        />
      </div>
    );
  })
  .add('small / units incl wrapping', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <Fragment>
        <div style={{ width: text('cardWidth', `150px`), margin: 20 }}>
          <ValueCard
            title={text('title', 'Occupancy')}
            id="facilitycard"
            content={{
              attributes: object('attributes', [
                {
                  dataSourceId: 'occupancy',
                  unit: '%',
                },
              ]),
            }}
            breakpoint="lg"
            size={size}
            values={{ occupancy: number('occupancy', 88) }}
          />
        </div>
        <div style={{ width: text('wrappedCardWidth', '120px'), margin: 20 }}>
          <ValueCard
            title={text('title', 'Occupancy')}
            id="facilitycard"
            content={{
              attributes: object('attributes', [
                {
                  dataSourceId: 'occupancy',
                  unit: '%',
                },
              ]),
            }}
            breakpoint="lg"
            size={size}
            values={{ occupancy: text('occupancy', 'A longer value that cause the unit to wrap') }}
          />
        </div>
      </Fragment>
    );
  })
  .add('small / title', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Foot Traffic')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                label: 'Average',
                dataSourceId: 'footTraffic',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ footTraffic: number('footTraffic', 13572) }}
        />
      </div>
    );
  })
  .add('small / long string', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title="Tagpath"
          id="facilitycard"
          content={{
            attributes: [
              {
                label: 'Tagpath',
                dataSourceId: 'footTraffic',
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{
            footTraffic:
              'rutherford/rooms/northadd/ah2/ft_supflow/eurutherford/rooms/northadd/ah2/ft_supflow/eu',
          }}
        />
      </div>
    );
  })
  .add('small / trend down', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `150px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Foot Traffic')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'footTraffic',
                secondaryValue: { dataSourceId: 'trend', trend: 'down', color: 'red' },
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ footTraffic: number('footTraffic', 13572), trend: text('trend', '22%') }}
        />
      </div>
    );
  })
  .add('small / trend up', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `150px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Alert Count')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'alerts',
                secondaryValue: { dataSourceId: 'trend', trend: 'up', color: 'green' },
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ alerts: number('alerts', 35), trend: number('trend', 12) }}
        />
      </div>
    );
  })
  .add('small / thresholds (number, no icon)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Alert Count')}
          id="facilitycard"
          content={{
            attributes: [
              {
                dataSourceId: 'alertCount',
                thresholds: [
                  {
                    comparison: '>=',
                    value: 30,
                    color: 'red',
                  },
                  {
                    comparison: '<=',
                    value: 5,
                    color: 'green',
                  },
                  {
                    comparison: '<',
                    value: 30,
                    color: 'orange',
                  },
                ],
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{ alertCount: number('alertCount', 35) }}
        />
      </div>
    );
  })
  .add('small / thresholds (number, icon)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: `${number('cardWidth', 300)}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Alert Count')}
          id="facilitycard"
          content={{
            attributes: [
              {
                dataSourceId: 'alertCount',
                thresholds: [
                  {
                    comparison: '>',
                    value: 5,
                    icon: 'checkmark',
                    color: 'green',
                  },
                ],
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{ alertCount: number('alertCount', 70) }}
        />
      </div>
    );
  })
  .add('small / thresholds (number, custom renderIconByName)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Alert Count')}
          id="facilitycard"
          renderIconByName={(name, props = {}) =>
            name === 'bee' ? (
              <Bee16 {...props}>
                <title>{props.title}</title>
              </Bee16>
            ) : name === 'checkmark' ? (
              <Checkmark16 {...props}>
                <title>{props.title}</title>
              </Checkmark16>
            ) : (
              <span>Unknown</span>
            )
          }
          content={{
            attributes: [
              {
                dataSourceId: 'alertCount',
                thresholds: [
                  {
                    comparison: '<',
                    value: 5,
                    icon: 'bee',
                    color: 'green',
                  },
                ],
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{ alertCount: number('alertCount', 4) }}
        />
      </div>
    );
  })
  .add('smallwide / thresholds (string)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALLWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Status')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'status',
                thresholds: [
                  {
                    comparison: '=',
                    value: 'Healthy',
                    icon: 'checkmark',
                    color: 'green',
                  },
                  {
                    comparison: '=',
                    value: 'Unhealthy',
                    icon: 'close',
                    color: 'red',
                  },
                ],
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ status: text('status', 'Unhealthy') }}
        />
      </div>
    );
  })
  .add('smallwide / vertical 2', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALLWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Status')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'status',
                label: 'Status',
              },
              {
                dataSourceId: 'comfortLevel',
                label: 'Comfort level',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ status: text('status', 'Good'), comfortLevel: text('comfortLevel', 'Healthy') }}
        />
      </div>
    );
  })
  .add('smallwide / horizontal 2', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALLWIDE);
    return (
      <div style={{ width: `${number('cardWidth', 300)}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Status')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'status',
                label: 'Status',
              },
              {
                dataSourceId: 'comfortLevel',
                label: 'Comfort level',
                unit: 'feels',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            status: text('status', 'Problem'),
            comfortLevel: text('comfortLevel', 'Healthy'),
          }}
        />
      </div>
    );
  })
  .add('medium / vertical / single', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ comfortLevel: number('comfortLevel', 89) }}
        />
      </div>
    );
  })
  .add('medium / vertical / multiple', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
              { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
            utilization: number('utilization', 76),
          }}
        />
      </div>
    );
  })
  .add('medium / vertical /  2', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
          }}
        />
      </div>
    );
  })
  .add('medium / vertical /  3', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `120px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: [
              {
                label: 'Comfort Level',
                dataSourceId: 'comfortLevel',
                unit: '%',
                thresholds: [
                  {
                    comparison: '>',
                    value: 80,
                    color: '#F00',
                    icon: 'warning',
                  },
                  {
                    comparison: '<',
                    value: 80,
                    color: '#5aa700',
                    icon: 'checkmark',
                  },
                ],
              },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
                thresholds: [
                  {
                    comparison: '>',
                    value: 80,
                    color: '#F00',
                    icon: 'warning',
                  },
                  {
                    comparison: '<',
                    value: 80,
                    color: '#5aa700',
                    icon: 'checkmark',
                  },
                ],
              },
              {
                label: 'Humidity',
                dataSourceId: 'humidity',
                unit: '˚F',
                precision: 1,
                thresholds: [
                  {
                    comparison: '>',
                    value: 80,
                    color: '#F00',
                    icon: 'warning',
                  },
                  {
                    comparison: '<',
                    value: 80,
                    color: '#5aa700',
                    icon: 'checkmark',
                  },
                ],
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 345678234234234234),
            averageTemp: number('averageTemp', 456778234234234234),
            humidity: number('humidity', 88888678234234234234),
          }}
        />
      </div>
    );
  })
  .add('medium / horizontal /  2', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `300px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
          }}
        />
      </div>
    );
  })
  .add('medium / horizontal /  3', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `300px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
              { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
            utilization: number('utilization', 76),
          }}
        />
      </div>
    );
  })
  .add('large / vertical /  5', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: text('cardWidth', `300px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
              { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
              { label: 'Humidity', dataSourceId: 'humidity', unit: '%' },
              { label: 'Air Flow', dataSourceId: 'air_flow' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
            utilization: number('utilization', 76),
            humidity: number('humidity', 50),
            air_flow: number('air_flow', 0.567),
          }}
        />
      </div>
    );
  })
  .add('large-thin / vertical /  6', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGETHIN);
    return (
      <div style={{ width: text('cardWidth', `250px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
              { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
              { label: 'CPU', dataSourceId: 'cpu', unit: '%' },
              { label: 'Humidity', dataSourceId: 'humidity', unit: '%' },
              { label: 'Air flow', dataSourceId: 'air_flow', unit: '%' },
              { label: 'Air quality', dataSourceId: 'air_quality', unit: '%' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
            utilization: number('utilization', 76),
            humidity: number('humidity', 76),
            cpu: number('cpu', 76),
            air_flow: number('air_flow', 76),
            air_quality: number('air_quality', 76),
          }}
        />
      </div>
    );
  })
  .add('medium-wide / horizontal /  3', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: text('cardWidth', `300px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
              { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
            utilization: number('utilization', 76),
          }}
        />
      </div>
    );
  })
  .add('with boolean', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Uncomfortable?')}
          id="facilitycard"
          content={{ attributes: [{ label: 'Monthly summary', dataSourceId: 'monthlySummary' }] }}
          breakpoint="lg"
          size={size}
          values={{ monthlySummary: boolean('monthlySummary', false) }}
        />
      </div>
    );
  })
  .add('empty state', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{ attributes: [] }}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('data state - no data - medium - scroll page', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    const width = text('cardWidth', `${getCardMinSize('lg', CARD_SIZES.MEDIUM).x}px`);

    const myDataState = {
      type: select(
        'dataState : Type',
        Object.keys(VALUE_CARD_DATA_STATE),
        VALUE_CARD_DATA_STATE.NO_DATA
      ),
      ...getDataStateProp(),
      learnMoreElement: (
        <button
          type="button"
          onClick={() => {
            console.info('Learning more is great');
          }}
        >
          Learn more
        </button>
      ),
    };

    return (
      <div>
        <ValueCard
          style={{ width }}
          title={text('title', 'Health score')}
          content={{ attributes: [{ label: 'Monthly summary', dataSourceId: 'monthlySummary' }] }}
          dataState={myDataState}
          breakpoint="lg"
          size={size}
          id="myStoryId"
        />

        <div style={{ height: '150vh' }} />
      </div>
    );
  })
  .add('data state - no data - custom icon - large', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    const myDataState = {
      type: select(
        'dataState : Type',
        Object.keys(VALUE_CARD_DATA_STATE),
        VALUE_CARD_DATA_STATE.NO_DATA
      ),
      ...getDataStateProp(),
      icon: (
        <Bee16 style={{ fill: 'orange' }}>
          <title>App supplied icon</title>
        </Bee16>
      ),
    };

    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Health score')}
          content={{ attributes: [{ label: 'Monthly summary', dataSourceId: 'monthlySummary' }] }}
          dataState={myDataState}
          breakpoint="lg"
          size={size}
          id="myStoryId"
        />
      </div>
    );
  })
  .add('data state - error - medium', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    const myDataState = {
      ...getDataStateProp(),
      type: select(
        'dataState : Type',
        Object.keys(VALUE_CARD_DATA_STATE),
        VALUE_CARD_DATA_STATE.ERROR
      ),
    };

    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Health score')}
          content={{ attributes: [{ label: 'Monthly summary', dataSourceId: 'monthlySummary' }] }}
          dataState={myDataState}
          breakpoint="lg"
          size={size}
          id="myStoryId"
        />
      </div>
    );
  })
  .add('data state - error - small', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    const dataStateType = select(
      'dataStateType',
      Object.keys(VALUE_CARD_DATA_STATE),
      VALUE_CARD_DATA_STATE.ERROR
    );
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('sm', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Health score')}
          id="myStoryId"
          content={{ attributes: [{ label: 'Monthly summary', dataSourceId: 'monthlySummary' }] }}
          dataState={{
            type: dataStateType,
            label: 'No data available',
            description: 'There is no available data for this score at this time',
            extraTooltipText:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  ',
            learnMoreURL: 'http://www.ibm.com',
            learnMoreText: 'Learn more',
          }}
          breakpoint="sm"
          size={size}
        />
      </div>
    );
  })
  .add('long titles and values', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Really long card title?')}
          id="facilitycard"
          content={{
            attributes: [
              {
                label: 'Monthly summary',
                dataSourceId: 'monthlySummary',
                unit: text('unit', ''),
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{ monthlySummary: number('monthlySummary', 20000000000000000) }}
        />
      </div>
    );
  })
  .add('long titles and values/multiple', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Really really really long card title?')}
          id="facilitycard"
          content={{
            attributes: [
              {
                label: 'Monthly summary',
                dataSourceId: 'monthlySummary',
                unit: text('unit', 'Wh'),
              },
              {
                label: 'Yearly summary',
                dataSourceId: 'yearlySummary',
                unit: text('unit', 'Wh'),
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{
            monthlySummary: number('monthlySummary', 100000000),
            yearlySummary: number('yearlySummary', 40000000000000),
          }}
        />
      </div>
    );
  })
  .add('editable', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Really really really long card title?')}
          id="facilitycard"
          isEditable
          content={{
            attributes: [
              {
                label: 'Monthly summary',
                dataSourceId: 'monthlySummary',
                unit: text('unit', 'Wh'),
              },
              {
                label: 'Yearly summary',
                dataSourceId: 'yearlySummary',
                unit: text('unit', 'Wh'),
              },
            ],
          }}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('dataFilters', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `300px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions per device')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                label: 'Device 1 Comfort',
                dataSourceId: 'comfortLevel',
                unit: '%',
                dataFilter: { deviceid: '73000' },
              },
              {
                label: 'Device 2 Comfort',
                dataSourceId: 'comfortLevel',
                unit: '%',
                dataFilter: { deviceid: '73001' },
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={object('values', [
            { deviceid: '73000', comfortLevel: '100', unit: '%' },
            { deviceid: '73001', comfortLevel: '50', unit: '%' },
          ])}
        />
      </div>
    );
  });
