import React from "react";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { bool, func, array, string } from "prop-types";

const TagField = props => (
  <Autocomplete
    disabled={props.disabled}
    multiple
    id="tags-filled"
    options={props.options}
    freeSolo
    defaultValue={props.defaultValue}
    onChange={(event, values) => {
      props.onTagChange(values);
    }}
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
      ))
    }
    renderInput={params => {
      return (
        <TextField
          {...params}
          variant="outlined"
          label={props.label}
          placeholder={props.placeholder}
        />
      );
    }}
  />
);

TagField.propTypes = {
  options: array,
  defaultValue: array,
  disabled: bool,
  onTagChange: func,
  label: string,
  placeholder: string
};

export default TagField;
