import React, { Component } from 'react';
import { text, select, boolean } from '@storybook/addon-knobs';
import { spacing06 } from '@carbon/layout';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import ListCard from './ListCard';

const data = [
  {
    id: 'row-1',
    value: 'Row content 1',
    link: 'https://internetofthings.ibmcloud.com/',
  },
  {
    id: 'row-2',
    value: 'Row content 2',
    link: 'https://internetofthings.ibmcloud.com/',
  },
  { id: 'row-3', value: 'Row content 3' },
  {
    id: 'row-4',
    value: 'Row content 4',
    link: 'https://internetofthings.ibmcloud.com/',
    extraContent: (
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
  {
    id: 'row-9',
    value: 'Row content 9',
    link: 'https://internetofthings.ibmcloud.com/',
  },
  {
    id: 'row-10',
    value: 'Row content 10',
    link: 'https://internetofthings.ibmcloud.com/',
  },
  { id: 'row-11', value: 'Row content 11' },
  {
    id: 'row-12',
    value: 'Row content 12',
    link: 'https://internetofthings.ibmcloud.com/',
    extraContent: (
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

  fetchMoreListItems = () => {
    setTimeout(
      // eslint-disable-next-line func-names
      function () {
        this.setState((prevState) => {
          return {
            isLoading: false,
            data: [...prevState.data, ...data2],
            hasMoreData: false,
          };
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
      <div
        style={{
          width: `${getCardMinSize('lg', size).x}px`,
          margin: spacing06,
        }}
      >
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

// eslint-disable-next-line react/no-multi-comp
class ListCardExtraContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      hasMoreData: true,
    };
  }

  render = () => {
    const { isLoading, hasMoreData } = this.state;
    const { size } = this.props;

    return (
      <div
        style={{
          width: `${getCardMinSize('lg', size).x}px`,
          margin: spacing06,
        }}
      >
        <ListCard
          {...this.props}
          data={[
            {
              id: 'row-9',
              value: 'Explore entity metrics in the data lake',
              link: 'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-explore.html',
              extraContent: (
                <span>
                  View your device data in the entity view of the main Watson IoT Platform
                  dashboard. If your plan includes Watson IoT Platform Analytics, the data is stored
                  in the data lake for later retrieval and processing.
                </span>
              ),
            },
            {
              id: 'row-10',
              value: 'Perform simple calculations on your entity metrics',
              link: 'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-calculate.html',
              extraContent: (
                <span>
                  Process your entity metrics by running simple or complex calculations to create
                  calculated metrics.
                </span>
              ),
            },
            {
              id: 'row-11',
              value: 'View entity metrics in a monitoring dashboard',
              link: 'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-monitor.html',
              extraContent: (
                <span>
                  Visualize your entity metrics in monitoring dashboards to get an overview of your
                  data.
                </span>
              ),
            },
          ]}
          hasMoreData={hasMoreData}
          isLoading={isLoading}
          loadData={() => {}}
        />
      </div>
    );
  };
}

// eslint-disable-next-line react/no-multi-comp
class ListCardExtraContentLong extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      hasMoreData: true,
    };
  }

  render = () => {
    const { isLoading, hasMoreData } = this.state;
    const { size } = this.props;

    return (
      <div
        style={{
          width: `${getCardMinSize('lg', size).x}px`,
          margin: spacing06,
        }}
      >
        <ListCard
          {...this.props}
          data={[
            {
              id: 'row-9',
              value: 'Explore entity metrics in the data lake',
              link: 'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-explore.html',
              extraContent: (
                <span>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid cumque in quam
                  qui ut vero facilis autem. Laudantium enim accusantium facere nemo aspernatur
                  repudiandae at, incidunt adipisci consequuntur ut, non, sint delectus labore id
                  quaerat debitis quia veritatis autem aliquid voluptates? Quam perspiciatis aperiam
                  perferendis incidunt rerum magni ratione iusto porro natus cumque omnis velit
                  dolores, ipsa veniam! Maiores libero quam nam fugiat, voluptatum fuga ex
                  architecto, enim similique quod, voluptates qui voluptas blanditiis tempora dolor
                  assumenda quos numquam temporibus.
                </span>
              ),
            },
            {
              id: 'row-10',
              value: 'Perform simple calculations on your entity metrics',
              link: 'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-calculate.html',
              extraContent: (
                <span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus id nulla porro
                  temporibus excepturi cupiditate rem voluptatibus aspernatur minima quasi autem
                  labore, quaerat facilis perferendis quas iste quae, voluptatem, possimus dicta
                  fugit. Voluptatem similique odio necessitatibus delectus non itaque fugiat, saepe
                  consectetur impedit, harum cupiditate velit repellendus assumenda, vel quasi
                  eveniet at vero voluptate asperiores maxime quas. Error, nemo, nobis recusandae
                  totam quod provident pariatur ipsum exercitationem nihil, doloremque consequuntur.
                  Possimus assumenda odit nesciunt veritatis, maxime quae. Hic unde quasi quas
                  recusandae obcaecati repellendus officia aperiam sunt, aut, minus quod vero
                  provident, velit blanditiis necessitatibus laudantium nihil tempore nostrum
                  impedit porro enim. Enim ipsam quasi iure perferendis repellat saepe vero,
                  voluptate tenetur consequatur necessitatibus excepturi accusamus asperiores nam
                  hic sapiente!
                </span>
              ),
            },
            {
              id: 'row-11',
              value: 'View entity metrics in a monitoring dashboard',
              link: 'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-monitor.html',
              extraContent: (
                <span>
                  Visualize your entity metrics in monitoring dashboards to get an overview of your
                  data.
                </span>
              ),
            },
          ]}
          hasMoreData={hasMoreData}
          isLoading={isLoading}
          loadData={() => {}}
        />
      </div>
    );
  };
}

export default {
  title: '1 - Watson IoT/Card/ListCard',

  parameters: {
    component: ListCard,
  },
};

export const Basic = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);

  return (
    <ListCardSimple
      id="ListCard"
      title={text('Text', 'Simple List with Icon')}
      size={size}
      isLoading={boolean('isLoading', false)}
    />
  );
};

Basic.storyName = 'basic';

export const WithExtraContent = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);

  return (
    <ListCardExtraContent
      id="ListCard"
      title={text('Title', 'List with extra content')}
      size={size}
    />
  );
};

WithExtraContent.storyName = 'with extra content';

export const WithExtraLongContent = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);

  return (
    <ListCardExtraContentLong
      id="ListCard"
      title={text('Title', 'List with extra long content')}
      size={size}
    />
  );
};

WithExtraLongContent.storyName = 'with extra long content';

export const Empty = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);

  return (
    <div style={{ width: text('cardWidth', `250px`), margin: 20 }}>
      <ListCard
        id="ListCard"
        title={text('Text', 'Simple List with Icon')}
        size={size}
        data={[]}
        loadData={() => {}}
      />
    </div>
  );
};

Empty.storyName = 'empty';
