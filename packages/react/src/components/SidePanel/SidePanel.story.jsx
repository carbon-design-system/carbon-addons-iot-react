import React, { useState } from 'react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Edit16, Information16, SendAlt16 } from '@carbon/icons-react';

import Button from '../Button/Button';
import Dropdown from '../Dropdown/Dropdown';

import SidePanel from './SidePanel';
import SidePanelReadMe from './SidePanel.mdx';

const primaryButton = (
  <Button
    testId="primaryButton"
    kind="primary"
    size="xl"
    onClick={() => {
      action('Initiate clicked');
    }}
  >
    Initiate
  </Button>
);

const secondaryButton = (
  <Button
    testId="secondaryButton"
    kind="secondary"
    size="xl"
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
  <Button
    id="icon1"
    hasIconOnly
    kind="ghost"
    renderIcon={Edit16}
    onClick={action('clicked')}
    size="small"
  />,
  <Button
    id="icon2"
    hasIconOnly
    kind="ghost"
    renderIcon={Information16}
    onClick={action('clicked')}
    size="small"
  />,
  <Button
    id="icon3"
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
  <div
    style={{
      'padding-bottom': '2rem',
    }}
  >
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a dapibus nulla. Fusce et enim
      et elit rutrum interdum quis eu nulla. Nulla neque neque, condimentum eget pellentesque sit
      amet, volutpat ac enim. Etiam id magna vel dolor condimentum imperdiet. Vivamus eu
      pellentesque turpis, eget ultricies lectus. Vestibulum sodales massa non lobortis interdum.
      Sed cursus sem in dolor tempus tempus. Pellentesque et nisi vel erat egestas ultricies. Etiam
      id risus nec mi laoreet suscipit. Phasellus porttitor accumsan placerat. Donec auctor nunc id
      erat congue, tincidunt viverra diam feugiat. Donec sit amet quam vel augue auctor posuere.
      Nunc maximus volutpat nulla vel vehicula. Praesent bibendum nulla at erat facilisis sodales.
      Aenean aliquet dui vel iaculis tincidunt. Praesent suscipit ultrices mi eget finibus. Mauris
      vehicula ultricies auctor. Nam vestibulum iaculis lectus, nec sodales metus lobortis non.
      Suspendisse nulla est, consectetur non convallis et, tristique eu risus. Sed ut tortor et
      nulla tempor vulputate et vel ligula. Curabitur egestas lorem ut mi vestibulum porttitor.
      Fusce eleifend vehicula semper. Donec luctus neque quam, et blandit eros accumsan at.
    </p>
    {dropdown}
  </div>
);

const Interactive = ({
  direction,
  isRail,
  showCloseButton,
  icons,
  condensed,
  variation,
  showPrimaryandSecondaryButton,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        'flex-direction': direction === 'start' ? 'row' : 'row-reverse',
        margin: '1rem',
        height: '100%',
      }}
    >
      <SidePanel
        open={open}
        slideOver={variation === 'slideOver'}
        inline={variation === 'inline'}
        direction={direction}
        title="My title, volutpat ac enim. Etiam id magna vel dolor condimentum imperdiet"
        icons={icons}
        primaryButton={showPrimaryandSecondaryButton ? primaryButton : null}
        secondaryButton={showPrimaryandSecondaryButton ? secondaryButton : null}
        isRail={isRail}
        showCloseButton={showCloseButton}
        onClose={() => setOpen(!open)}
        condensed={condensed}
      >
        {content}
      </SidePanel>
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
        {dropdown}
        <Button
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open ? 'Close' : 'Open'}
        </Button>
      </div>
    </div>
  );
};

export default {
  title: '1 - Watson IoT/SidePanel',
  decorators: [withKnobs],

  parameters: {
    component: SidePanel,
    docs: {
      page: SidePanelReadMe,
    },
  },
};

export const Default = () => (
  <Interactive
    direction={select('Direction', ['start', 'end'], 'start')}
    isRail={boolean('Show Drawer (only works with inline)', false)}
    showCloseButton={boolean('Show close button (only works with slideOver)', false)}
    icons={boolean('Show icons', false) ? iconButtons : undefined}
    condensed={boolean('Condensed', false)}
    variation={select(
      'Slide variation (Default is slideIn)',
      ['slideOver', 'slideIn', 'inline'],
      'slideIn'
    )}
    showPrimaryandSecondaryButton={boolean('Show Primary and Secondary button (optional)', true)}
  />
);

Default.storyName = 'Default';
