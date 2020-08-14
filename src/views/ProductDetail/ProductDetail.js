import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
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

import { addProduct, updateProduct, getProduct } from "actions/ProductActions";

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
  card: {
    minHeight: "150px"
  },
  cardFooter: {
    justifyContent: "flex-end"
  }
};

const useStyles = makeStyles(styles);

function ProductDetail({ dispatch, match, currentProduct }) {
  const classes = useStyles();
  const productId = match.params.id;
  const [code, setCode] = React.useState("");
  const [codeState, setCodeState] = React.useState("");
  const [url, seturl] = React.useState("");
  const [urlState, seturlState] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [profit, setProfit] = React.useState("");

  React.useEffect(() => {
    dispatch(getProduct(productId));
  }, []);  
  React.useEffect(() => {
    if (currentProduct) {
      setCode(currentProduct.code);
      seturl(currentProduct.url);
      setCost(currentProduct.cost);
      setProfit(currentProduct.profit);
    }
  }, [currentProduct]);

  const validateURL = value => {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  }

  const validateRequired = value => {
    if (value.length >= 1) {
      return true;
    }
    return false;
  }

  const doSave = () => {
    if (codeState === "") {
      setCodeState("error");
    }

    if (urlState === "") {
      seturlState("error");
    }

    if (codeState === "success" && urlState === "success") {
      if (productId) {
        dispatch(updateProduct(productId, {
          code: code,
          url: url,
          cost: Number(cost),
          profit: Number(profit)
        }));
      } else {
        dispatch(addProduct({
          code: code,
          url: url,
          cost: Number(cost),
          profit: Number(profit)
        }));
      }
    }
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={6} md={4}>
                  <CustomInput
                    success={codeState === "success"} 
                    error={codeState === "error"}
                    labelText="Code"
                    id="code"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (validateRequired(event.target.value)) {
                          setCodeState("success");
                        } else {
                          setCodeState("error");
                        }
                        setCode(event.target.value)
                      },
                      value: code
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                  <CustomInput
                    success={urlState === "success"}
                    error={urlState === "error"}
                    labelText="Product URL"
                    id="url"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (validateURL(event.target.value)) {
                          seturlState("success");
                        } else {
                          seturlState("error");
                        }
                        seturl(event.target.value)
                      },
                      value: url
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
                    inputProps={{
                      onChange: (event) => setCost(event.target.value),
                      value: cost
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
                    inputProps={{
                      onChange: (event) => setProfit(event.target.value),
                      value: profit
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={doSave}>Save</Button>
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

const mapStateToProps = ({ product }) => {
  const { currentProduct } = product;
  return {
    currentProduct: currentProduct,
  }
}

export default withRouter(connect(mapStateToProps)(ProductDetail));
