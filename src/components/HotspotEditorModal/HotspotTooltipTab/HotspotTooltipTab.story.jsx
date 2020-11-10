import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';
import { red50, green50, blue50 } from '@carbon/colors';
import {
  InformationSquareFilled24,
  InformationFilled24,
} from '@carbon/icons-react';

import HotspotTooltipTab from './HotspotTooltipTab';

const selectableIcons = [
  {
    id: 'InformationSquareFilled24',
    icon: InformationSquareFilled24,
    text: 'Information square filled',
  },
  {
    id: 'InformationFilled24',
    icon: InformationFilled24,
    text: 'Information filled',
  },
];

const colors = [
  { carbonColor: red50, name: 'red' },
  { carbonColor: green50, name: 'green' },
  { carbonColor: blue50, name: 'blue' },
];

export default {
  title: 'Watson IoT Experimental/HotSpotEditorModal/HotspotTooltipTab',
  decorators: [withKnobs],
  parameters: {
    component: HotspotTooltipTab,
  },
};

export const WithStateInStory = () => {
  const WithState = () => {
    const [formValues, setFormValues] = useState({});
    return (
      <div>
        <HotspotTooltipTab
          infoMessage={text('infoMessage')}
          hotspotIcons={selectableIcons}
          formValues={formValues}
          onChange={(change) => {
            setFormValues({ ...formValues, ...change });
            action('onChange')(change);
          }}
          onDelete={action('onDelete')}
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
      const WithState = () => {
        const [formValues, setFormValues] = useState({});
        return (
          <div>
            <HotspotTooltipTab
              infoMessage={text('infoMessage')}
              hotspotIcons={selectableIcons}
              formValues={formValues}
              onChange={(change) => {
                setFormValues({ ...formValues, ...change });
                action('onChange')(change);
              }}
              onDelete={action('onDelete')}/>
          </div>
        );
      };
      ~~~
      `,
      propTables: [HotspotTooltipTab],
    },
  },
};

export const WithPresetValuesAndCustomColors = () => {
  return (
    <div>
      <HotspotTooltipTab
        hotspotIconFillColors={colors}
        hotspotIcons={selectableIcons}
        formValues={{
          color: colors[1],
          description: 'This is the largest building there is',
          icon: selectableIcons[0],
          title: 'West building',
        }}
        onChange={action('onChange')}
        onDelete={action('onDelete')}
      />
    </div>
  );
};

export const WithInfoMessage = () => {
  return (
    <div>
      <HotspotTooltipTab
        infoMessage={text(
          'inforMessage',
          `Select an existing hotspot on the image to edit it or insert one 
          by selecting an option from the toolbar.`
        )}
        hotspotIcons={selectableIcons}
        formValues={{}}
        onChange={action('onChange')}
        onDelete={action('onDelete')}
      />
    </div>
  );
};
