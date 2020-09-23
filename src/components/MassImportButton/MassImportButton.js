import React from "react";
import {useDropzone} from 'react-dropzone';
// nodejs library to set properties for components
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import UploadIcon from "@material-ui/icons/Publish";

const styles = {
  title: {
    color: "rgb(50, 75, 80)",
    fontSize: "20px",
    fontWeight: "300",
    lineHeight: "26px",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginTop: "15px",
    marginBottom: "0px",
  },
  description: {
    color: "rgb(98, 124, 129)",
    fontSize: "14px",
    fontWeight: "300",
    lineHeight: "18px",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    textTransform: "none",
    marginTop: "10px",
    marginBottom: "15px",
  },
  viewSplitClickable: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  iconUpload: {
    fontSize: "30px",
    color: "rgb(98, 124, 129)",
  },
};

const useStyles = makeStyles(styles);

export default function MassImportButton(props) {
  const classes = useStyles();
  const { onDrop, accept } = props;
  const { getRootProps, getInputProps } = useDropzone({onDrop});

  return (
    <div {...getRootProps()}>
      <input {...getInputProps({ accept: ".csv",  multiple: false })} />
      <div className={classes.viewSplitClickable}>
        <div>
          <p className={classes.title}>Import Products</p>
          <h6 className={classes.description}>
            Import mass products via csv
          </h6>
        </div>
        <div>
          <UploadIcon className={classes.iconUpload} />
        </div>
      </div>
    </div>
  );
}
