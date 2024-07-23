import React from 'react';
import { mount } from 'enzyme';
import { act, createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FileDrop from './FileDrop';

const originalFileReader = window.FileReader;

const dragAndDropProps = {
  title: 'Upload Files',
  description: 'Any file can be uploaded.  Feel free to upload more than one!',
  buttonLabel: 'Try it out!',
  kind: 'drag-and-drop',
  onData: jest.fn(),
  onError: jest.fn(),
};
const commonProps = {
  title: 'Upload Files',
  description: 'Any file can be uploaded.  Feel free to upload more than one!',
  buttonLabel: 'Try it out!',
  kind: 'browse',
  onData: jest.fn(),
  onError: jest.fn(),
};

describe('File Drop', () => {
  const mockFiles = [{ name: 'fakeFileLoad', uploadState: 'uploading', contents: null }];

  const mockHoverEvent = {
    preventDefault: jest.fn(),
    pageX: 10,
    pageY: 10,
    type: 'mouseover',
    currentTarget: {
      getBoundingClientRect: () => ({ left: 0, right: 300, top: 0, bottom: 300 }),
    },
    stopPropagation: jest.fn(),
    target: { files: mockFiles },
  };

  const mockFileReader = {
    readAsBinaryString: jest.fn(),
    readAsText: jest.fn(),
  };

  let wrapper;
  beforeEach(() => {
    window.FileReader = jest.fn(() => mockFileReader);
    wrapper = mount(<FileDrop {...commonProps} />);
  });
  afterEach(() => {
    window.FileReader = originalFileReader;
  });
  it('handleChange and addNewFiles', () => {
    // If I call handleChange it should update my state with files
    expect(wrapper.state('files')).toEqual([]);
    const instance = wrapper.instance();
    instance.readFileContent = jest.fn().mockImplementationOnce();
    instance.handleChange(mockHoverEvent);
    const filesInState = wrapper.state('files');
    expect(filesInState).toHaveLength(1);
    expect(filesInState[0]).toEqual(
      expect.objectContaining({ uploadState: 'uploading', contents: null })
    );
    expect(instance.readFileContent).toHaveBeenCalled();
  });
  // handle click function test
  it('handleClick', () => {
    const mockFileNamesNodes = [{ innerText: 'fileToClear' }];

    wrapper.instance().clearFile = jest.fn().mockImplementationOnce();
    expect(wrapper.instance().clearFile).not.toHaveBeenCalled();
    wrapper.instance().nodes = mockFileNamesNodes;
    wrapper.instance().handleClick(null, 0);
    expect(wrapper.instance().clearFile).toHaveBeenCalledWith('fileToClear');
  });
  it('fileType', () => {
    const textWrapper = mount(<FileDrop {...commonProps} fileType="TEXT" />);
    const textInstance = textWrapper.instance();
    const binaryWrapper = mount(<FileDrop {...commonProps} fileType="BINARY" />);
    const binaryInstance = binaryWrapper.instance();
    textInstance.readFileContent([{ name: 'fakeFileName' }]);
    expect(mockFileReader.readAsText).toHaveBeenCalled();
    binaryInstance.readFileContent([{ name: 'fakeFileName' }]);
    expect(mockFileReader.readAsBinaryString).toHaveBeenCalled();
  });
  // Example of how to trigger from direct instance call
  it('fileDragHover', () => {
    wrapper.instance().fileDragHover(mockHoverEvent);
    expect(wrapper.state('hover')).toBe(true);
  });
  // Example of how to click on an element
  it('fileDrop', () => {
    const dragAndDropWrapper = mount(<FileDrop {...dragAndDropProps} />);

    const instance = dragAndDropWrapper.instance();

    instance.fileDragHover = jest.fn().mockImplementationOnce();
    instance.addNewFiles = jest.fn().mockImplementationOnce();

    const fileDropElement = dragAndDropWrapper.find('div[onDragOver]');

    fileDropElement.simulate('drop', mockHoverEvent);
    expect(instance.addNewFiles).toHaveBeenCalled();
  });
  // Example of how to clear an element
  it('fileDrop clearFile', () => {
    wrapper.setState({ files: mockFiles });
    expect(wrapper.state('files')).toHaveLength(1);
    wrapper.instance().clearFile(mockFiles[0].name);
    expect(wrapper.state('files')).toHaveLength(0);
  });
  it('readFileContent', () => {
    const instance = wrapper.instance();
    expect(instance.readers).toEqual({});
    instance.handleFileError = jest.fn().mockImplementationOnce();
    instance.handleFileLoad = jest.fn().mockImplementationOnce();
    instance.readFileContent([{ name: 'fakeFileName' }]);
    expect(Object.keys(instance.readers)).toHaveLength(1);
    expect(instance.readers.fakeFileName).toBeDefined();
  });
  it('handleFileErro', () => {
    const instance = wrapper.instance();
    instance.readers = { fakeFileError: 'fake File Reader' };
    expect(commonProps.onError).not.toHaveBeenCalled();
    instance.handleFileError({}, { name: 'fakeFileError' });
    expect(Object.keys(instance.readers)).toHaveLength(0);
    expect(commonProps.onError).toHaveBeenCalled();
  });
  it('handleFileLoad', () => {
    const instance = wrapper.instance();
    wrapper.setState({ files: mockFiles });
    expect(wrapper.state('files')[0].contents).toEqual(null);
    instance.readers = { fakeFileLoad: { result: 'resultFromFileReader' } };
    instance.handleFileLoad({ name: 'fakeFileLoad' });
    expect(wrapper.state('files')).toHaveLength(1);
    expect(wrapper.state('files')[0].contents).toEqual('resultFromFileReader');
  });
  // We should not include duplicated files in the state
  it('addNewFiles - not include duplicate files', () => {
    const instance = wrapper.instance();
    wrapper.setState({ files: mockFiles });
    expect(wrapper.state('files')).toHaveLength(1);
    instance.addNewFiles([{ name: 'fakeFileLoad' }]);
    const filesInState = wrapper.state('files');
    expect(filesInState).toHaveLength(1);
    expect(filesInState[0]).toEqual(expect.objectContaining({ name: 'fakeFileLoad' }));
  });
});

describe('FileDrop', () => {
  beforeEach(() => {
    function FileReaderMock() {
      this.result = 'a';

      this.readAsText = jest.fn();

      this.readAsBinaryString = jest.fn();

      this.onerror = jest.fn();

      this.onload = jest.fn();
    }

    const mockFileReader = new FileReaderMock();
    jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader);
  });
  afterEach(() => {
    window.FileReader = originalFileReader;
    jest.clearAllMocks();
  });

  it('should be selectable by testId', () => {
    render(<FileDrop {...dragAndDropProps} testId="FILE_DROP" />);
    expect(screen.getByTestId('FILE_DROP')).toBeDefined();
    expect(screen.getByTestId('FILE_DROP-file-input')).toBeDefined();
    expect(screen.getByTestId('FILE_DROP-title')).toBeDefined();
    expect(screen.getByTestId('FILE_DROP-drop-zone')).toBeDefined();
  });

  it('should handle a file being dropped into the dropzone', () => {
    const file = new File(['a-test-image'], 'a-test-image.png', {
      type: 'image/png',
    });
    render(<FileDrop {...dragAndDropProps} />);
    expect(screen.queryByText('a-test-image.png')).toBeNull();
    const dropZone = screen.getByText('Drag and drop your file here or');
    act(() => {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    });
    expect(screen.queryByText('a-test-image.png')).toBeInTheDocument();
  });

  it('should call the onError callback when the FileReader fails.', () => {
    const file = new File(['a-test-image'], 'a-test-image.png', {
      type: 'image/png',
    });
    render(<FileDrop {...dragAndDropProps} />);
    expect(screen.queryByText('a-test-image.png')).toBeNull();
    const dropZone = screen.getByText('Drag and drop your file here or');
    act(() => {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    });
    const theError = new Error('file failed');

    act(() => {
      window.FileReader.mock.results[0].value.onerror(theError);
    });

    expect(dragAndDropProps.onError).toBeCalledWith(theError);
  });

  it('should handle clicks to upload even with drag and drop uploader', () => {
    const files = [
      new File(['a-test-image'], 'a-test-image.png', {
        type: 'image/png',
      }),
      new File(['another-test-image'], 'another-test-image.png', {
        type: 'image/png',
      }),
    ];
    const { container, rerender } = render(<FileDrop {...dragAndDropProps} />);
    expect(screen.queryByText('a-test-image.png')).toBeNull();
    userEvent.click(screen.getByText('Try it out!'));
    const fileInput = container.querySelector('input[type="file"]');
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

    expect(screen.queryByText('a-test-image.png')).toBeInTheDocument();

    // if multiple files were uploaded, but multiple is now false and
    // the user clicks on the upload button it should clear the file list.
    rerender(<FileDrop {...dragAndDropProps} multiple={false} />);
    userEvent.click(screen.getByText('Try it out!'));

    expect(screen.queryByText('a-test-image.png')).not.toBeInTheDocument();
  });

  it('should handle clicks and keypresses to remove files after being uploaded', () => {
    const files = [
      new File(['a-test-image'], 'a-test-image.png', {
        type: 'image/png',
      }),
      new File(['another-test-image'], 'another-test-image.png', {
        type: 'image/png',
      }),
      new File(['yet-another-test-image'], 'yet-another-test-image.png', {
        type: 'image/png',
      }),
    ];
    render(<FileDrop {...dragAndDropProps} />);
    expect(screen.queryByText('a-test-image.png')).toBeNull();
    const dropZone = screen.getByText('Drag and drop your file here or');

    act(() => {
      fireEvent.drop(dropZone, { dataTransfer: { files } });
    });

    act(() => {
      files.forEach((file, index) => {
        window.FileReader.mock.results[index].value.onload();
      });
    });

    expect(screen.queryByText('a-test-image.png')).toBeInTheDocument();
    expect(screen.queryByText('another-test-image.png')).toBeInTheDocument();
    expect(screen.queryByText('yet-another-test-image.png')).toBeInTheDocument();
    Element.prototype.innerText = 'a-test-image.png';

    fireEvent.keyDown(screen.getByRole('button', { name: /Uploading file/i }), {
      key: 'Enter',
    });
    Element.prototype.innerText = 'another-test-image.png';
    fireEvent.keyDown(screen.getByRole('button', { name: /Uploading file/i }), {
      key: 'a',
    });
    expect(screen.queryByText('another-test-image.png')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('button', { name: /Uploading file/i }), {
      key: 'Space',
    });
    Element.prototype.innerText = 'yet-another-test-image.png';
    userEvent.click(screen.getByRole('button', { name: /Uploading file/i }));
    expect(screen.queryByText('a-test-image.png')).not.toBeInTheDocument();
    expect(screen.queryByText('another-test-image.png')).not.toBeInTheDocument();
    expect(screen.queryByText('yet-another-test-image.png')).not.toBeInTheDocument();
    Element.prototype.innerText = undefined;
  });

  it('should change the border on dragHover and not show files', () => {
    const file = new File(['a-test-image'], 'a-test-image.png', {
      type: 'image/png',
    });
    render(<FileDrop {...dragAndDropProps} title={null} description={null} showFiles={false} />);
    expect(screen.queryByText('a-test-image.png')).toBeNull();
    const dropZone = screen.getByText('Drag and drop your file here or');
    act(() => {
      fireEvent.dragOver(dropZone, { dataTransfer: { files: [file] } });
    });
    expect(dropZone.parentNode).toHaveStyle('border: 1px solid #3D70B2');
    expect(screen.queryByText('Upload Files')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Any file can be uploaded.  Feel free to upload more than one!')
    ).not.toBeInTheDocument();
    act(() => {
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    });
    expect(screen.queryByText('a-test-image.png')).not.toBeInTheDocument();
  });

  it('should not show title or description if not given', () => {
    render(<FileDrop {...commonProps} title={null} description={null} showFiles={false} />);

    expect(screen.queryByText('Upload Files')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Any file can be uploaded.  Feel free to upload more than one!')
    ).not.toBeInTheDocument();
  });
});
