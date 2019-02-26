import React from 'react';
import PropTypes from 'prop-types';
import { Filename, FileUploaderButton } from 'carbon-components-react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

/*
const StyledFileUploader = styled(CarbonFileUploader)`
{
  &.bx--form-item{
    background-color: #ffffff;
    margin-left: 10px;
    padding: 15px 0px 15px 15px;
  }
  .bx--file__selected-file {
    background-color: rgba(85, 150, 230, .1)
  }
}
`;
*/


const propTypes = {
  /** DOM ID */
  id: PropTypes.string,
  /** Title text  */
  title: PropTypes.string.isRequired,
  /** Description text of file uploader */
  description: PropTypes.string.isRequired,
  /** Button label  */
  buttonLabel: PropTypes.string,
  /** File types that are accepted */
  accept: PropTypes.arrayOf(PropTypes.string),
  /** Componet is drag/drop */
  kind: PropTypes.oneOf(['browse', 'drag-and-drop']),
  /** Callback to return the loaded file(s) data */
  onData: PropTypes.func,
  /** Callback for file load errors */
  onError: PropTypes.func,
};

const defaultProps = {
  id: 'FileUploader',
  buttonLabel: 'Add files',
  kind: 'browse',
  accept: [],
  onData: () => {},
  onError: () => {},
};

/**
 * Carbon File Uploader with added ability to have drag and drop
 */
class FileDrop extends React.Component {

  dropzone = null;

  nodes = [];

  readers = {};

  constructor(props) {
    super(props);
    this.state = {
      files: []
    }
  }

  readFileContent = (files) => {
    Array.prototype.forEach.call(files, (file) => {
      this.readers[file.name] = new FileReader();
      this.readers[file.name].onload = () => {
        this.setState((state) => {
          const newState = {
            files: state.files.map(i => i.name === file.name ? ({
              name: i.name,
              uploadState: 'edit',
              contents: i.name === file.name ? this.readers[file.name].result : i.contents,
            }) : i),
          };
          if (newState.files.filter(i => i.contents === null).length === 0) {
            // all data is loaded, trigger callback
            this.props.onData(newState.files.map(i => ({
              name: i.name,
              contents: i.contents,
            })));
          }
          return newState;
        });
        delete this.readers[file.name];
      };
      this.readers[file.name].onerror = (evt) => {
        delete this.readers[file.name];
        return this.props.onError(evt);
      };
      this.readers[file.name].readAsBinaryString(file);
    });
  }

  addNewFiles = files => {
    const filenames = Array.prototype.map.call(files, f => f.name);
    this.setState(state => ({
      files: state.files.concat(filenames.map(name => ({
        name,
        uploadState: 'uploading',
        contents: null,
      }))),
    }))
    this.readFileContent(files);
  };

  clearFile = filename =>
    this.setState((state) => {
      const newState = {
        files: state.files.filter(({ name }) => name !== filename),
      };
      this.props.onData(newState.files.map(i => ({
        name: i.name,
        contents: i.contents,
      })));
      return newState;
    });

  handleChange = evt => {
    evt.stopPropagation();
    this.addNewFiles(evt.target.files);
  };

  handleClick = (evt, index) => {
    const filename = this.nodes[index].innerText.trim();
    this.clearFile(filename);
  };

  render = () => {
    const { id, title, description, buttonLabel, accept, kind } = this.props;

    /*
    const linkElement = (
      <div>
        <div>
          Drag and drop you file here or
          <a style={{ cursor: 'pointer' }} onClick={() => { this.dropzone.open() }} > upload </a>
        </div>
        <div>
          {description}
        </div>
      </div>
    )
    */

    return kind === 'drag-and-drop' ? 
    (
      <div>TODO</div>
    )
    /*
    (
      <div style={{backgroundColor: "#ffffff", marginLeft: "10px",padding: "15px 0px 15px 15px"}}>
        <strong className="bx--label">{title}</strong>
        <Dropzone
          accept={accept}
          onClick={evt => evt.preventDefault()}
          onDrop={this.onDrop}
          ref={(dropzone) => { this.dropzone = dropzone }}
        >
          {
            ({ getRootProps, getInputProps, isDragActive }) => {
              return (
                <div
                  {...getRootProps()}
                  style={isDragActive ?
                    { padding: "15px", border: "1px solid #3D70B2" } :
                    { padding: "15px", border: "1px dashed #8C8C8C" }}
                >
                  <input {...getInputProps()} />
                  { linkElement }
                </div>
              )
          }}
        </Dropzone>
        <div data-file-container className="bx--file-container">
          {
            this.state.files.map((file, index) => {
              return (
                  <span id={`${index}-file-list`} class="bx--file__selected-file" style={{ backgroundColor: "rgba(85, 150, 230, .1)"}}>
                    <p class="bx--file-filename">{file.name}</p>
                    <span class="bx--file__state-container">
                      <svg id={index} class="bx--file-close" onClick={() => this.removeFile(index)} tabindex="0" viewBox="0 0 16 16" fill-rule="evenodd" width="16" height="16">
                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 10.1l-1.4 1.4L8
                          9.4l-2.1 2.1-1.4-1.4L6.6 8 4.5 5.9l1.4-1.4L8 6.6l2.1-2.1 1.4 1.4L9.4 8l2.1 2.1z"></path>
                      </svg>
                    </span>
                  </span>
              );
            })
          }
        </div>
      </div>
    )
    */
    : (
      <div id={id} className="bx--form-item">
        <strong className="bx--label">{title}</strong>
        <p className="bx--label-description">{description}</p>
        <FileUploaderButton
          labelText={buttonLabel}
          multiple
          buttonKind="primary"
          onChange={this.handleChange}
          disableLabelChanges
          accept={accept}
        />
        <div className="bx--file-container">
          {
            this.state.files.length === 0
              ? null
              : this.state.files.map(({ name, uploadState }, index) => (
                <span
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
                </span>
              )
            )
          }
        </div>
      </div>
    );
   }
};

FileDrop.propTypes = propTypes;
FileDrop.defaultProps = defaultProps;

export default FileDrop;
