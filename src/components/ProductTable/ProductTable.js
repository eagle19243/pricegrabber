import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from 'material-table';
import {
  warningColor,
  primaryColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor
} from "assets/jss/material-dashboard-react.js";

const styles = {
  warningTableHeader: {
    color: warningColor[0]
  },
  primaryTableHeader: {
    color: primaryColor[0]
  },
  dangerTableHeader: {
    color: dangerColor[0]
  },
  successTableHeader: {
    color: successColor[0]
  },
  infoTableHeader: {
    color: infoColor[0]
  },
  roseTableHeader: {
    color: roseColor[0]
  },
  grayTableHeader: {
    color: grayColor[0]
  },
}
const useStyles = makeStyles(styles);

export default function ProductTable(props) {
  const classes = useStyles();
  const {
    title, 
    tableColumns, 
    tableData, 
    tableHeaderColor, 
    ...rest 
  } = props;
  return (
    <div className={classes.tableResponsive}>
      <MaterialTable
        title={title}
        columns={tableColumns}
        data={tableData}
        options={{
          headerStyle: {
            backgroundColor: classes[tableHeaderColor + 'TableHeader'].color
          },
          actionsColumnIndex: -1,
          pageSizeOptions: [20, 50, 100, 200],
          pageSize: 50,
        }} 
        {...rest}
      />
    </div>
  );
}

ProductTable.defaultProps = {
  tableHeaderColor: "gray"
};

ProductTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableColumns: PropTypes.arrayOf(PropTypes.object),
  tableData: PropTypes.arrayOf(PropTypes.object)
};
