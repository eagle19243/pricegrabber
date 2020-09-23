import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import MassImportButton from "components/MassImportButton/MassImportButton";
import { importMassProducts } from "actions/ToolActions";

function Tools({dispatch}) {

  const onDrop = (files) => {
    console.log('file', files[0]);
    dispatch(importMassProducts(files[0]))
  }
  
  return (
    <div>
      <GridContainer justify="center">
        <GridItem sm={12} md={8}>
          <Card>
            <CardBody>
              <MassImportButton 
                onDrop={onDrop}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default withRouter(connect()(Tools));
