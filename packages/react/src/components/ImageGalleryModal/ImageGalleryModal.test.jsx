import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { omit } from 'lodash-es';

import { settings } from '../../constants/Settings';

import ImageGalleryModal from './ImageGalleryModal';

const { iotPrefix } = settings;

const getTestContent = () => [
  {
    id: 'a',
    src: 'path/to/image-a.jpg',
    alt: 'A alt',
    title: 'Image a title',
  },
  {
    id: 'b',
    src: 'path/to/image-b.jpg',
    alt: 'b alt',
  },
  {
    id: 'c',
    src: 'path/to/image-c.png',
    alt: 'c alt',
  },
];

const titleClass = `${iotPrefix}--image-tile__title`;
const unselectedClass = `${iotPrefix}--icon-switch--unselected`;

const getActions = () => ({
  onSubmit: () => {},
  onClose: () => {},
});

describe('ImageGalleryModal', () => {
  it('should be selectable by testId', () => {
    const content = getTestContent();
    const testId = 'image_gallery_modal';
    render(
      <ImageGalleryModal content={content} {...getActions()} onDelete={jest.fn()} testId={testId} />
    );
    expect(screen.getByTestId(testId)).toBeDefined();
    expect(screen.getByTestId(`${testId}-a-delete-button`)).toBeDefined();
    expect(screen.getByTestId(`${testId}-grid-switch`)).toBeDefined();
    expect(screen.getByTestId(`${testId}-list-switch`)).toBeDefined();
    expect(screen.getByTestId(`${testId}-search-input`)).toBeDefined();
    userEvent.click(screen.getByTestId(`${testId}-a-delete-button`));
    expect(screen.getByTestId(`${testId}-warning-modal`)).toBeDefined();
  });

  it('renders image title prop if present', () => {
    const content = getTestContent();
    render(<ImageGalleryModal content={content} {...getActions()} />);
    const titleElement = screen.getByText(content[0].title);
    expect(titleElement.parentElement).toHaveClass(titleClass);
    expect(titleElement).toBeVisible();
  });

  it('renders image filename from src prop when no title prop', () => {
    render(<ImageGalleryModal content={getTestContent()} {...getActions()} />);

    const titleElement = screen.getByText('image-b');
    expect(titleElement.parentElement).toHaveClass(titleClass);
    expect(titleElement).toBeVisible();

    const titleElement2 = screen.getByText('image-c');
    expect(titleElement2.parentElement).toHaveClass(titleClass);
    expect(titleElement2).toBeVisible();
  });

  it('renders image using src', () => {
    const content = getTestContent();
    render(<ImageGalleryModal content={content} {...getActions()} />);
    const imageElement = screen.getByAltText(content[0].alt);
    expect(imageElement).toHaveAttribute('src', content[0].src);
  });

  it('filters images based on search input', () => {
    const content = getTestContent();
    render(<ImageGalleryModal content={content} {...getActions()} />);
    expect(screen.getByAltText(content[0].alt)).toBeVisible();
    expect(screen.getByAltText(content[1].alt)).toBeVisible();
    expect(screen.getByAltText(content[2].alt)).toBeVisible();

    userEvent.type(screen.getByRole('searchbox'), 'b');
    expect(screen.queryAllByAltText(content[0].alt)).toHaveLength(0);
    expect(screen.getByAltText(content[1].alt)).toBeVisible();
    expect(screen.queryAllByAltText(content[2].alt)).toHaveLength(0);
  });

  it('can filter on value of searchProperty', () => {
    const content = getTestContent();
    render(<ImageGalleryModal searchProperty="title" content={content} {...getActions()} />);
    expect(screen.getByAltText(content[0].alt)).toBeVisible();
    expect(screen.getByAltText(content[1].alt)).toBeVisible();
    expect(screen.getByAltText(content[2].alt)).toBeVisible();

    userEvent.type(screen.getByRole('searchbox'), 'image A title');
    expect(screen.getByAltText(content[0].alt)).toBeVisible();
    expect(screen.queryAllByAltText(content[1].alt)).toHaveLength(0);
    expect(screen.queryAllByAltText(content[2].alt)).toHaveLength(0);
  });

  it('handles cutom default view mode', () => {
    render(<ImageGalleryModal defaultView="list" content={getTestContent()} {...getActions()} />);
    const listButton = screen.getByText('List').parentElement;
    expect(listButton).not.toHaveClass(unselectedClass);
  });

  it('toggles view modes', () => {
    const wideTileClass = `${iotPrefix}--image-tile--wide`;
    render(<ImageGalleryModal content={getTestContent()} {...getActions()} />);

    const listButton = screen.getByText('List').parentElement;
    expect(listButton).toHaveClass(unselectedClass);
    expect(screen.getByText('image-b').closest('label')).not.toHaveClass(wideTileClass);

    userEvent.click(listButton);
    expect(screen.getByText('List').parentElement).not.toHaveClass(unselectedClass);
    expect(screen.getByText('image-b').closest('label')).toHaveClass(wideTileClass);
  });

  it('adds selected image to onSubmit callback', () => {
    const content = getTestContent();
    const onSubmit = jest.fn();
    render(<ImageGalleryModal content={content} onSubmit={onSubmit} onClose={() => {}} />);
    const imageElement = screen.getByAltText(content[0].alt);
    const submitButton = screen.getByRole('button', { name: 'Select' });
    userEvent.click(imageElement);
    userEvent.click(submitButton);
    // title isn't passed back
    expect(onSubmit).toHaveBeenCalledWith(omit(content[0], 'title'));
  });

  it('disables select (submit) button when no image is selected', () => {
    const content = getTestContent();
    const onSubmit = jest.fn();
    render(<ImageGalleryModal content={content} onSubmit={onSubmit} onClose={() => {}} />);

    userEvent.click(screen.getByRole('button', { name: 'Select' }));
    expect(onSubmit).not.toHaveBeenCalled();

    userEvent.click(screen.getByAltText(content[0].alt));
    userEvent.click(screen.getByRole('button', { name: 'Select' }));
    // everything except title is returned
    expect(onSubmit).toHaveBeenCalledWith(omit(content[0], 'title'));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    // Unselect the same image
    userEvent.click(screen.getByAltText(content[0].alt));
    userEvent.click(screen.getByRole('button', { name: 'Select' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
  it('clicking delete button triggers delete', () => {
    const content = getTestContent();
    const onSubmit = jest.fn();
    const onDelete = jest.fn();
    render(
      <ImageGalleryModal
        content={content}
        onSubmit={onSubmit}
        onDelete={onDelete}
        onClose={() => {}}
      />
    );

    userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByText(/Are you sure you want/)).toBeVisible();
    userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(onDelete).toHaveBeenCalled();
  });
});
