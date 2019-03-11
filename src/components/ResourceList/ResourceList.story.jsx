import React, { Component } from 'react';
import { select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import ResourceList from './ResourceList';

const resourceData = [
  {
    id: 'row-0',
    title: 'Item A',
    description:
      'Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.',
  },
  {
    id: 'row-1',
    title: 'Item B',
    description:
      'Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.',
  },
  {
    id: 'row-2',
    title: 'Item C',
    description:
      'Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed. Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.Lorem ipsun dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed.',
  },
];

class ResourceListSimple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItemId: '',
    };
  }

  render = () => {
    const { currentItemId } = this.state;

    return (
      <ResourceList
        {...this.props}
        design={select('Resource list design', ['normal', 'inline'], 'normal')}
        data={resourceData}
        currentItemId={currentItemId}
        onRowClick={itemId => this.setState({ currentItemId: itemId })}
      />
    );
  };
}

/* Resource List simple */
const ResourceListCustomActions = () => (
  <ResourceList
    design={select('Resource list design', ['normal', 'inline'], 'normal')}
    data={resourceData}
    customAction={{
      action: () => window.alert('we will performn an action'),
      actionLabel: 'Configure ',
    }}
    currentItemId="row-0"
  />
);

storiesOf('Resource List', module)
  .add('Simple', () => <ResourceListSimple />)
  .add('Extra content', () => <ResourceListSimple extraContent={<div> test content</div>} />)
  .add('Action', () => <ResourceListCustomActions />);
