import React from 'react';
import PropTypes from 'prop-types';
import { Filename, FileUploaderButton } from 'carbon-components-react';
import styled from 'styled-components';

import { COLORS } from '../../styles/styles';

const Span = styled.span`
   {
    background-color: rgba(85, 150, 230, 0.1);
  }
`;

const LinkButton = styled.button`
   {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    outline: none;
    color: ${COLORS.blue60};
    cursor: pointer;
    margin-left: 0.25rem;
    text-decoration: underline;
  }
`;

const Text = styled.div`
   {
    padding: 15px;
    line-height: 30px;
  }
`;

const propTypes = {
  /** DOM ID */
  id: PropTypes.string,
  /** Title text  */
  title: PropTypes.string,
  /** Description text of file uploader */
  description: PropTypes.string,
  /** Optionally show the uploaded files */
  showFiles: PropTypes.bool,
  /** Button label  */
  buttonLabel: PropTypes.string,
  /** can multiple files be uploaded */
  multiple: PropTypes.bool,
  /** File types that are accepted */
  accept: PropTypes.arrayOf(PropTypes.string),
  /** Componet is drag/drop */
  kind: PropTypes.oneOf(['browse', 'drag-and-drop']),
  /** Callback to return the loaded file(s) data */
  onData: PropTypes.func,
  /** Callback for file load errors */
  onError: PropTypes.func,
  dragAndDropLabel: PropTypes.string,
};

const defaultProps = {
  id: 'FileUploader',
  buttonLabel: 'Add files',
  title: null,
  description: null,
  kind: 'browse',
  multiple: true,
  showFiles: true,
  accept: [],
  onData: () => {},
  onError: () => {},
  dragAndDropLabel: 'Drag and drop your file here or ',
};

/**
 * Carbon File Uploader with added ability to have drag and drop
 */
class FileDrop extends React.Component {
  fileInput = null;

  nodes = [];

  readers = {};

  state = {
    files: [],
    hover: false,
  };

  /* Drag hover event */
  fileDragHover = evt => {
    evt.preventDefault();

    const rect = evt.currentTarget.getBoundingClientRect();
    const x = evt.pageX - window.pageXOffset;
    const y = evt.pageY - window.pageYOffset;

    const inArea = !(x < rect.left || x > rect.right || y < rect.top || y > rect.bottom);

    this.setState({
      hover: inArea && evt.type !== 'drop',
    });
  };

  /* Drop event */
  fileDrop = evt => {
    evt.stopPropagation();

    this.fileDragHover(evt);
    const files = evt.target.files || evt.dataTransfer.files;
    this.addNewFiles(files);
  };

  /**
   * takes a array of File javascript objects https://developer.mozilla.org/en-US/docs/Web/API/File
   * and creates a FileReader for each one, setting up the appropriate onload, onerror handlers, and then
   * actually calls the readAsBinaryString method to trigger the loading of the file.
   */
  readFileContent = files => {
    Array.prototype.forEach.call(files, file => {
      this.readers[file.name] = new FileReader();
      this.readers[file.name].onload = () => this.handleFileLoad(file);
      this.readers[file.name].onerror = evt => this.handleFileError(evt, file);
      this.readers[file.name].readAsBinaryString(file);
    });
  };

  /**
   * In the error handler if calls the onError once for any file where content load fails and clears the reader
   */
  handleFileError = (evt, file) => {
    delete this.readers[file.name];
    return this.props.onError(evt);
  };

  /**
   * After the file is read in the success handler, it updates the state with the file contents.
   * After the last one is read it calls the onData callback to update the parent.
   *
   * Finally it clears the reader
   */
  handleFileLoad = file => {
    this.setState(state => {
      const newState = {
        files: state.files.map(i =>
          i.name === file.name
            ? {
                name: i.name,
                uploadState: 'edit', // only change the new reader result, preserve the rest
                contents: i.name === file.name ? this.readers[file.name].result : i.contents,
              }
            : i
        ),
      };

      if (newState.files.filter(i => i.contents === null).length === 0) {
        // all data is loaded, trigger callback
        this.props.onData(
          newState.files.map(i => ({
            name: i.name,
            contents: i.contents,
          }))
        );
      }
      return newState;
    });
    delete this.readers[file.name];
  };

  addNewFiles = files => {
    const { multiple } = this.props;
    const filenames = Array.prototype.map.call(files, f => f.name);
    this.setState(state => ({
      files: (multiple ? state.files : []) // if we're not multiple, always restart
        .concat(
          filenames.map(name => ({
            name,
            uploadState: 'uploading',
            contents: null,
          }))
        )
        .filter(
          (elem, index, arr) =>
            index === arr.findIndex(indexFound => indexFound.name === elem.name) &&
            (multiple || index === 0) // only support the first if set to multiple=false
        ),
    }));
    this.readFileContent(files);
  };

  clearFile = filename =>
    this.setState(state => {
      const newState = {
        files: state.files.filter(({ name }) => name !== filename),
      };
      this.props.onData(
        newState.files.map(i => ({
          name: i.name,
          contents: i.contents,
        }))
      );
      return newState;
    });

  /** This job is to add new files based on a fileDrop event */
  handleChange = evt => {
    evt.stopPropagation();
    this.addNewFiles(evt.target.files);
  };

  /** This handlers job is to request a file deletion based on the clicked index */
  handleClick = (evt, index) => {
    const filename = this.nodes[index].innerText.trim();
    this.clearFile(filename);
  };

  render = () => {
    const {
      id,
      title,
      description,
      buttonLabel,
      accept,
      kind,
      multiple,
      showFiles,
      className,
      dragAndDropLabel,
    } = this.props;
    const { hover } = this.state;

    const linkElement = (
      <div>
        {dragAndDropLabel}
        <span
          onClick={() => {
            if (this.fileInput) {
              if (!multiple) {
                this.setState({ files: [] });
              }
              this.fileInput.files = null;
              this.fileInput.value = null;
              this.fileInput.click();
            }
          }}
          role="presentation"
        >
          <LinkButton>{buttonLabel}</LinkButton>
        </span>
        <div>{description}</div>
      </div>
    );

    const fileNameElements = (
      <div className="bx--file-container">
        {this.state.files.length === 0
          ? null
          : this.state.files.map(({ name, uploadState }, index) => (
              <Span
                key={`${name}-${index}`}
                className="bx--file__selected-file"
                ref={node => (this.nodes[index] = node)} // eslint-disable-line
              >
                <p className="bx--file-filename">{name}</p>
                <span className="bx--file__state-container">
                  <Filename
                    status={uploadState}
                    onKeyDown={evt => {
                      if (evt.which === 13 || evt.which === 32) {
                        this.handleClick(evt, index);
                      }
                    }}
                    onClick={evt => {
                      if (uploadState === 'edit') {
                        this.handleClick(evt, index);
                      }
                    }}
                  />
                </span>
              </Span>
            ))}
      </div>
    );

    return kind === 'drag-and-drop' ? (
      <div className={className}>
        <strong className="bx--label">{title}</strong>
        <input
          style={{ visibility: 'hidden' }}
          type="file"
          ref={ref => (this.fileInput = ref)} // eslint-disable-line
          accept={accept}
          multiple={multiple}
          onChange={this.handleChange}
        />
        <Text
          style={hover ? { border: '1px solid #3D70B2' } : { border: '1px dashed #8C8C8C' }}
          onDragOver={this.fileDragHover}
          onDragLeave={this.fileDragHover}
          onDrop={this.fileDrop}
        >
          {linkElement}
        </Text>
        {showFiles ? fileNameElements : null}
      </div>
    ) : (
      <div id={id} className="bx--form-item">
        {title ? <strong className="bx--label">{title}</strong> : null}
        {description ? <p className="bx--label-description">{description}</p> : null}
        <FileUploaderButton
          labelText={buttonLabel}
          multiple={multiple}
          buttonKind="secondary"
          onChange={this.handleChange}
          disableLabelChanges
          accept={accept}
        />
        {showFiles ? fileNameElements : null}
      </div>
    );
  };
}

FileDrop.propTypes = propTypes;
FileDrop.defaultProps = defaultProps;

export default FileDrop;
