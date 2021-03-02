import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { red50, green50, blue50 } from '@carbon/colors';
import { InformationSquareFilled24, InformationFilled24 } from '@carbon/icons-react';

import HotspotEditorTooltipTab from './HotspotEditorTooltipTab';

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
  title: 'Watson IoT Experimental/☢️ HotSpotEditorModal/HotspotEditorTooltipTab',
  decorators: [withKnobs],
  parameters: {
    component: HotspotEditorTooltipTab,
  },
};

export const WithStateInStory = () => {
  const WithState = () => {
    const [formValues, setFormValues] = useState({});
    const handleOnChange = (change) => {
      setFormValues({
        ...formValues,
        ...change,
        content: { ...formValues.content, ...change.content },
      });
      action('onChange')(change);
    };
    return (
      <div>
        <HotspotEditorTooltipTab
          showInfoMessage={boolean('showInfoMessage', false)}
          hotspotIcons={selectableIcons}
          formValues={formValues}
          onChange={handleOnChange}
          onDelete={action('onDelete')}
          translateWithId={() => {}}
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
            <HotspotEditorTooltipTab
              showInfoMessage={boolean('showInfoMessage', false)}
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
      propTables: [HotspotEditorTooltipTab],
    },
  },
};

export const WithPresetValuesAndCustomColors = () => {
  return (
    <div>
      <HotspotEditorTooltipTab
        showInfoMessage={boolean('showInfoMessage', false)}
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
        translateWithId={() => {}}
      />
    </div>
  );
};

export const WithInfoMessage = () => {
  return (
    <div>
      <HotspotEditorTooltipTab
        showInfoMessage={boolean('showInfoMessage', true)}
        hotspotIcons={selectableIcons}
        formValues={{}}
        onChange={action('onChange')}
        onDelete={action('onDelete')}
        translateWithId={() => {}}
      />
    </div>
  );
};
