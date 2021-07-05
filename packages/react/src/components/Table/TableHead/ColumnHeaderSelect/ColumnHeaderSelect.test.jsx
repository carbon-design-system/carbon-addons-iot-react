import React from 'react';
import { render } from '@testing-library/react';

import { UnconnectedColumnHeaderSelect } from './ColumnHeaderSelect';

describe('ColumnHeaderSelect', () => {
  it('should not connect DnD targets if disabled', () => {
    const handleClick = jest.fn();
    const connectDragSource = jest.fn();
    const connectDropTarget = jest.fn();
    render(
      <UnconnectedColumnHeaderSelect
        index={0}
        isOver={false}
        moveItem={jest.fn()}
        columnId="test"
        isDisabled
        onClick={handleClick}
        connectDragSource={connectDragSource}
        connectDropTarget={connectDropTarget}
      />
    );
    expect(connectDragSource).not.toBeCalled();
    expect(connectDropTarget).not.toBeCalled();
  });
});
