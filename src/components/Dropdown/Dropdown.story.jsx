import React, { useState, useEffect } from 'react';
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

const items = [
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
  // .addDecorator(withKnobs)
  .add('default', () => {
    return React.createElement(() => {
      const [selectedViewId, setSelectedViewId] = useState(items[1].id);

      return (
        <div style={{ width: select('wrapper width', ['300px', '100px'], '300px') }}>
          <Dropdown
            items={items}
            selectedViewId={selectedViewId}
            actions={{
              onChangeView: viewItem => {
                setSelectedViewId(viewItem.id);
                action('onChangeView')(viewItem);
              },
            }}
            label="Dropdown menu options"
            hasIconsOnly={boolean('has icons only', true)}
            customFooter={<div>some footer</div>}
            invalidText="woof"
          />
        </div>
      );
    });
  });
