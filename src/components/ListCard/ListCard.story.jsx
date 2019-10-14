import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import ListCard from './ListCard';

const data = [
  { id: 'row-1', value: 'Row content 1', link: 'https://internetofthings.ibmcloud.com/' },
  { id: 'row-2', value: 'Row content 2', link: 'https://internetofthings.ibmcloud.com/' },
  { id: 'row-3', value: 'Row content 3' },
  {
    id: 'row-4',
    value: 'Row content 4',
    link: 'https://internetofthings.ibmcloud.com/',
    rightContent: (
      <svg height="10" width="30">
        <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="red" />
      </svg>
    ),
  },
  { id: 'row-5', value: 'Row content 5' },
  { id: 'row-6', value: 'Row content 6' },
  { id: 'row-7', value: 'Row content 7' },
  { id: 'row-8', value: 'Row content 8' },
];

const data2 = [
  { id: 'row-9', value: 'Row content 9', link: 'https://internetofthings.ibmcloud.com/' },
  { id: 'row-10', value: 'Row content 10', link: 'https://internetofthings.ibmcloud.com/' },
  { id: 'row-11', value: 'Row content 11' },
  {
    id: 'row-12',
    value: 'Row content 12',
    link: 'https://internetofthings.ibmcloud.com/',
    rightContent: (
      <svg height="10" width="30">
        <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="red" />
      </svg>
    ),
  },
  { id: 'row-13', value: 'Row content 13' },
  { id: 'row-14', value: 'Row content 14' },
  { id: 'row-15', value: 'Row content 15' },
  { id: 'row-16', value: 'Row content 16' },
];

class ListCardSimple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
      isLoading: false,
      hasMoreData: true,
    };
  }
  /* eslint-disable */
  fetchMoreListItems = () => {
    setTimeout(
      function() {
        this.setState(prevState => {
          return { isLoading: false, data: [...prevState.data, ...data2], hasMoreData: false };
        });
      }.bind(this),
      2000
    );
  };
  /* eslint-enable */

  render = () => {
    const { data, isLoading, hasMoreData } = this.state;
    const { size } = this.props;

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ListCard
          {...this.props}
          data={data}
          hasMoreData={hasMoreData}
          isLoading={isLoading}
          loadData={() => {
            this.fetchMoreListItems();
            return this.setState({ isLoading: true });
          }}
        />
      </div>
    );
  };
}

storiesOf('Watson IoT Experimental|ListCard', module).add('basic', () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);

  return <ListCardSimple id="ListCard" title={text('Text', 'Simple List with Icon')} size={size} />;
});
