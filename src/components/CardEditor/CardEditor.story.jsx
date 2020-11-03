import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';

import CardEditor from './CardEditor';

const CardEditorInteractive = () => {
  const defaultCard = {
    title: 'New card',
    size: CARD_SIZES.SMALL,
    type: 'VALUE',
  };

  const [counter, setCounter] = useState(1);
  const [data, setData] = useState({ ...defaultCard, id: `card-${counter}` });

  return (
    <div>
      <div style={{ position: 'absolute' }}>
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 0,
          height: 'calc(100vh - 6rem)',
        }}>
        <CardEditor
          cardConfig={data}
          onShowGallery={() => setData(null)}
          onAddCard={(type) => {
            setData({ ...defaultCard, id: `card-${counter + 1}`, type });
            setCounter(counter + 1);
          }}
          onChange={(newCardConfig) => setData(newCardConfig)}
        />
      </div>
    </div>
  );
};

export default {
  title: 'Watson IoT Experimental/CardEditor',
  decorators: [withKnobs],

  parameters: {
    component: CardEditor,
  },
};

export const Default = () => (
  <div style={{ position: 'absolute', right: 0, height: 'calc(100vh - 6rem)' }}>
    <CardEditor
      cardConfig={object('cardConfig', {
        content: {
          attributes: [
            {
              dataSourceId: 'discharge_flow_rate',
              label: 'Discharge flow',
              precision: 3,
            },
            {
              dataSourceId: 'discharge_perc',
              label: 'Max Discharge %',
              precision: 3,
            },
          ],
        },
        dataSource: {
          attributes: [
            {
              aggregator: 'mean',
              attribute: 'discharge_flow_rate',
              id: 'discharge_flow_rate',
            },
            {
              aggregator: 'max',
              attribute: 'discharge_perc',
              id: 'discharge_perc',
            },
          ],
        },
        id: 'calculated',
        size: 'MEDIUMTHIN',
        title: 'Calculated',
        type: 'VALUE',
      })}
      errors={{}}
      onShowGallery={action('onShowGallery')}
      onChange={action('onChange')}
      onAddCard={action('onAddCard')}
    />
  </div>
);

Default.story = {
  name: 'default',
};

export const ForTimeSeries = () => (
  <div style={{ position: 'absolute', right: 0, height: 'calc(100vh - 6rem)' }}>
    <CardEditor
      cardConfig={object('cardConfig', {
        id: 'timeseries',
        title: 'time-series-card',
        size: 'MEDIUMWIDE',
        type: 'TIMESERIES',
        content: {
          series: [
            {
              dataSourceId: 'torque max',
              label: 'Torque Max',
              color: '#6929c4',
            },
            {
              dataSourceId: 'torque mean',
              label: 'Torque Mean',
              color: '#1192e8',
            },
          ],
          xLabel: 'Time',
          yLabel: 'Temperature',
          unit: '˚F',
          includeZeroOnXaxis: true,
          includeZeroOnYaxis: true,
          timeDataSourceId: 'timestamp',
        },
        interval: 'day',
      })}
      errors={{}}
      onShowGallery={action('onShowGallery')}
      onChange={action('onChange')}
      dataItems={['Torque Max', 'Torque Min', 'Torque Mean']}
      onAddCard={action('onAddCard')}
    />
  </div>
);

ForTimeSeries.story = {
  name: 'for TimeSeries',
};

export const WithNoCardDefinedGalleryView = () => (
  <div style={{ position: 'absolute', right: 0, height: 'calc(100vh - 6rem)' }}>
    <CardEditor
      onShowGallery={action('onShowGallery')}
      onChange={action('onChange')}
      onAddCard={action('onAddCard')}
    />
  </div>
);

WithNoCardDefinedGalleryView.story = {
  name: 'with no card defined (gallery view)',
};

export const Interactive = () => <CardEditorInteractive />;

Interactive.story = {
  name: 'interactive',
};
