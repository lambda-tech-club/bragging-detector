import React from "react";
import IconButton from "@material-ui/core/IconButton";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { bool, func, string } from "prop-types";

const UploadButton = props => (
  <div>
    <input
      accept={`${props.fileType}/*`}
      id="file-input"
      multiple
      type="file"
      style={{ display: "none" }}
      onChange={event => {
        const file = event.target.files[0];
        if (!(file instanceof File)) return;
        if (file.type.indexOf(props.fileType) === -1) {
          props.onInvalidFileError();
          return;
        }
        props.onFileChange(file);
      }}
    />
    <label htmlFor="file-input">
      <IconButton
        color="primary"
        size="medium"
        disabled={props.disabled}
        aria-label="upload audio"
        component="span"
      >
        <LibraryMusicIcon />
      </IconButton>
    </label>
  </div>
);

UploadButton.propTypes = {
  onFileChange: func,
  onInvalidFileError: func,
  fileType: string,
  disabled: bool
};

export default UploadButton;
