// import React from 'react';
// import { render, screen, userEvent, fireEvent, waitFor } from '@testing-library/react';

// import Button from '../Button';

import { backwardArraySwap, forwardArraySwap, moveToSecondIndex } from './ListSpinner';

describe('ListSpinner', () => {
  // const onClick = jest.fn();
  // const onChange = jest.fn();
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });
  // const listItems = Array.from(Array(12)).map((el, i) => {
  //   const index = i + 1 < 10 ? `0${i + 1}` : i + 1;
  //   return (
  //     <li id={`hour-${index}`}>
  //       <Button id={`hour-${index}-button`} kind="ghost">
  //         {index}
  //       </Button>
  //     </li>
  //   );
  // });
  // it('is selectable with testId', () => {
  //   render(<ListSpinner listItems={listItems} testId="my-list" />);
  //   expect(screen.getByTestId('my-list')).toBeTruthy();
  //   expect(screen.getByTestId('my-list-prev-btn')).toBeTruthy();
  //   expect(screen.getByTestId('my-list-next-btn')).toBeTruthy();
  //   expect(screen.getByTestId('my-list-list')).toBeTruthy();
  //   expect(screen.getAllByTestId('my-list-list-item')).toBeTruthy();
  // });

  // it('scrolls down when you hit previous button', async () => {
  //   render(
  //     <ListSpinner
  //       listItems={listItems}
  //       onClick={onClick}
  //       defaultSelectedId="hour-10"
  //       testId="my-list"
  //     />
  //   );
  //   // screen.debug();
  //   // fireEvent.click(screen.getByTestId('my-list-prev-btn'));
  //   userEvent.click(screen.getByTestId('my-list-prev-btn'));
  //   expect(1).toEqual(1);
  //   await waitFor(() => expect(onChange).toHaveBeenCalledWith('hour-09'));
  // });

  it('will return a new array with the first index moved to the end', () => {
    const list = Array.from(Array(12)).map((el, i) => i);
    const newValue = backwardArraySwap(list);
    expect(newValue.toString()).toEqual('1,2,3,4,5,6,7,8,9,10,11,0');
  });

  it('will return a new array with the last index moved to the start', () => {
    const list = Array.from(Array(12)).map((el, i) => i);
    const newValue = forwardArraySwap(list);
    expect(newValue.toString()).toEqual('11,0,1,2,3,4,5,6,7,8,9,10');
  });

  it.only('shifts so that selected index moves to the second index location', () => {
    const list = Array.from(Array(12)).map((el, i) => i);
    let newValue = moveToSecondIndex(list, 6);
    expect(newValue.toString()).toEqual('4,5,6,7,8,9,10,11,0,1,2,3');
    newValue = moveToSecondIndex(newValue, 4);
    expect(newValue.toString()).toEqual('6,7,8,9,10,11,0,1,2,3,4,5');
    newValue = moveToSecondIndex(list, 11);
    expect(newValue.toString()).toEqual('9,10,11,0,1,2,3,4,5,6,7,8');
  });
});
