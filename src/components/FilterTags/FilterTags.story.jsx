import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';

import { Tag, Button } from '../../index';

import FilterTags from './FilterTags';

const tagData = [
  {
    id: 'tag-one',
    text: 'Hello World',
    onClose: () => console.log('closed tag-one'),
    type: 'red',
  },
  {
    id: 'tag-two',
    text: 'Hello Space',
    onClose: () => console.log('closed tag-two'),
    type: 'blue',
  },
  {
    id: 'tag-three',
    text: 'Hello Sun',
    onClose: () => console.log('closed tag-three'),
    type: 'red',
  },
  {
    id: 'tag-four',
    text: 'Hello Daughter',
    onClose: () => console.log('closed tag-four'),
    type: 'red',
  },
];
const StatefulFilterTags = ({ tags }) => {
  const index = useRef(0);
  const [renderedTags, setRenderedTags] = useState(tags);
  const handleOnClose = id => {
    setRenderedTags(renderedTags.filter(x => x.id !== id));
    tags.filter(x => x.id === id)[0].onClose();
  };
  const handleOnClick = () => {
    const newTag = {
      id: `tag-${index.current}`,
      text: `tag-${index.current}`,
      onClose: () => console.log(`Close ${index.current}`),
      type: 'red',
    };
    index.current += 1;
    setRenderedTags([newTag, ...renderedTags]);
  };

  return (
    <div style={{ display: 'flex', overflow: 'hidden' }}>
      <Button onClick={() => handleOnClick()} style={{ marginBottom: '1rem' }}>
        Add tag
      </Button>
      <FilterTags>
        {renderedTags.map(tag => (
          <Tag
            key={`tag-${tag.id}`}
            filter
            type={tag.type}
            title="Clear Filter"
            style={{ marginRight: '1rem' }}
            onClose={() => handleOnClose(tag.id)}
          >
            {tag.text}
          </Tag>
        ))}
      </FilterTags>
    </div>
  );
};

storiesOf('Watson IoT Experimental/FilterTags', module).add('Default Example', () => (
  <StatefulFilterTags tags={tagData} />
  // <FilterTags>
  //   <Tag filter title="Clear Filter" style={{ marginRight: '1rem' }}>
  //     Hello world
  //   </Tag>
  //   <Tag filter title="Clear Filter" style={{ marginRight: '1rem' }}>
  //     Hello Space
  //   </Tag>
  //   <Tag filter title="Clear Filter" style={{ marginRight: '1rem' }}>
  //     Hello Sun
  //   </Tag>
  //   <Tag filter title="Clear Filter">
  //     Hello Daughter
  //   </Tag>
  // </FilterTags>
));
