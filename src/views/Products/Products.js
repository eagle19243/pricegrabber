import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { push } from "connected-react-router";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import ProductTable from "components/ProductTable/ProductTable";
import { getProduct, removeProduct } from "actions/ProductActions";

function Products({dispatch, tableData}) {
  React.useEffect(() => {
    dispatch(getProduct());
  }, []);

  const tableColumns = [
    {title: "Code", field: "code"},
    {title: "URL", field: "url"},
    {title: 'Cost', field: 'cost'},
    {title: 'Profit', field: 'profit'}
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
