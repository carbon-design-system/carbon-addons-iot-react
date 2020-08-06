import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { mockActions } from '../Table.test.helpers';

import AsyncTable from './AsyncTable';
import MockApiClient from './MockApiClient';

const apiClient = new MockApiClient(100, 500);

describe('Async Table', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('changes filter properties', () => {
    render(<AsyncTable fetchData={apiClient.getData} actions={mockActions} />);
    jest.advanceTimersByTime(500);
    jest.runAllTimers();
    expect(screen.getByRole('button', { name: /First Name/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Last Name/i })).toBeDefined();
  });
  // fake timers in jest
  // initialize table and fast forward time
  // once rendered, click various parts of table

  it('switches pages using pagination', async () => {
    const asyncTable = <AsyncTable fetchData={apiClient.getData} actions={mockActions} />;
    render(asyncTable);
    jest.advanceTimersByTime(500);
    expect(setTimeout).toHaveBeenCalled();
    const nextPageButton = await waitFor(() => screen.findByRole('button', { name: 'Next page' }));
    expect(nextPageButton).toBeTruthy();
    fireEvent.click(nextPageButton);
    // expect(asyncTable.props.actions.pagination.onChangePage).toBeCalled();
  });
});
