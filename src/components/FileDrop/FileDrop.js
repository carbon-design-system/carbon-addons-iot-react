import React from 'react';
import PropTypes from 'prop-types';
import { Filename, FileUploaderButton } from 'carbon-components-react';
import styled from 'styled-components';

import { COLORS } from '../../styles/styles';


const Span = styled.span`
  {
      background-color: rgba(85, 150, 230, .1)
  }
`;


const Link = styled.a`
   {
    color: ${COLORS.blue};
    cursor: pointer;
  }
`;

const Text = styled.div`
  {
    padding: 15px;
    line-height:30px;
    color: gray;

  }
`;

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

  fileInput = null;

  nodes = [];

  readers = {};


  constructor(props) {
    super(props);
    this.state = {
      files: [],
      hover: false,
    }
  }

  componentDidMount = () => {
    // Add the listeners for the file drop
    const dropArea = this.dropzone;
    if(dropArea){
      dropArea.addEventListener('dragover', this.fileDragHover, false);
      dropArea.addEventListener('dragleave', this.fileDragHover, false);
      dropArea.addEventListener('drop', this.fileDrop, false);
    }
  }

  /* Drag hover event */
  fileDragHover = evt => {
    evt.preventDefault();

    const rect = evt.currentTarget.getBoundingClientRect();
    const x = evt.pageX - window.pageXOffset;
    const y = evt.pageY - window.pageYOffset;

    const inArea = (!(x < rect.left || x > rect.right
      || y < rect.top || y > rect.bottom));

    this.setState({
      hover: inArea && evt.type !== 'drop',
    });
  }

  /* Drop event */
  fileDrop = evt => {
    evt.stopPropagation();

    this.fileDragHover(evt);
    const files = evt.target.files || evt.dataTransfer.files
    this.addNewFiles(files);

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
    const { id, title, description, buttonLabel, accept, kind  } = this.props;
    const { hover } = this.state;

    const dradAndDropText = 'Drag and drop you file here or '


    const linkElement = (
      <div>
        {dradAndDropText}
        <span
          onClick={() => { this.fileInput.click() }}
          role="presentation"
        >
          <Link href="javascript:void(0)">upload</Link>
        </span>
        <div>
          {description}
        </div>
      </div>
    )


    const fileNameElements = (
      <div className="bx--file-container">
        {
          this.state.files.length === 0
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
            )
          )
        }
      </div>
    )

    return kind === 'drag-and-drop' ?
    (
      <div>
        <strong className="bx--label">{title}</strong>
        <input
          style={{ visibility: 'hidden' }}
          type="file"
          ref={(ref) => this.fileInput = ref} // eslint-disable-line
          accept={accept}
          multiple
          onChange={this.handleChange}
        />
        <Text
          ref={(ref) => this.dropzone = ref} // eslint-disable-line
          style={hover ? { border: "1px solid #3D70B2" } : {  border: "1px dashed #8C8C8C"  }}
        >
          { linkElement }
        </Text>
        { fileNameElements }
      </div>
    )
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
        { fileNameElements }
      </div>
    );
   }
};

FileDrop.propTypes = propTypes;
FileDrop.defaultProps = defaultProps;

export default FileDrop;
