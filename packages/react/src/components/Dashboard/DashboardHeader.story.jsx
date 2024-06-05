import React from 'react';
import { text } from '@storybook/addon-knobs';
import { TrashCan, Pin, Edit } from '@carbon/react/icons';
import { action } from '@storybook/addon-actions';
import { DatePicker, DatePickerInput } from '@carbon/react';

import StoryNotice, { deprecatedStoryTitle } from '../../internal/StoryNotice';

import DashboardHeader from './DashboardHeader';

export default {
  title: '1 - Watson IoT/Deprecated/🚫 Dashboard Header',
};

export const Deprecated = () => <StoryNotice componentName="DashboardHeader" />;
Deprecated.storyName = deprecatedStoryTitle;

export const Basic = () => {
  return (
    <div style={{ minWidth: '1000px' }}>
      <DashboardHeader
        title={text('title', 'Monthly Building: Munich')}
        description={text('description', 'Shows an overview of monthly data for a building')}
        lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
      />
    </div>
  );
};

Basic.storyName = 'basic';

export const WithFilter = () => {
  return (
    <div style={{ width: '1000px' }}>
      <DashboardHeader
        title={text('title', 'Monthly Building: Munich')}
        description={text('description', 'Shows an overview of daily data for a building')}
        lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
        filter={
          <DatePicker id="date-picker" onChange={action('onChangeDate')} datePickerType="single">
            <DatePickerInput
              id="date-picker-input-id"
              className="some-class"
              labelText="Select day"
              pattern="d{1,2}/d{4}"
              placeholder="mm/dd/yyyy"
              invalidText="A valid value is required"
              iconDescription="Icon description"
              onClick={action('onClickDate')}
              onChange={action('onTextChange')}
            />
          </DatePicker>
        }
      />
    </div>
  );
};

WithFilter.storyName = 'with filter';

export const WithCustomActions = () => {
  return (
    <div style={{ width: '1000px' }}>
      <DashboardHeader
        title={text('title', 'Monthly Building: Munich')}
        description={text('description', 'Shows an overview of daily data for a building')}
        lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
        actions={[
          { id: 'edit', labelText: 'Edit', icon: <Edit size={20} /> },
          { id: 'delete', labelText: 'Delete', icon: TrashCan },
        ]}
        onDashboardAction={action('onDashboardAction')}
      />
    </div>
  );
};

WithCustomActions.storyName = 'with custom actions';

export const WithFilterAndCustomActions = () => {
  return (
    <div style={{ width: '1000px' }}>
      <DashboardHeader
        title={text('title', 'Monthly Building: Munich')}
        description={text('description', 'Shows an overview of daily data for a building')}
        lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
        filter={
          <DatePicker id="date-picker" onChange={action('onChangeDate')} datePickerType="single">
            <DatePickerInput
              id="date-picker-input-id"
              className="some-class"
              hideLabel
              labelText="Select day"
              pattern="d{1,2}/d{4}"
              placeholder="mm/dd/yyyy"
              invalidText="A valid value is required"
              iconDescription="Icon description"
              onClick={action('onClickDate')}
              onChange={action('onTextChange')}
            />
          </DatePicker>
        }
        actions={[
          { id: 'edit', labelText: 'Edit', icon: <Edit size={20} /> },
          { id: 'delete', labelText: 'Delete', icon: <TrashCan size={20} /> },
          { id: 'pin', labelText: 'Pin', icon: <Pin size={20} /> },
        ]}
        onDashboardAction={action('onDashboardAction')}
      />
    </div>
  );
};

WithFilterAndCustomActions.storyName = 'with filter and custom actions';

export const WithCustomActionsComponent = () => {
  return (
    <DashboardHeader
      title={text('title', 'Monthly Building: Munich')}
      description={text('description', 'Shows an overview of daily data for a building')}
      lastUpdated={text('lastUpdated', '03/31/2019 13:55')}
      actions={[
        {
          id: 'edit',
          customActionComponent: (
            <div key="my custom component">we can now send custom components</div>
          ),
        },
      ]}
    />
  );
};

WithCustomActionsComponent.storyName = 'with custom actions component';
