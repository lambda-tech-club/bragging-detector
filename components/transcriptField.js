import React from "react";
import { bool, string } from "prop-types";

const TranscriptField = props => (
  <p>
    {props.finalText}
    <span style={{ color: props.isMatch ? "#f00" : "#aaa" }}>
      {props.transcript}
    </span>
  </p>
);

TranscriptField.propTypes = {
  isMatch: bool,
  finalText: string,
  transcript: string
};

export default TranscriptField;
