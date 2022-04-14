import React, { useState } from 'react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Edit16, Information16, SendAlt16 } from '@carbon/icons-react';

import Button from '../Button/Button';
import Dropdown from '../Dropdown/Dropdown';

import SidePanel from './SidePanel';

const primaryButton = (
  <Button
    id="buttonIcon1"
    kind="primary"
    onClick={() => {
      action('Initiate clicked');
    }}
  >
    Initiate
  </Button>
);

const secondaryButton = (
  <Button
    id="buttonIcon2"
    kind="secondary"
    onClick={() => {
      action('Cancel clicked');
    }}
  >
    Cancel
  </Button>
);

const items = [
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
    text: 'Option 2 ',
  },
  {
    id: 'option-3',
    text: 'Option 3',
  },
];

const iconButtons = [
  <Button hasIconOnly kind="ghost" renderIcon={Edit16} onClick={action('clicked')} size="small" />,
  <Button
    hasIconOnly
    kind="ghost"
    renderIcon={Information16}
    onClick={action('clicked')}
    size="small"
  />,
  <Button
    hasIconOnly
    kind="ghost"
    renderIcon={SendAlt16}
    onClick={action('clicked')}
    size="small"
  />,
];

const dropdown = (
  <Dropdown
    id="default"
    titleText="Dropdown label"
    helperText="This is some helper text"
    label="Dropdown menu options"
    items={items}
    itemToString={(item) => (item ? item.text : '')}
    onChange={action('onChange')}
  />
);

const content = (
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a dapibus nulla. Fusce et enim
      et elit rutrum interdum quis eu nulla. Nulla neque neque, condimentum eget pellentesque sit
      amet, volutpat ac enim. Etiam id magna vel dolor condimentum imperdiet.
    </p>
    {dropdown}
  </div>
);

const Interactive = ({
  direction,
  slideOver,
  inline,
  slideIn,
  showDrawer,
  showCloseButton,
  icons,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        'flex-direction': direction === 'start' ? 'row' : 'row-reverse',
        margin: '1rem',
      }}
    >
      <SidePanel
        open={open}
        slideOver={slideOver}
        inline={inline}
        slideIn={slideIn}
        direction={direction}
        title="My title"
        content={content}
        icons={icons}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        showDrawer={showDrawer}
        showCloseButton={showCloseButton}
        onClose={() => setOpen(!open)}
      />
      <div style={{ padding: '1rem' }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a dapibus nulla. Fusce et
          enim et elit rutrum interdum quis eu nulla. Nulla neque neque, condimentum eget
          pellentesque sit amet, volutpat ac enim. Etiam id magna vel dolor condimentum imperdiet.
          Vivamus eu pellentesque turpis, eget ultricies lectus. Vestibulum sodales massa non
          lobortis interdum. Sed cursus sem in dolor tempus tempus. Pellentesque et nisi vel erat
          egestas ultricies. Etiam id risus nec mi laoreet suscipit. Phasellus porttitor accumsan
          placerat. Donec auctor nunc id erat congue, tincidunt viverra diam feugiat. Donec sit amet
          quam vel augue auctor posuere. Nunc maximus volutpat nulla vel vehicula. Praesent bibendum
          nulla at erat facilisis sodales. Aenean aliquet dui vel iaculis tincidunt. Praesent
          suscipit ultrices mi eget finibus. Mauris vehicula ultricies auctor. Nam vestibulum
          iaculis lectus, nec sodales metus lobortis non. Suspendisse nulla est, consectetur non
          convallis et, tristique eu risus. Sed ut tortor et nulla tempor vulputate et vel ligula.
          Curabitur egestas lorem ut mi vestibulum porttitor. Fusce eleifend vehicula semper. Donec
          luctus neque quam, et blandit eros accumsan at.
        </p>
        <Button
          onClick={() => {
            setOpen(!open);
          }}
        >
          push
        </Button>
        {dropdown}
      </div>
    </div>
  );
};

export default {
  title: '2 - Watson IoT Experimental/☢️ SidePanel',
  decorators: [withKnobs],

  parameters: {
    component: SidePanel,
  },
};

export const SlideOverStory = () => (
  <Interactive
    direction={select('direction', ['start', 'end'], 'start')}
    slideOver
    showCloseButton={boolean('Show close button', false)}
    icons={iconButtons}
  />
);

SlideOverStory.storyName = 'Slide Over Example';

export const SlideInStory = () => (
  <Interactive
    direction={select('direction', ['start', 'end'], 'start')}
    slideIn
    icons={iconButtons}
  />
);

SlideInStory.storyName = 'Slide In Example';

export const SlideInlineStory = () => (
  <Interactive
    direction={select('direction', ['start', 'end'], 'start')}
    inline
    showDrawer={boolean('Show drawer', false)}
  />
);

SlideInlineStory.storyName = 'Slide Inline Example';
