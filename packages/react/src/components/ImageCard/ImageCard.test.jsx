import * as React from 'react';
import { act, createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import ImageCard from './ImageCard';
import landscape from './landscape.jpg';

const { iotPrefix } = settings;

function stringToArrayBuffer(str) {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i += 1) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

describe('ImageCard', () => {
  it('should be selectable by testId or testID', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const testID = 'IMAGE_CARD';

    const { rerender } = render(
      <ImageCard content={{ src: landscape }} size={CARD_SIZES.LARGE} testID={testID} />
    );

    expect(screen.getByTestId(testID)).toBeDefined();
    expect(console.error).toHaveBeenCalledWith(
      `Warning: The 'testID' prop has been deprecated. Please use 'testId' instead.`
    );

    const testId = 'image_card';
    rerender(<ImageCard content={{ src: landscape }} size={CARD_SIZES.LARGE} testID={testId} />);
    expect(screen.getByTestId(testId)).toBeDefined();

    rerender(<ImageCard isEditable size={CARD_SIZES.LARGE} testID={testId} />);
    expect(screen.getByTestId(testId)).toBeDefined();
    expect(screen.getByTestId(`${testId}-image-uploader`)).toBeDefined();

    rerender(<ImageCard content={{ src: '' }} size={CARD_SIZES.LARGE} testID={testId} />);
    expect(screen.getByTestId(testId)).toBeDefined();
    expect(screen.getByTestId(`${testId}-empty`)).toBeDefined();
  });

  it('should show ImageUploader when editable and no image is given', () => {
    render(<ImageCard isEditable size={CARD_SIZES.LARGE} />);

    expect(screen.getByText(/Drag file here or click to upload file/gi)).toBeInTheDocument();
  });

  it('should show ImageHotspots when editable and an image is given', () => {
    render(
      <ImageCard
        content={{ src: landscape, alt: 'landscape image' }}
        isEditable
        size={CARD_SIZES.LARGE}
      />
    );

    expect(screen.getByTitle(/zoom in/i)).toBeVisible();
    expect(screen.getByTitle(/zoom out/i)).toBeVisible();
    expect(screen.getByAltText('landscape image')).toBeVisible();
  });

  it('should be an empty gray placeholder when no errors, but the src is empty', () => {
    const { container } = render(
      <ImageCard content={{ src: '' }} isResizable error={false} size={CARD_SIZES.LARGE} />
    );

    expect(screen.getByTitle(/Expand to fullscreen/i)).toBeVisible();
    expect(container.querySelector(`[class*="${iotPrefix}--image-card__empty"]`)).toBeVisible();
  });

  it('should be null when no errors, not editable, and src is null', () => {
    const { container } = render(
      <ImageCard
        // extra branch coverage for when hotspots aren't provided
        values={{}}
        content={{ src: null }}
        isEditable={false}
        error={false}
        size={CARD_SIZES.LARGE}
      />
    );

    expect(screen.getByTitle(/Expand to fullscreen/i)).toBeVisible();
    expect(container.querySelector('[class*="skeleton-wrapper"]')).toBeVisible();
  });

  it('renders hotspots with correct icons and colors from name', () => {
    render(
      <ImageCard
        values={{
          hotspots: [
            {
              x: 35,
              y: 35,
              color: 'green',
              icon: '_', // invalid hotspot icon to test 'warning' fallback icon
              width: 20,
              height: 20,
              content: {
                title: 'My Device',
                description: 'Description',
                values: { deviceid: '73000', temperature: 35.05 },
                attributes: [
                  {
                    dataSourceId: 'temperature',
                    label: 'Temp',
                    precision: 2,
                    thresholds: [
                      {
                        comparison: '>',
                        value: 0,
                        icon: '_', // invalid threshold icon to test 'warning' fallback icon
                        color: 'yellow',
                      },
                    ],
                  },
                ],
              },
            },
            {
              x: 10,
              y: 20,
              content: <span>warning hotspot</span>,
              icon: 'Location',
              color: 'red',
              width: 20,
              height: 20,
            },
            {
              x: 35,
              y: 65,
              icon: 'User',
              color: 'purple',
              content: {
                title: 'My Device',
                description: 'Description',
                values: { deviceid: '73000', temperature: 35.05 },
                attributes: [
                  {
                    dataSourceId: 'temperature',
                    label: 'Temp',
                    precision: 2,
                    thresholds: [
                      {
                        comparison: '>',
                        value: 0,
                        icon: 'Error filled',
                        color: 'purple',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        }}
        content={{ src: landscape, alt: 'landscape image' }}
        isEditable={false}
        error={false}
        size={CARD_SIZES.LARGE}
      />
    );

    expect(screen.getByTitle(/Expand to fullscreen/i)).toBeVisible();
    const errorIcon = screen.getByTitle('Error filled');
    expect(errorIcon).toBeVisible();
    expect(errorIcon).toHaveAttribute('fill', 'purple');
    const locationIcon = screen.getByTitle('Location');
    expect(locationIcon).toBeVisible();
    expect(locationIcon).toHaveAttribute('fill', 'red');
    const warningIcon = screen.getByTitle('Warning');
    expect(warningIcon).toBeVisible();
    expect(warningIcon).toHaveAttribute('fill', 'yellow');
  });

  it('should show an error message when the wrong file type is given', () => {
    const invalidFile = new File([`temperature,date\n35,1615219474\n`], 'temps.csv', {
      type: 'text/csv',
    });
    const files = [invalidFile];
    const handleUpload = jest.fn();
    const { container } = render(
      <ImageCard onUpload={handleUpload} isEditable size={CARD_SIZES.LARGE} />
    );

    expect(screen.getByText(/Drag file here or click to upload file/gi)).toBeInTheDocument();
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeVisible();

    // this would have been the easier route, but something required the iterator to be in there,
    // so I wrote out the event by hand and manually added the iterator.
    // see https://github.com/testing-library/user-event/issues/576
    // userEvent.upload(fileInput, invalidFile);
    fireEvent.change(fileInput, {
      target: {
        files: {
          length: 1,
          item: (index) => files[index],
          ...files,
          [Symbol.iterator]() {
            let i = 0;
            let done = false;
            return {
              next: () => {
                done = i >= files.length;
                const returnVal = {
                  done,
                  value: files[i],
                  key: i,
                };
                i += 1;
                return returnVal;
              },
            };
          },
        },
      },
    });

    expect(handleUpload).not.toHaveBeenCalled();
    expect(screen.getByText(/This file is not one of the accepted file types/gi)).toBeVisible();
  });

  it('should call onUpload when an acceptable image has been uploaded.', () => {
    jest.spyOn(global, 'FileReader').mockImplementation(function FileReaderMock() {
      this.readAsDataURL = jest.fn();
    });
    const fileContents = 'a'.repeat(1024);
    const base64Result = `data:image/png;base64,${Buffer.from(fileContents).toString('base64')}`;
    const validFile = new File([fileContents], 'pretty picture.png', {
      type: 'image/png',
    });
    const files = [validFile];
    const handleUpload = jest.fn();
    const handleClick = jest.fn();
    const validate = jest.fn(() => false);
    const handleCardAction = jest.fn();
    const { container } = render(
      <ImageCard
        onUpload={handleUpload}
        isEditable
        size={CARD_SIZES.LARGE}
        onBrowseClick={handleClick}
        validateUploadedImage={validate}
        onCardAction={handleCardAction}
      />
    );

    const uploadText = screen.getByText(/Drag file here or click to upload file/gi);
    expect(uploadText).toBeInTheDocument();
    // userEvent.click(uploadText);
    const galleryButton = screen.getByRole('button', { name: 'Add from gallery' });
    expect(galleryButton).toBeVisible();
    userEvent.click(galleryButton);
    expect(handleClick).toHaveBeenCalled();
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeVisible();

    // this would have been the easier route, but something required the iterator to be in there,
    // so I wrote out the event by hand and manually added the iterator.
    // see https://github.com/testing-library/user-event/issues/576
    // userEvent.upload(fileInput, invalidFile);
    const inputFiles = {
      length: 1,
      item: (index) => files[index],
      ...files,
      [Symbol.iterator]() {
        let i = 0;
        let done = false;
        return {
          next: () => {
            done = i >= files.length;
            const returnVal = {
              done,
              value: files[i],
              key: i,
            };
            i += 1;
            return returnVal;
          },
        };
      },
    };

    fireEvent(
      fileInput,
      createEvent('input', fileInput, {
        target: { files: inputFiles },
        bubbles: true,
        cancelable: false,
        composed: true,
      })
    );
    fireEvent.change(fileInput, {
      target: {
        files: inputFiles,
      },
    });

    expect(screen.queryByText(/This file is not one of the accepted file types/gi)).toBeNull();
    expect(validate).toHaveBeenCalledWith(validFile);
    const reader = FileReader.mock.instances[0];
    expect(reader.readAsDataURL).toHaveBeenCalledWith(validFile);
    act(() => {
      reader.onloadend({
        target: {
          result: base64Result,
        },
      });
    });
    expect(handleUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        addedFiles: expect.arrayContaining([validFile]),
      })
    );
    expect(container.querySelector(`img[src^="data:"`)).toBeVisible();
    jest.resetAllMocks();
  });

  it('should show an error when the file size is too large.', () => {
    jest.spyOn(global, 'FileReader').mockImplementation(function FileReaderMock() {
      this.readAsDataURL = jest.fn();
    });
    const fileContents = 'a'.repeat(1024 * 1024 + 1);
    const validFile = new File([fileContents], 'pretty picture.png', {
      type: 'image/png',
    });
    const files = [validFile];
    const handleUpload = jest.fn();
    const handleClick = jest.fn();
    const validate = jest.fn(() => false);
    const handleCardAction = jest.fn();
    const { container } = render(
      <ImageCard
        onUpload={handleUpload}
        isEditable
        size={CARD_SIZES.LARGE}
        onBrowseClick={handleClick}
        validateUploadedImage={validate}
        onCardAction={handleCardAction}
      />
    );

    const uploadText = screen.getByText(/Drag file here or click to upload file/gi);
    expect(uploadText).toBeInTheDocument();
    // userEvent.click(uploadText);
    const galleryButton = screen.getByRole('button', { name: 'Add from gallery' });
    expect(galleryButton).toBeVisible();
    userEvent.click(galleryButton);
    expect(handleClick).toHaveBeenCalled();
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeVisible();

    // this would have been the easier route, but something required the iterator to be in there,
    // so I wrote out the event by hand and manually added the iterator.
    // see https://github.com/testing-library/user-event/issues/576
    // userEvent.upload(fileInput, invalidFile);
    const inputFiles = {
      length: 1,
      item: (index) => files[index],
      ...files,
      [Symbol.iterator]() {
        let i = 0;
        let done = false;
        return {
          next: () => {
            done = i >= files.length;
            const returnVal = {
              done,
              value: files[i],
              key: i,
            };
            i += 1;
            return returnVal;
          },
        };
      },
    };

    fireEvent(
      fileInput,
      createEvent('input', fileInput, {
        target: { files: inputFiles },
        bubbles: true,
        cancelable: false,
        composed: true,
      })
    );
    fireEvent.change(fileInput, {
      target: {
        files: inputFiles,
      },
    });

    expect(screen.queryByText(/This file is not one of the accepted file types/gi)).toBeNull();
    expect(validate).toHaveBeenCalledWith(validFile);
    expect(screen.getByText(/image file is too large/gi)).toBeVisible();
    jest.resetAllMocks();
  });

  it('should show an error when validateUploadImage fails', () => {
    jest.spyOn(global, 'FileReader').mockImplementation(function FileReaderMock() {
      this.readAsDataURL = jest.fn();
    });
    const fileContents = 'a'.repeat(10);
    const validFile = new File([fileContents], 'pretty picture.png', {
      type: 'image/png',
    });
    const files = [validFile];
    const handleUpload = jest.fn();
    const handleClick = jest.fn();
    const validate = jest.fn(() => 'This file does not pass muster.');
    const handleCardAction = jest.fn();
    const { container } = render(
      <ImageCard
        onUpload={handleUpload}
        isEditable
        size={CARD_SIZES.LARGE}
        onBrowseClick={handleClick}
        validateUploadedImage={validate}
        onCardAction={handleCardAction}
      />
    );

    const uploadText = screen.getByText(/Drag file here or click to upload file/gi);
    expect(uploadText).toBeInTheDocument();
    // userEvent.click(uploadText);
    const galleryButton = screen.getByRole('button', { name: 'Add from gallery' });
    expect(galleryButton).toBeVisible();
    userEvent.click(galleryButton);
    expect(handleClick).toHaveBeenCalled();
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeVisible();

    // this would have been the easier route, but something required the iterator to be in there,
    // so I wrote out the event by hand and manually added the iterator.
    // see https://github.com/testing-library/user-event/issues/576
    // userEvent.upload(fileInput, invalidFile);
    const inputFiles = {
      length: 1,
      item: (index) => files[index],
      ...files,
      [Symbol.iterator]() {
        let i = 0;
        let done = false;
        return {
          next: () => {
            done = i >= files.length;
            const returnVal = {
              done,
              value: files[i],
              key: i,
            };
            i += 1;
            return returnVal;
          },
        };
      },
    };

    fireEvent(
      fileInput,
      createEvent('input', fileInput, {
        target: { files: inputFiles },
        bubbles: true,
        cancelable: false,
        composed: true,
      })
    );
    fireEvent.change(fileInput, {
      target: {
        files: inputFiles,
      },
    });

    expect(screen.queryByText(/This file is not one of the accepted file types/gi)).toBeNull();
    expect(validate).toHaveBeenCalledWith(validFile);
    expect(screen.getByText(/this file does not pass muster/gi)).toBeVisible();
    jest.resetAllMocks();
  });

  it('should show an error when the FileReader has an error on upload', () => {
    jest.spyOn(global, 'FileReader').mockImplementation(function FileReaderMock() {
      this.readAsDataURL = jest.fn();
    });
    const fileContents = 'a'.repeat(10);
    const validFile = new File([fileContents], 'pretty picture.png', {
      type: 'image/png',
    });
    const files = [validFile];
    const handleUpload = jest.fn();
    const handleClick = jest.fn();
    const validate = jest.fn(() => false);
    const handleCardAction = jest.fn();
    const { container } = render(
      <ImageCard
        onUpload={handleUpload}
        isEditable
        size={CARD_SIZES.LARGE}
        onBrowseClick={handleClick}
        validateUploadedImage={validate}
        onCardAction={handleCardAction}
      />
    );

    const uploadText = screen.getByText(/Drag file here or click to upload file/gi);
    expect(uploadText).toBeInTheDocument();
    // userEvent.click(uploadText);
    const galleryButton = screen.getByRole('button', { name: 'Add from gallery' });
    expect(galleryButton).toBeVisible();
    userEvent.click(galleryButton);
    expect(handleClick).toHaveBeenCalled();
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeVisible();

    // this would have been the easier route, but something required the iterator to be in there,
    // so I wrote out the event by hand and manually added the iterator.
    // see https://github.com/testing-library/user-event/issues/576
    // userEvent.upload(fileInput, invalidFile);
    const inputFiles = {
      length: 1,
      item: (index) => files[index],
      ...files,
      [Symbol.iterator]() {
        let i = 0;
        let done = false;
        return {
          next: () => {
            done = i >= files.length;
            const returnVal = {
              done,
              value: files[i],
              key: i,
            };
            i += 1;
            return returnVal;
          },
        };
      },
    };

    fireEvent(
      fileInput,
      createEvent('input', fileInput, {
        target: { files: inputFiles },
        bubbles: true,
        cancelable: false,
        composed: true,
      })
    );
    fireEvent.change(fileInput, {
      target: {
        files: inputFiles,
      },
    });

    expect(screen.queryByText(/This file is not one of the accepted file types/gi)).toBeNull();
    expect(validate).toHaveBeenCalledWith(validFile);
    const reader = FileReader.mock.instances[0];
    expect(reader.readAsDataURL).toHaveBeenCalledWith(validFile);
    act(() => {
      reader.onerror(new Error('FileReader failed'));
    });

    expect(screen.getByText(/filereader failed/gi)).toBeVisible();

    jest.resetAllMocks();
  });

  it('should fetch an image from a given url and display', async () => {
    const fileContents = 'a'.repeat(10);
    const base64File = `data:image/png;base64,${Buffer.from(
      stringToArrayBuffer(fileContents)
    ).toString('base64')}`;
    const fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(stringToArrayBuffer(fileContents)),
      })
    );
    global.fetch = fetch;
    const handleUpload = jest.fn();
    const validate = jest.fn(() => false);
    const handleCardAction = jest.fn();
    render(
      <ImageCard
        onUpload={handleUpload}
        isEditable
        content={{
          alt: 'example image from url',
          hasInsertFromUrl: true,
        }}
        size={CARD_SIZES.LARGE}
        validateUploadedImage={validate}
        onCardAction={handleCardAction}
      />
    );

    const uploadText = screen.getByText(/Drag file here or click to upload file/gi);
    expect(uploadText).toBeInTheDocument();
    // userEvent.click(uploadText);
    const urlButton = screen.getByRole('button', { name: 'Insert from URL' });
    expect(urlButton).toBeVisible();
    userEvent.click(urlButton);
    const urlInput = screen.getByTitle(/type or insert url/gi);
    expect(urlInput).toBeVisible();
    userEvent.type(urlInput, 'http://example.com/example.png');
    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });

    expect(fetch).toHaveBeenCalledWith('http://example.com/example.png');
    expect(handleUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        addedFiles: expect.arrayContaining([
          new File([fileContents], 'example.png', {
            type: 'image/png',
          }),
        ]),
      })
    );
    expect(screen.getByAltText('example image from url')).toHaveAttribute('src', base64File);
    global.fetch = undefined;
  });

  it('should display an error if fetch fails and the error is closeable', async () => {
    const fetch = jest.fn(() => Promise.reject(new Error('fetch failed.')));
    global.fetch = fetch;
    const handleUpload = jest.fn();
    const validate = jest.fn(() => false);
    const handleCardAction = jest.fn();
    render(
      <ImageCard
        onUpload={handleUpload}
        isEditable
        content={{
          alt: 'example image from url',
          hasInsertFromUrl: true,
        }}
        size={CARD_SIZES.LARGE}
        validateUploadedImage={validate}
        onCardAction={handleCardAction}
      />
    );

    const uploadText = screen.getByText(/Drag file here or click to upload file/gi);
    expect(uploadText).toBeInTheDocument();
    // userEvent.click(uploadText);
    const urlButton = screen.getByRole('button', { name: 'Insert from URL' });
    expect(urlButton).toBeVisible();
    userEvent.click(urlButton);
    const urlInput = screen.getByTitle(/type or insert url/gi);
    expect(urlInput).toBeVisible();
    userEvent.type(urlInput, 'http://example.com/example.png');
    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });

    expect(fetch).toHaveBeenCalledWith('http://example.com/example.png');
    expect(screen.getByText(/fetch failed/gi)).toBeVisible();
    const closeErrorButton = screen.getByTitle('closes notification');
    expect(closeErrorButton).toBeVisible();
    userEvent.click(closeErrorButton);
    expect(screen.queryByText(/fetch failed/gi)).toBeNull();

    global.fetch = undefined;
  });

  it('should throw a prop error when using an unsupported size', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<ImageCard content={{ src: landscape }} size={CARD_SIZES.SMALL} />);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('`ImageCard` prop `size` cannot be `SMALL`')
    );

    rerender(<ImageCard content={{ src: landscape }} size={CARD_SIZES.SMALLWIDE} />);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('`ImageCard` prop `size` cannot be `SMALLWIDE`')
    );
    rerender(<ImageCard content={{ src: landscape }} size={CARD_SIZES.SMALLFULL} />);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('`ImageCard` prop `size` cannot be `SMALLFULL`')
    );
    rerender(<ImageCard content={{ src: landscape }} size={CARD_SIZES.LARGETHIN} />);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('`ImageCard` prop `size` cannot be `LARGETHIN`')
    );
    jest.resetAllMocks();
  });
});
