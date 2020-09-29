import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { push } from "connected-react-router";
import moment from "moment";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Icon from "@material-ui/core/Icon";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import ProductTable from "components/ProductTable/ProductTable";
import { getProduct, removeProduct } from "actions/ProductActions";
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

function Products({dispatch, tableData}) {
  const classes = useStyles();
  const [filterErrored, setFilterErrored] = React.useState(false);
  const [filterUpdated, setFilterUpdated] = React.useState(false);
  const [countErrored, setCountErrored] = React.useState(0);
  const [countUpdated, setCountUpdated] = React.useState(0);

  React.useEffect(() => {
    dispatch(getProduct());
  }, []);

  React.useEffect(() => {
    for (const product of tableData) {
      if (product.is_errored) {
        setCountErrored(countErrored++);
      }
      if (product.is_updated) {
        setCountUpdated(countUpdated++);
      }
    }
  }, [tableData]);

  const tableColumns = [
    {title: 'Code', field: 'code', width: 20},
    {title: 'URL', field: 'url'},
    {title: 'Cost', field: 'cost', width: 10},
    {title: 'Profit', field: 'profit', width: 10},
    {title: 'Last min price', field: 'price', width: 20, render: data => {
      if (!data.price) return '';

      const keys = Object.keys(data.price);
      return keys.length > 0 ? data.price[keys[keys.length - 1]] : '';
    }},
    {title: 'Last updated date', field: 'updated', width: 20, render: data => {
      return data.updated ? moment.utc(data.updated).local().format('MM/DD/YYYY HH:mm:ss') : '';
    }},
    {title: 'Error', field: 'error', width: 10},
  ];

  const onAddProduct = (event) => {
    dispatch(push('/app/products/new'));
  };

  const onEditProduct = (event, data) => {
    dispatch(push(`/app/products/${data._id}`));
  };

  const onRemoveProduct = (event, data) => {
    dispatch(removeProduct(data._id));
  };

  const doFilter = () => {
    dispatch(getProduct(null, filterErrored, filterUpdated));
  };

  const actions=[
    {
      icon: 'add',
      tooltip: 'Add',
      isFreeAction: true,
      onClick: onAddProduct
    },
    {
      icon: 'edit',
      tooltip: 'View/Edit',
      onClick: onEditProduct
    },
    {
      icon: 'delete',
      tooltip: 'Remove',
      onClick: onRemoveProduct
    }
  ];

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader color="success" stats icon>
            <CardIcon color="success">
              <Icon>sync</Icon>
            </CardIcon>
            <p className={classes.cardCategory}>Products Updated</p>
            <h3 className={classes.cardTitle}>
              {countUpdated} products/{tableData.length === 0 ? 0 : countUpdated/tableData.length}% of products
            </h3>
          </CardHeader>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader color="danger" stats icon>
            <CardIcon color="danger">
              <Icon>error</Icon>
            </CardIcon>
            <p className={classes.cardCategory}>Products Errored</p>
            <h3 className={classes.cardTitle}>
              {countErrored} products/{tableData.length === 0 ? 0 : countErrored/tableData.length}% of products
            </h3>
          </CardHeader>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={8}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormControlLabel 
                      control={
                        <Checkbox
                          checked={filterErrored}
                          onChange={(event) => setFilterErrored(event.target.checked)}
                          color="primary"
                        />
                      }
                      label="Products with issue on updating"
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormControlLabel 
                      control={
                        <Checkbox
                          checked={filterUpdated}
                          onChange={(event) => setFilterUpdated(event.target.checked)}
                          color="primary"
                        />
                      }
                      label="Products updated"
                    />
                  </GridItem>
                </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <Button color="primary" 
                  onClick={doFilter} 
                  style={{float: "right", textTransform: "capitalize"}}>
                  Apply Filter
                </Button>
              </GridItem>
              <GridItem xs={12}>
                <ProductTable
                  title={""}
                  tableHeaderColor="primary"
                  tableColumns={tableColumns}
                  tableData={tableData} 
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

const mapStateToProps = ({ product }) => {
  const { tableData } = product;
  return {
    tableData: tableData
  }
}

export default withRouter(connect(mapStateToProps)(Products));
