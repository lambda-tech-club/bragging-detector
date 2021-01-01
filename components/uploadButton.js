import React from "react";
import IconButton from "@material-ui/core/IconButton";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { bool, func, object } from "prop-types";

const UploadButton = (props) => (
  <div>
    <input
      accept="audio/*"
      id="file-input"
      multiple
      type="file"
      style={{ display: "none" }}
      onChange={(event) => {
        const file = event.target.files[0];
        if (!(file instanceof File)) return;
        if (file.type.indexOf("audio") === -1) {
          alert("オーディオファイルを選択してください");
          return;
        }
        props.onFileChange(file);
      }}
    />
    <label htmlFor="file-input">
      <IconButton
        color="primary"
        size="large"
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
  disabled: bool,
};

export default UploadButton;
