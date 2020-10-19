import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, select } from '@storybook/addon-knobs';
import {
  ChartColumnFloating32,
  ChartLineData32,
  ChartBubble32,
  ChartVennDiagram32,
  TableSplit32,
  QqPlot32,
  ChartEvaluation32,
  ChartSunburst32,
  Diagram32,
} from '@carbon/icons-react';

import Dropdown from './Dropdown';

export {
  default as DropdownStory,
} from 'carbon-components-react/lib/components/Dropdown/Dropdown-story';

export const items = [
  {
    id: 'option-0',
    text: 'Option 0',
  },
  {
    id: 'option-1',
    text: 'Option 1',
  },
  {
    id: 'option-2',
    text: 'Option 2',
  },
  {
    id: 'option-3',
    text: 'Option 3',
  },
  {
    id: 'option-4',
    text: 'Option 4',
  },
  {
    id: 'option-5',
    text: 'Option 5',
  },
  {
    id: 'option-6',
    text: 'Option 6',
  },
  {
    id: 'option-7',
    text: 'Option 7',
  },
  {
    id: 'option-8',
    text: 'Option 8',
  },
];

export const itemsWithIcons = [
  {
    id: 'option-0',
    icon: ChartColumnFloating32,
    text: 'Column Chart',
  },
  {
    id: 'option-1',
    icon: ChartBubble32,
    text: 'Bubble Chart',
  },
  {
    id: 'option-2',
    icon: ChartVennDiagram32,
    text: 'Venn Diagram',
  },
  {
    id: 'option-3',
    icon: ChartEvaluation32,
    text: 'Evaluation Chart',
  },
  {
    id: 'option-4',
    icon: ChartLineData32,
    text: 'Line Chart',
  },
  {
    id: 'option-5',
    icon: TableSplit32,
    text: 'Option 5',
  },
  {
    id: 'option-6',
    icon: QqPlot32,
    text: 'QQ Plot',
  },
  {
    id: 'option-7',
    icon: ChartSunburst32,
    text: 'Sunburst Chart',
  },
  {
    id: 'option-8',
    icon: Diagram32,
    text: 'Diagram',
  },
];

storiesOf('Watson IoT/Dropdown', module)
  .add('default', () => {
    return React.createElement(() => {
      const [selectedViewId, setSelectedViewId] = useState(items[1].id);

      return (
        <div style={{ width: select('wrapper width', ['300px', '100px'], '300px') }}>
          <Dropdown
            id="dropdown-1"
            items={items}
            selectedViewId={selectedViewId}
            actions={{
              onChangeView: viewItem => {
                setSelectedViewId(viewItem.id);
                action('onChangeView')(viewItem);
              },
            }}
            label="Dropdown menu options"
          />
        </div>
      );
    });
  })
  .add('default with icons', () => {
    return React.createElement(() => {
      const [selectedViewId, setSelectedViewId] = useState(itemsWithIcons[1].id);

      return (
        <div style={{ width: select('wrapper width', ['300px', '100px'], '300px') }}>
          <Dropdown
            id="dropdown-1"
            items={itemsWithIcons}
            selectedViewId={selectedViewId}
            actions={{
              onChangeView: viewItem => {
                setSelectedViewId(viewItem.id);
                action('onChangeView')(viewItem);
              },
            }}
            label="Dropdown menu options"
            hasIconsOnly={boolean('has icons only', true)}
          />
        </div>
      );
    });
  });
