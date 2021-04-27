import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';

import DynamicHotspotSourcePicker from './DynamicHotspotSourcePicker';

const dataItems = [
  {
    dataSourceId: 'temperature',
    label: 'Temperature',
  },
  {
    dataSourceId: 'pressure',
    label: 'Pressure',
  },
];

export default {
  title: 'Watson IoT Experimental/☢️ HotSpotEditorModal/DynamicHotspotSourcePicker',
  decorators: [withKnobs],
  parameters: {
    component: DynamicHotspotSourcePicker,
  },
};

export const WithStateInStory = () => {
  const WithState = () => {
    const [xSourceId, setXSourceId] = useState();
    const [ySourceId, setYSourceId] = useState();

    return (
      <div>
        <DynamicHotspotSourcePicker
          selectedSourceIdX={xSourceId}
          selectedSourceIdY={ySourceId}
          dataSourceItems={object('dataSourceItems', dataItems)}
          onXValueChange={(newValue) => {
            action('onXValueChange')(newValue);
            setXSourceId(newValue);
          }}
          onYValueChange={(newValue) => {
            action('onYValueChange')(newValue);
            setYSourceId(newValue);
          }}
          onClear={() => {
            action('onClear')();
            setXSourceId(undefined);
            setYSourceId(undefined);
          }}
          translateWithId={jest.fn()}
        />
      </div>
    );
  };

  return <WithState />;
};

WithStateInStory.story = {
  name: 'Example with externaly managed state',
  parameters: {
    info: {
      text: `
      ~~~js

      ~~~
      `,
      propTables: [DynamicHotspotSourcePicker],
    },
  },
};
