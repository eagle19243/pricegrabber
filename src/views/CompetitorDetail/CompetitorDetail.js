import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ChartistGraph from "react-chartist";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
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

import { addCompetitor, updateCompetitor, getCompetitor, getAllStoreNames } from "actions/CompetitorActions";

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

function CompetitorDetail({ dispatch, match, currentCompetitor, allStoreNames }) {
  const classes = useStyles();
  const competitorId = match.params.id;
  const [url, setUrl] = React.useState("");
  const [urlState, setUrlState] = React.useState("");
  const [storeNames, setStoreNames] = React.useState([]);
  const [isExcluded, setIsExcluded] = React.useState(false);
  const [shippingPaymentInfo, setShippingPaymentInfo] = React.useState("");
  const [skroutzUrl, setSkroutzUrl] = React.useState("");
  const [skroutzUrlState, setSkroutzUrlState] = React.useState("");
  const [lineChartData, setLineChartData] = React.useState({});
  const [pieChartData, setPieChartData] = React.useState({});
  const [seoScore, setSeoScore] = React.useState(0);
  const [accessibilityScore, setAccessibilityScore] = React.useState(0);
  const [performanceScore, setPerformanceScore] = React.useState(0);
  const [bestPracticesScore, setBestPracticesScore] = React.useState(0);
  const [pwa, setPwa] = React.useState(false);
  
  const ordinalSuffixOf = i => {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }

  React.useEffect(() => {
    dispatch(getCompetitor(competitorId));
    dispatch(getAllStoreNames());
  }, []);  

  React.useEffect(() => {
    console.log(currentCompetitor);
    if (currentCompetitor && window.location.pathname !== '/app/products/new') {
      setUrl(currentCompetitor.url);
      setStoreNames(currentCompetitor.store_names);
      setIsExcluded(currentCompetitor.is_excluded);
      setShippingPaymentInfo(currentCompetitor.shipping_payment_info);
      setSkroutzUrl(currentCompetitor.skroutz_url);

      if (validateUrl(currentCompetitor.url)) {
        setUrlState("success");
      } else {
        setUrlState("error");
      }
      
      if (validateSkroutzUrl(currentCompetitor.skroutz_url)) {
        setSkroutzUrlState("success");
      } else {
        setSkroutzUrlState("error");
      }

      if (currentCompetitor.num_products) {
        const dates = Object.keys(currentCompetitor.num_products);
        const series = [[]];
        for (const date of dates) {
          series[0].push(currentCompetitor.num_products[date]);
        }

        setLineChartData({
          labels: dates,
          series: series
        });
      }

      if (currentCompetitor.positions) {
        const positions = Object.keys(currentCompetitor.positions);
        const labels = []
        const series = [];
        let total  = 0;
        for (const position of positions) {
          total += currentCompetitor.positions[position];
        }
        for (const position of positions) {
          labels.push(`${(currentCompetitor.positions[position] * 100 / total).toFixed(1)}% ${ordinalSuffixOf(Number(position) + 1)} position`);
          series.push(currentCompetitor.positions[position]);
        }
        setPieChartData({
          labels,
          series,
        });
      }

      if (currentCompetitor.seo_score) {
        setSeoScore(currentCompetitor.seo_score);
      }
      if (currentCompetitor.accessibility_score) {
        setAccessibilityScore(currentCompetitor.accessibility_score);
      }
      if (currentCompetitor.performance_score) {
        setPerformanceScore(currentCompetitor.performance_score);
      }
      if (currentCompetitor.best_practices_score) {
        setBestPracticesScore(currentCompetitor.bestPracticesScore);
      }
      if (currentCompetitor.pwa) {
        setPwa(currentCompetitor.pwa);
      }
    }
  }, [currentCompetitor]);

  const validateUrl = value => {
    return /^(http|https):\/\/[^ "]+$/.test(value);
  }

  const validateSkroutzUrl = value => {
    return /https:\/\/www.skroutz.gr\/.*\.html/g.test(value);
  }

  const validateRequired = value => {
    if (value.length >= 1) {
      return true;
    }
    return false;
  }

  const doSave = () => {

    if (urlState === "") {
      setUrlState("error");
    }

    if (skroutzUrlState === "") {
      setSkroutzUrlState("error");
    }

    if (urlState === "success" && skroutzUrlState === "success") {
      if (competitorId) {
        dispatch(updateCompetitor(competitorId, {
          url,
          store_names: storeNames,
          is_excluded: isExcluded,
          shipping_payment_info: shippingPaymentInfo,
          skroutz_url: skroutzUrl,
          seo_score: seoScore,
          accessibility_score: accessibilityScore,
          performance_score: performanceScore,
          best_practices_score: bestPracticesScore,
          pwa,
        }));
      } else {
        dispatch(addCompetitor({
          url,
          store_names: storeNames,
          is_excluded: isExcluded,
          shipping_payment_info: shippingPaymentInfo,
          skroutz_url: skroutzUrl,
          seo_score: seoScore,
          accessibility_score: accessibilityScore,
          performance_score: performanceScore,
          best_practices_score: bestPracticesScore,
          pwa,
        }));
      }
    }
  }

  return (
    <div>
      <GridContainer>
        {(pieChartData.labels && pieChartData.labels.length > 0) && 
          <GridItem xs={12}>
            <Card chart>
              <CardHeader color="info">
                <ChartistGraph
                  className="ct-chart"
                  data={pieChartData}
                  type="Pie"
                  options={{
                    height: "300px",
                    align: "center",
                  }}
                  responsiveOptions={[[
                    'screen and (min-width: 1024px)', {
                      labelOffset: 80,
                      chartPadding: 20
                    }
                  ]]}
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                />
              </CardHeader>
            </Card>
          </GridItem>
        }
        <GridItem xs={12}>
          <Card chart>
            <CardHeader color="success">
              <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={4}>
                  <ChartistGraph
                    className="ct-chart"
                    data={lineChartData}
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
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                  <CustomInput
                    success={urlState === "success"}
                    error={urlState === "error"}
                    labelText="Store URL"
                    id="url"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (validateUrl(event.target.value)) {
                          setUrlState("success");
                        } else {
                          setUrlState("error");
                        }
                        setUrl(event.target.value)
                      },
                      value: url,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                  <CustomInput
                    success={skroutzUrlState === "success"}
                    error={skroutzUrlState === "error"}
                    labelText="Skroutz Profile URL"
                    id="skroutz_url"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (validateSkroutzUrl(event.target.value)) {
                          setSkroutzUrlState("success");
                        } else {
                          setSkroutzUrlState("error");
                        }
                        setSkroutzUrl(event.target.value)
                      },
                      value: skroutzUrl,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={8} md={6}>
                  <FormControl 
                    fullWidth
                    className={classes.selectFormControl}
                  >
                    <InputLabel
                      htmlFor="store-names"
                      className={classes.selectLabel}
                    >
                      Store names
                    </InputLabel>
                    <Select 
                      multiple
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={storeNames}
                      onChange={(event) => {
                        setStoreNames(event.target.value);
                      }}
                      inputProps={{
                        name: "storeNames",
                        id: "store-names"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Store names
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
                              selected: classes.selectMenuItemSelectedMultiple
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
                <GridItem xs={12} sm={4} md={3}>
                  <FormControl 
                    fullWidth
                    className={classes.selectFormControl}
                  >
                    <InputLabel
                      htmlFor="is-excluded"
                      className={classes.selectLabel}
                    >
                      Exclude from calculation
                    </InputLabel>
                    <Select 
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={isExcluded}
                      onChange={(event) => {
                        setIsExcluded(event.target.value);
                      }}
                      inputProps={{
                        name: "isExcluded",
                        id: "is-excluded"
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        Exclude from calculation
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={true}
                      >
                        Yes
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={false}
                      >
                        No
                      </MenuItem>
                    </Select>
                  </FormControl>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12}>
                  <CustomInput
                    labelText="Shipping & Payment Info"
                    id="shipping_payment_info"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 3, 
                      onChange: (event) => {
                        setShippingPaymentInfo(event.target.value)
                      },
                      value: shippingPaymentInfo,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={6} md={4}>
                  <CustomInput
                    labelText="Seo Score"
                    id="seo_score"
                    align="right"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        setSeoScore(event.target.value)
                      },
                      value: seoScore,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                  <CustomInput
                    labelText="Accessibility Score"
                    id="accessibility_score"
                    align="right"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        setAccessibilityScore(event.target.value)
                      },
                      value: accessibilityScore,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                  <CustomInput
                    labelText="Performance Score"
                    id="performance_score"
                    align="right"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        setPerformanceScore(event.target.value)
                      },
                      value: performanceScore,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                  <CustomInput
                    labelText="Best Practices Score"
                    id="best_practices_score"
                    align="right"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        setBestPracticesScore(event.target.value)
                      },
                      value: bestPracticesScore,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                  <FormControl 
                    fullWidth
                    className={classes.selectFormControl}
                  >
                    <InputLabel
                      htmlFor="pwa"
                      className={classes.selectLabel}
                    >
                      PWA
                    </InputLabel>
                    <Select 
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={pwa}
                      onChange={(event) => {
                        setPwa(event.target.value);
                      }}
                      inputProps={{
                        name: "pwa",
                        id: "pwa"
                      }}
                    >
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={true}
                      >
                        Yes
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value={false}
                      >
                        No
                      </MenuItem>
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

const mapStateToProps = ({ competitor }) => {
  const { currentCompetitor, allStoreNames } = competitor;
  return {
    currentCompetitor,
    allStoreNames,
  }
}

export default withRouter(connect(mapStateToProps)(CompetitorDetail));
