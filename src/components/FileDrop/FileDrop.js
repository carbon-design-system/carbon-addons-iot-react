import React from 'react';
import PropTypes from 'prop-types';
import { FileUploader as CarbonFileUploader } from 'carbon-components-react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

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


const propTypes = {
  /** Title text  */
  title: PropTypes.string.isRequired,
  /** Description text of file uploader */
  description: PropTypes.string.isRequired,
  /** Button label  */
  buttonLabel: PropTypes.string,
  /** Files that are accept */
  acceptFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Componet is drag/drop */
  dragDrop: PropTypes.bool,
  /** Callback to return the files data */
  onData: PropTypes.func,
};

const defaultProps = {
  buttonLabel: 'Add files',
  dragDrop: false,
  onData: () => {}
};

/**
 * Carbon File Uploader with added ability to have drag drop
 */
class FileDrop extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      files: []
    }
  }

  readFileContent = (acceptedFiles) => {
    const { onData } = this.props;

    const uploadedContent = [];

    Array.from(acceptedFiles).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        uploadedContent.push({ content: reader.result, name:file.name})
        if(acceptedFiles.length-1 === index) {
          onData(uploadedContent)
        }
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });

    if(acceptedFiles.length === 0){
      onData(uploadedContent)
    }
  }


  onChangeFile = (evt) => {
    console.log('On Change file function of FileUploader!!!')
    const inputFiles = evt.target.files
    this.readFileContent(inputFiles)
  }

  onClickFile = (evt) => {
    console.log('On Click file function of FileUploader!!!')
    console.log(document.querySelector("input[type='file']").files)
    // console.log(evt.target)
    // this.readFileContent(inputFiles)

  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.addFiles(acceptedFiles)
    this.readFileContent(acceptedFiles)
   }

   removeFile = (index) => {
     const { files } = this.state
     files.splice(index, 1)
     this.readFileContent(files)
     this.setState({ files })
   }

   addFiles = (aceptedFiles) => {
     this.setState({ files: aceptedFiles })
   }


   render = () => {
     const { title, description, buttonLabel, acceptFiles, dragDrop } = this.props;

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

     return dragDrop ? (
       <div style={{backgroundColor: "#ffffff", marginLeft: "10px",padding: "15px 0px 15px 15px"}}>
         <strong className="bx--label">{title}</strong>
         <Dropzone
           accept={acceptFiles}
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
     ) :
     (
       <div>
         <StyledFileUploader
           id="file-uploader"
           labelTitle={title}
           labelDescription={description}
           buttonLabel={buttonLabel}
           filenameStatus="edit"
           accept={acceptFiles}
           name=""
           onChange={(evt) => this.onChangeFile(evt)}
           onClick={(evt) => this.onClickFile(evt)}
           multiple
         />
       </div>
     );
   }
};

FileDrop.propTypes = propTypes;
FileDrop.defaultProps = defaultProps;

export default FileDrop;
