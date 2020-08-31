import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { push } from "connected-react-router";
import moment from "moment";
// @material-ui/core components
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import ProductTable from "components/ProductTable/ProductTable";
import { getProduct, removeProduct } from "actions/ProductActions";

function Products({dispatch, tableData}) {
  const [filterErrored, setFilterErrored] = React.useState(false);
  const [filterUpdated, setFilterUpdated] = React.useState(false);

  React.useEffect(() => {
    dispatch(getProduct());
  }, []);

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
      console.log(data.updated);
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
      <GridItem xs={12} sm={6} md={6}>
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
      </GridItem>
      <GridItem xs={12} sm={6} md={6}>
        <Button color="primary" onClick={doFilter} style={{float: "right"}}>Apply Filter</Button>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardBody>
            <ProductTable
              title={""}
              tableHeaderColor="primary"
              tableColumns={tableColumns}
              tableData={tableData} 
              actions={actions}
            />
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
