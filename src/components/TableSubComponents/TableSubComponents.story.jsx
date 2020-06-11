import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, select } from '@storybook/addon-knobs';

import ViewDropdown from './ViewDropdown/ViewDropdown';

storiesOf('Watson IoT/TableSubComponents', module).add(
  'ViewDropdown',
  () => {
    const myViews = [
      {
        id: 'view-1',
        text: 'My saved 1',
      },
      {
        id: 'view-2',
        text: 'My saved 2',
      },
      {
        id: 'view-3',
        text: 'My saved 3 with a very long name that will get truncated',
      },
    ];

    return React.createElement(() => {
      // This is a simple example state that should be replaced by the
      // consuming Application's data store
      const [selectedViewId, setSelectedViewId] = useState(undefined);

      return (
        <div style={{ width: select('wrapper width', ['300px', '100px'], '300px') }}>
          <ViewDropdown
            selectedViewId={selectedViewId}
            activeViewEdited={boolean('activeViewEdited', true)}
            views={myViews}
            actions={{
              onSaveAsNewView: action('onSaveAsNewView'),
              onManageViews: action('onManageViews'),
              onChangeView: viewItem => {
                setSelectedViewId(viewItem.id);
                action('onChangeView')(viewItem);
              },
            }}
          />
        </div>
      );
    });
  },
  {
    info: {
      propTables: [ViewDropdown],
      text: `This is an example of the <ViewDropdown> table sub component. The state needs to be managed by the
       consuming application. 
       
       ~~~js
      const myViews = [
        {
          id: 'view-1',
          text: 'My saved 1',
        },
        {
          id: 'view-2',
          text: 'My saved 2',
        },
        {
          id: 'view-3',
          text: 'My saved 3 with a very long name that will get truncated',
        },
      ];
  
      return React.createElement(() => {
        // This is a simple example state that should be replaced by the 
        // consuming Application's data store        
        const [selectedViewId, setSelectedViewId] = useState(undefined);
  
        return (
          <div style={{ width: select('wrapper width', ['300px', '100px'], '300px') }}>
            <ViewDropdown
              selectedViewId={selectedViewId}
              activeViewEdited={boolean('activeViewEdited', true)}
              views={myViews}
              actions={{
                onSaveAsNewView: action('onSaveAsNewView'),
                onManageViews: action('onManageViews'),
                onChangeView: viewItem => {
                  setSelectedViewId(viewItem.id);
                  action('onChangeView')();
                },
              }}
            />
          </div>
        );
      });
       ~~~       
       `,
    },
  }
);
