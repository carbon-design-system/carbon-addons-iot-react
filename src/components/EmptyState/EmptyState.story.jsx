import React from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import { DashboardIcon as CustomIcon } from '../../icons/components';

import EmptyState from './EmptyState';

const commonProps = {
  action: {
    label: text('action label', 'Optional action'),
    onClick: action('button action'),
  },
  secondaryAction: {
    label: text('link label', 'Optional link'),
    onClick: action('link action'),
  },
};

export default {
  title: 'Watson IoT/EmptyState',

  parameters: {
    component: EmptyState,

    info: `
    Empty states occur in an app when no data is available to be displayed to the user. An empty state most commonly occurs the first time that a user interacts with a product or page, but is also used when data was deleted or is not available.
    
    **Types of empty states**

    Following strings can be passed to the \`image\` prop to change the image of the empty state:
    - error
    - error404
    - empty
    - no-result
    - not-authorized
    - success

    Alternatively, a custom component can be passed that will be rendered in place of the image.

    Please note that if no \`image\` prop is passed, no image will be shown.

    **Actions**

    \`EmptyState\` can have two optional actions: \`action\` and \`secondaryAction\`. 
    
    \`action\` can be either a button or a custom component and should be used to let the user have an option to "overcome" the empty state.

    \`secondaryAction\` usually is a link that could for example reference documentation for further reading as to why the empty state occured. However, it is also possible to pass a custom compent as well.

    The prop format for both actions is as follows:
    \`\`\`
    {
      label: 'actionLabel',
      onClick: () => {},
    }
    \`\`\`

    For more information, please visit [Carbon empty states](https://www.carbondesignsystem.com/patterns/empty-states-pattern/)
    `,
  },
};

export const NoImage = () => (
  <EmptyState
    title={text('title', 'This is an empty state without an image')}
    body={text(
      'body',
      'You can create empty states without images, although it is recommended to always use images.'
    )}
    {...commonProps}
  />
);

NoImage.story = {
  name: 'Without image',
};

export const FirstTimeUse = () => (
  <EmptyState
    image={text('image', 'empty')}
    title={text('title', 'You don’t have any <variable> yet')}
    body={text(
      'body',
      'Optional extra sentence or sentences to describe the resource and how to create it or the action a first-time user needs to take.'
    )}
    {...commonProps}
  />
);

FirstTimeUse.story = {
  name: 'First-time use',
};

export const NoSearchResult = () => (
  <EmptyState
    image={text('image', 'no-result')}
    title={text('title', 'No results found')}
    body={text(
      'body',
      'Subtext is optional because this user experience is common and the user knows how to return to the search mechanism. Use an optional extra sentence or sentences to explain how to adjust search parameters or prompt user action.'
    )}
    {...commonProps}
  />
);

NoSearchResult.story = {
  name: 'No search results found',
};

export const Success = () => (
  <EmptyState
    image={text('image', 'success')}
    title={text('title', 'Success')}
    body={text(
      'body',
      'Optional extra sentence or sentences to describe the process or procedure that completed successfully. If needed, describe the next step that the user needs to take.'
    )}
    {...commonProps}
  />
);

Success.story = {
  name: 'Success',
};

export const Page404 = () => (
  <EmptyState
    image={text('image', 'error404')}
    title={text('title', 'Uh oh. Something’s not right.')}
    body={text(
      'body',
      'Optional extra sentence or sentences to describe further details about the error and, if applicable, how the user can fix it.'
    )}
    action={{
      label: 'Try again',
      onClick: action('button action'),
    }}
  />
);

Page404.story = {
  name: '404 error',
};

export const DataMissing = () => (
  <EmptyState
    image={text('image', 'empty')}
    title={text('title', 'No [variable] to show')}
    body={text(
      'body',
      'Optional extra sentence or sentences to describe the data and how to create it, the action a user needs to take, or to describe why the data is missing. For example, in a scenario in which no errors occurred, the optional text might describe why no errors are displayed.'
    )}
    {...commonProps}
  />
);

DataMissing.story = {
  name: 'Data missing',
};

export const DataError = () => (
  <EmptyState
    image={text('image', 'error')}
    title={text('title', 'Oops! We’re having trouble [problem]')}
    body={text(
      'body',
      'Optional extra sentence or sentences to describe further details about the error and, if applicable, how the user can fix it. Can provide information about who to contact if the error persists.'
    )}
    {...commonProps}
    action={{
      label: 'Try again',
      onClick: action('button action'),
    }}
  />
);

DataError.story = {
  name: 'Error',
};

export const NotAuthorized = () => (
  <EmptyState
    image={text('image', 'not-authorized')}
    title={text('title', 'You don’t have permission to [variable]')}
    body={text(
      'body',
      'Optional extra sentence or sentences to describe any action that the user can take or who to contact regarding permissions.'
    )}
    {...commonProps}
  />
);

NotAuthorized.story = {
  name: 'Not authorized',
};

export const NotConfigured = () => (
  <EmptyState
    image={text('image', 'empty')}
    title={text('title', 'Configure your [variable]')}
    body={text(
      'body',
      'Optional extra sentence or sentences to describe the [variable] and how to configure it or set it up.'
    )}
    {...commonProps}
  />
);

NotConfigured.story = {
  name: 'Not configured',
};

export const Custom = () => (
  <EmptyState
    image={CustomIcon}
    title={text('title', 'Custom empty state')}
    body={text(
      'body',
      'Optional extra sentence or sentences to describe the [variable] and how to configure it or set it up.'
    )}
    {...commonProps}
  />
);

Custom.story = {
  name: 'Custom',
};
