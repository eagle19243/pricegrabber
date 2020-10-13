import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { defaultFont } from "assets/jss/material-dashboard-react.js";

const useStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset"
    }
  },
  table: {
    marginBottom: "0",
    width: "100%",
    maxWidth: "100%",
    backgroundColor: "transparent",
    borderSpacing: "0",
    borderCollapse: "collapse"
  },
  tableHeadCell: {
    color: "inherit",
    ...defaultFont,
    "&, &$tableCell": {
      fontSize: "1em"
    },
    textAlign: "center",
    border: "1px solid rgba(224, 224, 224, 1)",
  },
  tableCell: {
    ...defaultFont,
    lineHeight: "1.42857143",
    padding: "12px 8px",
    verticalAlign: "middle",
    fontSize: "0.8125rem",
    border: "1px solid rgba(224, 224, 224, 1)",
  },
  tableHeadRow: {
    height: "56px",
    color: "inherit",
    display: "table-row",
    outline: "none",
    verticalAlign: "middle"
  },
  tableBodyRow: {
    height: "48px",
    color: "inherit",
    display: "table-row",
    outline: "none",
    verticalAlign: "middle"
  }
});

function Row(props) {
  const { row, dateCount } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell className={classes.tableCell}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className={classes.tableCell}>{row.storeName}</TableCell>
        {[...Array(dateCount)].map(() => {
          return (
            <TableCell className={classes.tableCell} colSpan={4}></TableCell>
          );
        })}
      </TableRow>
      {open && row.prices.map((data) => (
        <TableRow key={`${row.storeName}_${data.time}`}>
          <TableCell className={classes.tableCell}></TableCell>
          <TableCell className={classes.tableCell}>{data.time}</TableCell>
          {data.data.map((value, key) => {
            return (
              <TableCell className={classes.tableCell} align="right">{value}</TableCell>
            );
          })}
        </TableRow>
      ))}
      <Collapse in={open} timeout="auto" unmountOnExit></Collapse>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    storeName: PropTypes.string.isRequired,
    prices: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.string)
      })
    ).isRequired,
  }).isRequired,
  dateCount: PropTypes.number.isRequired
};

export default function PriceTable(props) {
  const classes = useStyles();
  const { tableHead, tableData } = props;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        {tableHead !== undefined && tableHead.length > 0 ? (
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCell + " " + classes.tableHeadCell}></TableCell>
              <TableCell className={classes.tableCell + " " + classes.tableHeadCell}>{tableHead.shift()}</TableCell>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                    colSpan={4}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableCell + " " + classes.tableHeadCell}></TableCell>
              <TableCell className={classes.tableCell + " " + classes.tableHeadCell}></TableCell>
              {tableHead.map((prop, key) => {
                return [
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={`${key}_price`}
                  >
                    Price
                  </TableCell>,
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={`${key}_shipping`}
                  >
                    Shipping
                  </TableCell>,
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={`${key}_payment`}
                  >
                    Payment
                  </TableCell>,
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={`${key}_total`}
                  >
                    Total
                  </TableCell>,
                ];
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => (
            <Row key={key} row={prop} dateCount={tableHead !== undefined && tableHead.length > 0 ? tableHead.length : 0} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
