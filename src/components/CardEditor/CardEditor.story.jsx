import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
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
      <div style={{ position: 'absolute', right: 0, height: 'calc(100vh - 6rem)' }}>
        <CardEditor
          value={data}
          onShowGallery={() => setData(null)}
          onAddCard={type => {
            setData({ ...defaultCard, id: `card-${counter + 1}`, type });
            setCounter(counter + 1);
          }}
          onChange={newCardData => setData(newCardData)}
        />
      </div>
    </div>
  );
};

storiesOf('Watson IoT Experimental/CardEditor', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <div style={{ position: 'absolute', right: 0, height: 'calc(100vh - 6rem)' }}>
      <CardEditor
        value={object('value', {
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
  ))
  .add('with no card defined (gallery view)', () => (
    <div style={{ position: 'absolute', right: 0, height: 'calc(100vh - 6rem)' }}>
      <CardEditor
        onShowGallery={action('onShowGallery')}
        onChange={action('onChange')}
        onAddCard={action('onAddCard')}
      />
    </div>
  ))
  .add('interactive', () => <CardEditorInteractive />);
