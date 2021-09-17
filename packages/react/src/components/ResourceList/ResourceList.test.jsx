import React from 'react';
import Edit16 from '@carbon/icons-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { spacing02 } from '@carbon/layout';

import { settings } from '../../constants/Settings';

import ResourceList from './ResourceList';

const { prefix } = settings;
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

describe('ResourceList', () => {
  it('should be selectable by testId', () => {
    const actionClick = jest.fn();
    render(
      <ResourceList
        design="normal"
        data={resourceData}
        customAction={{
          onClick: actionClick,
          label: 'Configure',
          icon: Edit16,
        }}
        testId="resource_list"
      />
    );
    expect(screen.getByTestId('resource_list')).toBeDefined();
    expect(screen.getByTestId('resource_list-row-row-0')).toBeDefined();
    expect(screen.getByTestId('resource_list-custom-action-row-0')).toBeDefined();
  });

  // handle click function test
  it('onRowClick', () => {
    const onRowClick = jest.fn();
    render(
      <ResourceList
        design="normal"
        data={resourceData}
        onRowClick={onRowClick}
        currentItemId="row-2"
      />
    );

    userEvent.click(screen.getByLabelText('Item A'));
    expect(onRowClick).toHaveBeenCalledWith('row-0');
  });

  it('customAction', () => {
    const actionClick = jest.fn();
    render(
      <ResourceList
        design="normal"
        data={resourceData}
        customAction={{
          onClick: actionClick,
          label: 'Configure',
          icon: Edit16,
        }}
      />
    );
    userEvent.click(screen.getAllByRole('button', { name: 'Configure' })[0]);
    expect(actionClick).toHaveBeenCalledTimes(1);
  });
  it('extraContent', () => {
    render(
      <ResourceList
        design="normal"
        data={resourceData}
        currentItemId="row-2"
        extraContent={resourceData.map((i) => i.id)}
      />
    );
    expect(screen.getByText('row-0')).toBeVisible();
  });

  it('should set onClick to null when no onRowClick passed', () => {
    render(
      <ResourceList
        design="normal"
        data={resourceData}
        currentItemId="row-2"
        extraContent={resourceData.map((i) => i.id)}
        onRowClick={undefined}
      />
    );

    userEvent.click(screen.getByText('Item A'));
    expect(screen.getByLabelText('Item A')).not.toHaveAttribute('onClick');
  });

  it('should render inline', () => {
    render(<ResourceList design="inline" data={resourceData} />);

    const row = screen.getByText('Item A');
    expect(row).toBeVisible();
    expect(row.parentNode).toHaveClass(`${prefix}--structured-list-td`);
    expect(row.nextSibling).toHaveClass(`${prefix}--structured-list-td`);
    expect(row.nextSibling).toHaveStyleRule('font-weight', 'normal');
    expect(row.nextSibling).toHaveStyleRule('padding-left', '0px !important');
    expect(row.nextSibling).toHaveStyleRule('padding-top', `${spacing02} !important`);
  });
});
