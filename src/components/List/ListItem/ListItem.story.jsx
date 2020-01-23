import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, boolean } from '@storybook/addon-knobs';
import { Star16, StarFilled16 } from '@carbon/icons-react';

import { CARD_SIZES } from '../../../constants/LayoutConstants';
import { getCardMinSize } from '../../../utils/componentUtilityFunctions';

import ListItem from './ListItem';

storiesOf('Watson IoT Experimental|ListItem', module)
  .add('basic', () => {
    const iconName = select('icon', ['none', 'Star16', 'StarFilled16']);
    const iconComponent =
      iconName === 'Star16' ? Star16 : iconName === 'StarFilled16' ? StarFilled16 : null;
    return (
      <div style={{ width: 400 }}>
        <ListItem
          value={text('value', 'List Item')}
          secondaryValue={text('secondaryValue', null)}
          icon={iconComponent ? React.createElement(iconComponent) : null}
          iconPosition={select('iconPosition', ['left', 'right'])}
          isLargeRow={boolean('isLargeRow', false)}
        />
      </div>
    );
  })
  .add('with value', () => (
    <div style={{ width: 400 }}>
      <ListItem value="List Item" />
    </div>
  ))
  .add('with secondaryValue', () => (
    <div style={{ width: 400 }}>
      <ListItem value="List Item" secondaryValue="Secondary Value" />
    </div>
  ))
  .add('testing overflow', () => (
    <div style={{ width: 400 }}>
      <ListItem
        value="List Item this could be a really long value that can't quite fit"
        secondaryValue="Secondary Value could also be a really, extraordinarily long value"
        isLargeRow={boolean('isLargeRow', true)}
      />
    </div>
  ))
  .add('with icon', () => (
    <div style={{ width: 400 }}>
      <ListItem
        value="List Item"
        icon={<Star16 />}
        iconPosition={select('iconPosition', ['left', 'right'])}
      />
    </div>
  ))
  .add('with isLargeRow', () => (
    <div style={{ width: 400 }}>
      <ListItem
        value="List Item"
        secondaryValue="With isLargeRow, the secondary value serves primarily as a description field for the list item"
        isLargeRow={boolean('isLargeRow', true)}
      />
    </div>
  ))
  .add('testing overflow', () => (
    <div style={{ width: 400 }}>
      <ListItem
        value="List Item this could be a really long value"
        secondaryValue="With isLargeRow, the secondary value serves primarily as a description field for the list item.  If the content is too wide for the list item, it will be visible in a tooltip."
        isLargeRow
      />
    </div>
  ))

  .add('isCategory', () => (
    <div style={{ width: 400 }}>
      <ListItem value="List Item" isCategory />
    </div>
  ));
