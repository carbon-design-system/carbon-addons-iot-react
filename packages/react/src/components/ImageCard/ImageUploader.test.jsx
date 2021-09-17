import React from 'react';
import { act, createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import ImageUploader from './ImageUploader';

const { iotPrefix } = settings;
// function mockFetch(status, data) {
//   return { status, json: () => Promise.resolve(data) };
// }

describe('ImageUploader', () => {
  it('should be selectable by testId', () => {
    const testId = 'IMAGE_UPLOADER';
    render(<ImageUploader hasInsertFromUrl testId={testId} />);
    expect(screen.getByTestId(testId)).toBeDefined();
    expect(screen.getAllByTestId('Button').length).toBe(2);
    expect(screen.getByTestId(`${testId}-file-drop-container`)).toBeDefined();
    // expect(screen.getByTestId(`${testId}-browse-button`)).toBeDefined();
    // expect(screen.getByTestId(`${testId}-insert-from-url-button`)).toBeDefined();
  });

  it('will switch to URL upload screen', () => {
    const { container } = render(<ImageUploader hasInsertFromUrl />);

    const insertFromURLBtn = screen.getByText(/Insert from URL/);
    userEvent.click(insertFromURLBtn);
    expect(screen.getAllByText(/OK/)).toHaveLength(1);
    expect(container.firstChild).toHaveClass(`${iotPrefix}--image-uploader__url`);
    userEvent.click(screen.getByText(/Cancel/));
    expect(screen.getAllByText(/Insert from URL/)).toHaveLength(1);
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
      <ImageUploader
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
    expect(handleClick).toBeCalled();
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
    expect(validate).toBeCalledWith(validFile);
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
        files: expect.objectContaining({
          addedFiles: expect.arrayContaining([validFile]),
        }),
        dataURL: base64Result,
      })
    );
  });

  it('shows the appropriate classes based on width', () => {
    const { rerender, container } = render(<ImageUploader hasInsertFromUrl width={300} />);

    expect(container.firstChild).toHaveClass(`${iotPrefix}--image-uploader__medium`);

    rerender(<ImageUploader hasInsertFromUrl width={550} height={550} />);

    expect(container.firstChild).toHaveClass(`${iotPrefix}--image-uploader__mediumwide`);

    rerender(<ImageUploader hasInsertFromUrl width={550} height={600} />);

    expect(container.firstChild).toHaveClass(`${iotPrefix}--image-uploader__large`);

    rerender(<ImageUploader hasInsertFromUrl width={1200} height={600} />);

    expect(container.firstChild).toHaveClass(`${iotPrefix}--image-uploader__largewide`);
  });

  it('should show an error message when the wrong file type is given', () => {
    const invalidFile = new File([`temperature,date\n35,1615219474\n`], 'temps.csv', {
      type: 'text/csv',
    });
    const files = [invalidFile];
    const handleUpload = jest.fn();
    const { container } = render(<ImageUploader />);

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

  it("will not fetch when a url hasn't been given.", () => {
    global.fetch = jest.fn();
    render(<ImageUploader hasInsertFromUrl width={300} />);
    userEvent.click(screen.getByText(/Insert from URL/));
    userEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(fetch).not.toHaveBeenCalled();

    global.fetch = undefined;
  });

  it('will show an error if fetch throws an error', async () => {
    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          reject(new Error('BOOM!'));
        })
    );
    render(<ImageUploader hasInsertFromUrl width={300} />);
    userEvent.click(screen.getByText(/Insert from URL/));
    userEvent.type(screen.getByPlaceholderText('Type or insert URL'), 'https://www.ibm.com');
    userEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(fetch).toHaveBeenCalled();
    expect(await screen.findByText('Upload error:')).toBeVisible();
    expect(screen.getByText('BOOM!')).toBeVisible();

    global.fetch = undefined;
  });

  it('will call the default onUpload with a valid url', async () => {
    jest.spyOn(ImageUploader.defaultProps, 'onUpload');
    const abPromise = new Promise((resolve) => {
      resolve(new ArrayBuffer(Buffer.from('a'.repeat(10)).length));
    });
    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve({
            ok: true,
            arrayBuffer: () => abPromise,
          });
        })
    );
    render(<ImageUploader hasInsertFromUrl width={300} />);
    userEvent.click(screen.getByText(/Insert from URL/));
    userEvent.type(
      screen.getByPlaceholderText('Type or insert URL'),
      'https://www.ibm.com/image.png'
    );
    userEvent.click(screen.getByRole('button', { name: 'OK' }));

    await act(() => abPromise);
    expect(fetch).toHaveBeenCalledWith('https://www.ibm.com/image.png');
    expect(ImageUploader.defaultProps.onUpload).toHaveBeenCalledWith({
      dataURL: 'data:image/png;base64,AAAAAAAAAAAAAA==',
      files: { addedFiles: expect.arrayContaining([expect.any(File)]) },
    });

    global.fetch = undefined;
    jest.resetAllMocks();
  });

  it('will call default onBrowseClick', () => {
    jest.spyOn(ImageUploader.defaultProps, 'onBrowseClick');
    render(<ImageUploader width={300} />);
    userEvent.click(screen.getByRole('button', { name: 'Add from gallery' }));
    expect(ImageUploader.defaultProps.onBrowseClick).toHaveBeenCalled();

    jest.resetAllMocks();
  });
});
