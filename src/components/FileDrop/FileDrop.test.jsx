import React from 'react';
import { mount } from 'enzyme';

import FileDrop from './FileDrop';

const commonProps = {
  title: 'Upload Files',
  description: 'Any file can be uploaded.  Feel free to upload more than one!',
  buttonLabel: 'Try it out!',
  kind: 'browse',
  onData: jest.fn(),
  onError: jest.fn(),
};

const dragAndDropProps = {
  title: 'Upload Files',
  description: 'Any file can be uploaded.  Feel free to upload more than one!',
  buttonLabel: 'Try it out!',
  kind: 'drag-and-drop',
  onData: jest.fn(),
  onError: jest.fn(),
};
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
};

const originalFileReader = window.FileReader;

let wrapper;
describe('File Drop', () => {
  beforeEach(() => {
    window.FileReader = jest.fn(() => mockFileReader);
    wrapper = mount(<FileDrop {...commonProps} />);
  });
  afterEach(() => {
    window.FileReader = originalFileReader;
  });
  test('handleChange and addNewFiles', () => {
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
  test('handleClick', () => {
    const mockFileNamesNodes = [{ innerText: 'fileToClear' }];

    wrapper.instance().clearFile = jest.fn().mockImplementationOnce();
    expect(wrapper.instance().clearFile).not.toHaveBeenCalled();
    wrapper.instance().nodes = mockFileNamesNodes;
    wrapper.instance().handleClick(null, 0);
    expect(wrapper.instance().clearFile).toHaveBeenCalledWith('fileToClear');
  });
  // Example of how to trigger from direct instance call
  test('fileDragHover', () => {
    wrapper.instance().fileDragHover(mockHoverEvent);
    expect(wrapper.state('hover')).toBe(true);
  });
  // Example of how to click on an element
  test('fileDrop', () => {
    const dragAndDropWrapper = mount(<FileDrop {...dragAndDropProps} />);
    // console.log(`drag and drop version: ${dragAndDropWrapper.debug()}`)
    const instance = dragAndDropWrapper.instance();

    instance.fileDragHover = jest.fn().mockImplementationOnce();
    instance.addNewFiles = jest.fn().mockImplementationOnce();

    const fileDropElement = dragAndDropWrapper.find('div[onDragOver]');
    // console.log(`file drop element: ${fileDropElement.debug()}`)
    fileDropElement.simulate('drop', mockHoverEvent);
    expect(instance.addNewFiles).toHaveBeenCalled();
  });
  // Example of how to clear an element
  test('fileDrop clearFile', () => {
    wrapper.setState({ files: mockFiles });
    expect(wrapper.state('files')).toHaveLength(1);
    wrapper.instance().clearFile(mockFiles[0].name);
    expect(wrapper.state('files')).toHaveLength(0);
  });
  test('readFileContent', () => {
    const instance = wrapper.instance();
    expect(instance.readers).toEqual({});
    instance.handleFileError = jest.fn().mockImplementationOnce();
    instance.handleFileLoad = jest.fn().mockImplementationOnce();
    instance.readFileContent([{ name: 'fakeFileName' }]);
    expect(Object.keys(instance.readers)).toHaveLength(1);
    expect(instance.readers.fakeFileName).toBeDefined();
  });
  test('handleFileErro', () => {
    const instance = wrapper.instance();
    instance.readers = { fakeFileError: 'fake File Reader' };
    expect(commonProps.onError).not.toHaveBeenCalled();
    instance.handleFileError({}, { name: 'fakeFileError' });
    expect(Object.keys(instance.readers)).toHaveLength(0);
    expect(commonProps.onError).toHaveBeenCalled();
  });
  test('handleFileLoad', () => {
    const instance = wrapper.instance();
    wrapper.setState({ files: mockFiles });
    expect(wrapper.state('files')[0].contents).toEqual(null);
    instance.readers = { fakeFileLoad: { result: 'resultFromFileReader' } };
    instance.handleFileLoad({ name: 'fakeFileLoad' });
    expect(wrapper.state('files')).toHaveLength(1);
    expect(wrapper.state('files')[0].contents).toEqual('resultFromFileReader');
  });
  // We should not include duplicated files in the state
  test('addNewFiles - not include duplicate files', () => {
    const instance = wrapper.instance();
    wrapper.setState({ files: mockFiles });
    expect(wrapper.state('files')).toHaveLength(1);
    instance.addNewFiles([{ name: 'fakeFileLoad' }]);
    const filesInState = wrapper.state('files');
    expect(filesInState).toHaveLength(1);
    expect(filesInState[0]).toEqual(expect.objectContaining({ name: 'fakeFileLoad' }));
  });
});
