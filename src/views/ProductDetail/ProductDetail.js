import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Rating from "@material-ui/lab/Rating";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CardIcon from "components/Card/CardIcon.js";

import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb
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
  card: {
    minHeight: "150px"
  },
  cardFooter: {
    justifyContent: "flex-end"
  }
};

const useStyles = makeStyles(styles);

export default function Settings() {
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={6} md={4}>
                  <CustomInput
                    labelText="Code"
                    id="code"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                  <CustomInput
                    labelText="Product URL"
                    id="url"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3}>
                  <CustomInput
                    labelText="Cost"
                    id="cost"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <CustomInput
                    labelText="Profit"
                    id="profit"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary">Save</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                  <Card className={classes.card}>
                    <CardHeader color="warning" stats icon>
                      <CardIcon color="warning">
                        <Icon>content_paste</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>Product Name</p>
                      <h4 className={classes.cardTitle}>
                        Sumsung
                      </h4>
                    </CardHeader>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                  <Card className={classes.card}>
                    <CardHeader color="success" stats icon>
                      <CardIcon color="success">
                        <Icon>access_time</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>Last Time Updated</p>
                      <h4 className={classes.cardTitle}>08/05/2020 03:36 PM</h4>
                    </CardHeader>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                  <Card className={classes.card}>
                    <CardHeader color="info" stats icon>
                      <CardIcon color="info">
                        <Icon>access_time</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>Reviews</p>
                      <h4 className={classes.cardTitle}>12</h4>
                    </CardHeader>
                    <CardFooter className={classes.cardFooter}>
                      <Rating name="rating" value={4} size="large" readOnly/>
                    </CardFooter>
                  </Card>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
