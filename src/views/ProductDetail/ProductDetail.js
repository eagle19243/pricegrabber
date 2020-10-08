import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import ChartistGraph from "react-chartist";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Rating from "@material-ui/lab/Rating";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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
import Table from "components/Table/Table.js";

import { addProduct, updateProduct, getProduct } from "actions/ProductActions";
import { getAllStoreNames } from "actions/CompetitorActions";

import {
  grayColor,
} from "assets/jss/material-dashboard-react.js";
import customSelectStyle from "assets/jss/material-dashboard-react/customSelectStyle";

const styles = {
  ...customSelectStyle,
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
  },
};

const useStyles = makeStyles(styles);

function ProductDetail({ dispatch, match, currentProduct, allStoreNames }) {
  const classes = useStyles();
  const productId = match.params.id;
  const [code, setCode] = React.useState("");
  const [codeState, setCodeState] = React.useState("");
  const [url, seturl] = React.useState("");
  const [urlState, seturlState] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [costState, setCostState] = React.useState("");
  const [profit, setProfit] = React.useState("");
  const [profitState, setProfitState] = React.useState("");
  const [rule, setRule] = React.useState(0);
  const [competitorExclude, setCompetitorExclude] = React.useState(0);
  const [name, setName] = React.useState("");
  const [lastTimeUpdated, setLastTimeUpdated] = React.useState(null)
  const [reviewCount, setReviewCount] = React.useState(0);
  const [reviewRating, setReviewRating] = React.useState(0);
  const [tableHead, setTableHead] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [chartData, setChartData] = React.useState({})

  React.useEffect(() => {
    dispatch(getProduct(productId));
    dispatch(getAllStoreNames());
  }, []);  
  React.useEffect(() => {
    if (currentProduct && window.location.pathname !== '/app/products/new') {
      setCode(currentProduct.code);
      seturl(currentProduct.url);
      setCost(currentProduct.cost);
      setProfit(currentProduct.profit);

      if (validateRequired(currentProduct.code)) {
        setCodeState("success");
      } else {
        setCodeState("error");
      }

      if (validateSkroutzURL(currentProduct.url)) {
        seturlState("success");
      } else {
        seturlState("error");
      }

      if (validateFloat(currentProduct.cost)) {
        setCostState("success");
      } else {
        setCostState("error");
      }

      if (validateFloat(currentProduct.profit)) {
        setProfitState("success");
      } else {
        setProfitState("error");
      }

      setName(currentProduct.name);
      setLastTimeUpdated(currentProduct.updated);
      setReviewCount(currentProduct.review_count);
      setReviewRating(currentProduct.review_rating);
      console.log(currentProduct);
      if (currentProduct.competitors && Object.keys(currentProduct.competitors).length > 0) {
        const rowData = [];
        const columnData = [];
        const competitors = Object.keys(currentProduct.competitors);
        
        for (const competitor of competitors) {
          const data = [competitor];
          for (const date in currentProduct.competitors[competitor]) {
            if (!columnData.includes(date)) {
              columnData.push(date);
            }
            data.push(currentProduct.competitors[competitor][date]);
          }
          rowData.push(data);
        }

        columnData.sort();
        setTableData(rowData);
        setTableHead(['Shop'].concat(columnData));
      }

      if (currentProduct.price) {
        const dates = Object.keys(currentProduct.price);
        const series = [[]];
        for (const date of dates) {
          series[0].push(currentProduct.price[date]);
        }

        setChartData({
          labels: dates,
          series: series
        });
      }
    }
  }, [currentProduct]);

  const validateSkroutzURL = value => {
    return /https:\/\/www.skroutz.gr\/.*\.html/g.test(value);
  }

  const validateRequired = value => {
    if (value.length >= 1) {
      return true;
    }
    return false;
  }

  const validateFloat = value => {
    return /^-?\d*(\.\d+)?$/g.test(value);
  }

  const doSave = () => {
    if (codeState === "") {
      setCodeState("error");
    }

    if (urlState === "") {
      seturlState("error");
    }

    if (costState === "") {
      setCostState("error");
    }

    if (profitState === "") {
      setProfitState("error");
    }

    if (codeState === "success" && urlState === "success" && costState === "success" && profitState === "success") {
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
        { currentProduct && currentProduct.name && currentProduct.updated && currentProduct.review_rating &&
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
                        {name}
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
                      <h4 className={classes.cardTitle}>
                        {lastTimeUpdated ? moment.utc(lastTimeUpdated).local().format('MM/DD/YYYY HH:mm:ss') : ""}
                      </h4>
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
                      <h4 className={classes.cardTitle}>{reviewCount}</h4>
                    </CardHeader>
                    <CardFooter className={classes.cardFooter}>
                      <Rating name="rating" value={reviewRating} size="large" readOnly/>
                    </CardFooter>
                  </Card>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        }
        { currentProduct && currentProduct.competitors && Object.keys(currentProduct.competitors).length > 0 &&
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <Table
                    tableHeaderColor="primary"
                    tableHead={tableHead}
                    tableData={tableData}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        }
        { currentProduct && currentProduct.price &&
        <GridItem xs={12}>
          <Card chart>
            <CardHeader color="success">
              <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                  <ChartistGraph
                    className="ct-chart"
                    data={chartData}
                    type="Line"
                    options={{
                      lineSmooth: window.Chartist.Interpolation.cardinal({
                        tension: 0
                      }),
                      low: 0,
                      high: 2000, 
                      chartPadding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                      },
                      plugins: [
                        window.Chartist.plugins.tooltip()
                      ],
                    }}
                    listener={{
                      draw: function(data) {
                        if (data.type === "line" || data.type === "area") {
                          data.element.animate({
                            d: {
                              begin: 600,
                              dur: 700,
                              from: data.path
                                .clone()
                                .scale(1, 0)
                                .translate(0, data.chartRect.height())
                                .stringify(),
                              to: data.path.clone().stringify(),
                              easing: window.Chartist.Svg.Easing.easeOutQuint
                            }
                          });
                        } else if (data.type === "point") {
                          data.element.animate({
                            opacity: {
                              begin: (data.index + 1) * 80,
                              dur: 500,
                              from: 0,
                              to: 1,
                              easing: "ease"
                            }
                          });
                        }
                      }
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardHeader>
          </Card>
        </GridItem>
        }
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
                        if (validateSkroutzURL(event.target.value)) {
                          seturlState("success");
                        } else {
                          seturlState("error");
                        }
                        seturl(event.target.value)
                      },
                      value: url,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={3} md={2}>
                  <CustomInput
                    success={costState === "success"}
                    error={costState === "error"}
                    labelText="Cost"
                    id="cost"
                    align="right"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (validateFloat(event.target.value)) {
                          setCostState("success");
                        } else {
                          setCostState("error");
                        }
                        setCost(event.target.value)
                      },
                      value: cost,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3} md={2}>
                  <CustomInput
                    success={profitState === "success"}
                    error={profitState === "error"}
                    labelText="Profit"
                    id="profit"
                    align="right"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (validateFloat(event.target.value)) {
                          setProfitState("success");
                        } else {
                          setProfitState("error");
                        }
                        setProfit(event.target.value);
                      },
                      value: profit
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={6} md={4}>
                  <FormControl 
                    fullWidth
                    className={classes.selectFormControl}
                  >
                    <InputLabel
                      htmlFor="select-rule"
                      className={classes.selectLabel}
                    >
                      Choose a Rule
                    </InputLabel>
                    <Select 
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={rule}
                      onChange={(event) => {
                        setRule(event.target.value)
                      }}
                      inputProps={{
                        name: "selectRule",
                        id: "select-rule"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose a Rule
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="0"
                      >
                        No touch
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="1"
                      >
                        Set price (-+)percent/exact amount of min. Price
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="2"
                      >
                        Set price according to position
                      </MenuItem>
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                  <FormControl 
                    fullWidth
                    className={classes.selectFormControl}
                  >
                    <InputLabel
                      htmlFor="select-competitor"
                      className={classes.selectLabel}
                    >
                      Choose a Manufacture
                    </InputLabel>
                    <Select 
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={competitorExclude}
                      onChange={(event) => {
                        setCompetitorExclude(event.target.value)
                      }}
                      inputProps={{
                        name: "selectCompetitor",
                        id: "select-competitor"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Choose a Manufacture
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="0"
                      >
                        None
                      </MenuItem>
                      {
                        allStoreNames
                        .sort((a, b) => 
                          (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
                        )
                        .map(store => (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value={store.name}
                            key={store._id}
                          >
                            {store.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={doSave}>Save</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

const mapStateToProps = ({ product, competitor }) => {
  const { currentProduct } = product;
  const { allStoreNames } = competitor
  return {
    currentProduct,
    allStoreNames,
  }
}

export default withRouter(connect(mapStateToProps)(ProductDetail));
