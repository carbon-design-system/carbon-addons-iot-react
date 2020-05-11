import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, object, select } from '@storybook/addon-knobs';
import { Tooltip } from 'carbon-components-react';
import { Warning16 } from '@carbon/icons-react';

import HotspotContent from './HotspotContent';

const mockValues = object('values', { temperature: 35.35, humidity: 99 });

storiesOf('Watson IoT/HotspotContent', module)
  .addParameters({ info: 'This Hotspot content is recommended to be used with a Carbon tooltip' })
  .add('basic', () => {
    return (
      <Tooltip open direction="right" triggerId="tooltipTrigger" tooltipId="tooltip">
        <HotspotContent
          title={text('title', 'Hotspot title')}
          description={text('description', 'description')}
          values={mockValues}
          attributes={object('attributes', [
            { dataSourceId: 'temperature', label: 'Temperature' },
            { dataSourceId: 'humidity', label: 'Humidity' },
          ])}
        />
      </Tooltip>
    );
  })
  .add('basic with units and precision', () => {
    return (
      <Tooltip open direction="right" triggerId="tooltipTrigger" tooltipId="tooltip">
        <HotspotContent
          title={text('title', 'Hotspot title')}
          description={text('description', 'description')}
          values={mockValues}
          attributes={object('attributes', [
            { dataSourceId: 'temperature', label: 'Temperature', precision: 3, unit: 'C' },
            { dataSourceId: 'humidity', label: 'Humidity', precision: 0, unit: '%' },
          ])}
        />
      </Tooltip>
    );
  })
  .add(
    'with thresholds',
    () => {
      return (
        <Tooltip open direction="right" triggerId="tooltipTrigger" tooltipId="tooltip">
          <HotspotContent
            title={text('title', 'Hotspot title')}
            description={text('description', 'description')}
            values={mockValues}
            attributes={object('attributes', [
              {
                dataSourceId: 'temperature',
                label: 'Temperature',
                precision: 3,
                unit: 'C',
                thresholds: [{ comparison: '>', value: 30, icon: 'Warning', color: '#FF0000' }],
              },
              { dataSourceId: 'humidity', label: 'Humidity', precision: 0, unit: '%' },
            ])}
            hotspotThreshold={object('hotspotThreshold', {
              dataSourceId: 'humidity',
              comparison: '<',
              value: 100,
              icon: 'Warning',
              color: '#FF0000',
            })}
            renderIconByName={(icon, props) =>
              icon === 'Warning' ? (
                <Warning16 {...props}>
                  <title>{props.title}</title>
                </Warning16>
              ) : null
            }
          />
        </Tooltip>
      );
    },

    {
      knobs: {
        escapeHTML: false, // needed for greater than less than
      },
    }
  )
  .add(
    'locale',
    () => {
      return (
        <Tooltip open direction="right" triggerId="tooltipTrigger" tooltipId="tooltip">
          <HotspotContent
            title={text('title', 'Hotspot title')}
            description={text('description', 'description')}
            values={mockValues}
            attributes={object('attributes', [
              {
                dataSourceId: 'temperature',
                label: 'Temperature',
                precision: 3,
                unit: 'C',
                thresholds: [{ comparison: '>', value: 30.5, icon: 'Warning', color: '#FF0000' }],
              },
              { dataSourceId: 'humidity', label: 'Humidity', precision: 0, unit: '%' },
            ])}
            locale={select('locale', ['fr', 'en'], 'fr')}
            hotspotThreshold={object('hotspotThreshold', {
              dataSourceId: 'humidity',
              comparison: '<',
              value: 100.0,
              icon: 'Warning',
              color: '#FF0000',
            })}
            renderIconByName={(icon, props) =>
              icon === 'Warning' ? (
                <Warning16 {...props}>
                  <title>{props.title}</title>
                </Warning16>
              ) : null
            }
          />
        </Tooltip>
      );
    },
    {
      knobs: {
        escapeHTML: false, // needed for greater than less than
      },
    }
  );
