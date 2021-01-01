import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { bool, node, string, func } from "prop-types";

const Notice = props => (
  <Snackbar open={props.open} autoHideDuration={6000} onClose={props.onClose}>
    <MuiAlert
      elevation={6}
      variant="filled"
      onClose={props.onClose}
      severity={props.severity}
    >
      {props.children}
    </MuiAlert>
  </Snackbar>
);

Notice.propTypes = {
  open: bool,
  severity: string,
  onClose: func,
  children: node
};

export default Notice;
