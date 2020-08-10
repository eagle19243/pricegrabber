import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import ProductTable from "components/ProductTable/ProductTable";

export default function Products() {
  const tableColumns = [
    {title: "Name", field: "name"},
    {title: "Surename", field: "surname"},
    {title: 'Birth Year', field: 'birthYear', type: 'numeric'},
    {
      title: 'Birth Place',
      field: 'birthCity',
      lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
    }
  ];
  const tableData = [
    { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
    {
      name: 'Zerya Betül',
      surname: 'Baran',
      birthYear: 2017,
      birthCity: 34,
    },
  ];

  const onAddProduct = (event) => {
    window.location.pathname = '/admin/products/new';
  };

  const onEditProduct = (event, data) => {
    window.location.pathname = '/admin/products/123';
  };

  const onRemoveProduct = (event, data) => {

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
