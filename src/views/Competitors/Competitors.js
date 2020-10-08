import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { push } from "connected-react-router";
import moment from "moment";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Icon from "@material-ui/core/Icon";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import DataTable from "components/DataTable/DataTable";
import { getCompetitor, removeCompetitor } from "actions/CompetitorActions";
import {
  grayColor,
} from "assets/jss/material-dashboard-react.js";

const styles = {
  cardCategory: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "30px !important",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
};
const useStyles = makeStyles(styles);

function Competitors({dispatch, tableData}) {
  const classes = useStyles();

  React.useEffect(() => {
    dispatch(getCompetitor());
  }, []);

  const tableColumns = [
    {title: 'Name', field: 'url', width: 20},
    {title: 'Store names', field: 'store_names'},
    {title: 'Exclude', field: 'is_excluded', width: 10, render: data => {
      if (data === true) {
        return 'Yes';
      }
      return 'No';
    }},
    {title: 'No.of products', field: 'num_products', width: 10},
  ];

  const onAddCompetitor = (event) => {
    dispatch(push('/app/competitors/new'));
  };

  const onEditCompetitor = (event, data) => {
    dispatch(push(`/app/competitors/${data._id}`));
  };

  const onRemoveCompetitor = (event, data) => {
    dispatch(removeCompetitor(data._id));
  };

  const actions=[
    {
      icon: 'add',
      tooltip: 'Add',
      isFreeAction: true,
      onClick: onAddCompetitor
    },
    {
      icon: 'edit',
      tooltip: 'View/Edit',
      onClick: onEditCompetitor
    },
    {
      icon: 'delete',
      tooltip: 'Remove',
      onClick: onRemoveCompetitor
    }
  ];

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <DataTable
                  title={""}
                  tableHeaderColor="primary"
                  tableColumns={tableColumns}
                  tableData={tableData}
                  pageSize={10} 
                  pageSizeOptions={[10, 20, 50, 100]} 
                  actions={actions}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

const mapStateToProps = ({ competitor }) => {
  const { tableData } = competitor;
  return {
    tableData,
  }
}

export default withRouter(connect(mapStateToProps)(Competitors));
