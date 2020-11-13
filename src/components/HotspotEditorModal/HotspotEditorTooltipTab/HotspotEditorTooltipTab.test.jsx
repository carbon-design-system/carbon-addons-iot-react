import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { red50, blue50, green50 } from '@carbon/colors';
import {
  InformationSquareFilled24,
  InformationFilled24,
} from '@carbon/icons-react';

import HotspotEditorTooltipTab from './HotspotEditorTooltipTab';

describe('HotspotEditorTooltipTab', () => {
  const getColors = () => [
    { carbonColor: red50, name: 'red' },
    { carbonColor: green50, name: 'green' },
    { carbonColor: blue50, name: 'blue' },
  ];

  const getIcons = () => [
    {
      id: 'InformationSquareFilled24',
      icon: InformationSquareFilled24,
      text: 'Information square filled',
    },
    {
      id: 'InformationFilled24',
      icon: InformationFilled24,
      text: 'Information filled',
    },
  ];

  it('renders info message alone', () => {
    const infoMessage = 'My info message';
    render(
      <HotspotEditorTooltipTab
        infoMessage={infoMessage}
        hotspotIcons={getIcons()}
        onChange={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText(infoMessage)).toBeVisible();
    expect(screen.queryAllByText('Title')).toHaveLength(0);
    expect(screen.queryAllByText('Description')).toHaveLength(0);
    expect(screen.queryAllByText('Icon')).toHaveLength(0);
    expect(screen.queryAllByText('Color')).toHaveLength(0);
  });

  it('calls onChange as title and description are typed into', () => {
    const onChange = jest.fn();
    render(
      <HotspotEditorTooltipTab
        hotspotIcons={getIcons()}
        onChange={onChange}
        onDelete={() => {}}
      />
    );

    userEvent.type(screen.getByTitle('Enter title for the tooltip'), 'test');
    expect(onChange).toHaveBeenCalledWith({ title: 't' });
    expect(onChange).toHaveBeenCalledWith({ title: 'e' });
    expect(onChange).toHaveBeenCalledWith({ title: 's' });
    expect(onChange).toHaveBeenCalledWith({ title: 't' });
    expect(onChange).toHaveBeenCalledTimes(4);

    userEvent.type(screen.getByLabelText('Description'), 'ok');
    expect(onChange).toHaveBeenCalledWith({ description: 'o' });
    expect(onChange).toHaveBeenCalledWith({ description: 'k' });
    expect(onChange).toHaveBeenCalledTimes(6);
  });

  it('calls onChange when color and icon dropdowns are changed ', () => {
    const onChange = jest.fn();
    render(
      <HotspotEditorTooltipTab
        hotspotIconFillColors={getColors()}
        hotspotIcons={getIcons()}
        onChange={onChange}
        onDelete={() => {}}
      />
    );

    userEvent.click(screen.getByText('Select a color'));
    const firstItem = screen.getAllByRole('option')[0];
    userEvent.click(firstItem);
    expect(onChange).toHaveBeenCalledWith({
      color: getColors()[0],
    });

    userEvent.click(screen.getByText('Select an Icon'));
    const firstItemIcon = screen.getAllByRole('option')[0];
    userEvent.click(firstItemIcon);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: expect.objectContaining({ id: getIcons()[0].id }),
      })
    );
  });

  it('renders preset values ', () => {
    const description = 'My description';
    const title = 'My Title';
    render(
      <HotspotEditorTooltipTab
        formValues={{
          color: getColors()[1],
          description,
          icon: getIcons()[1],
          title,
        }}
        hotspotIconFillColors={getColors()}
        hotspotIcons={getIcons()}
        onChange={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText(description)).toBeVisible();
    expect(screen.getByDisplayValue(title)).toBeVisible();
    expect(screen.getByText(getColors()[1].name)).toBeVisible();
    expect(screen.getByText(getIcons()[1].text)).toBeVisible();
  });

  it('calls onDelete when Delete hotspot button is clicked', () => {
    const onDelete = jest.fn();
    render(
      <HotspotEditorTooltipTab
        hotspotIconFillColors={getColors()}
        hotspotIcons={getIcons()}
        onChange={() => {}}
        onDelete={onDelete}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'Delete hotspot' }));
    expect(onDelete).toHaveBeenCalled();
  });
});
