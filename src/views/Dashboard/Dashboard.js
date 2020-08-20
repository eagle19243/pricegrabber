import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Box from "@material-ui/core/Box";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import { getProductCount } from "actions/ProductActions";
import { getConfig } from "actions/ConfigurationActions";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

function Dashboard({dispatch, productCount, lastRunTime}) {
  const classes = useStyles();
  const [count, setCount] = React.useState(0);
  const [lastTime, setLastTime] = React.useState(null);

  React.useEffect(() => {
    dispatch(getProductCount());
    dispatch(getConfig());
  }, []); 
  React.useEffect(() => {
    setCount(productCount);
    setLastTime(lastRunTime);
  }, [productCount, lastRunTime]);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_paste</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total products</p>
              <h3 className={classes.cardTitle}>
                {count}
              </h3>
            </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Icon>access_time</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Last run time</p>
              <h3 className={classes.cardTitle}>
                {lastTime ? moment(lastTime).local().format('MM/DD/YYYY HH:mm:ss') : ""}
              </h3>
            </CardHeader>
          </Card>
        </GridItem>
      </GridContainer>
      <Box display="none">
        <GridContainer>
          <GridItem xs={12}>
            <Card chart>
              <CardHeader color="info">
                <ChartistGraph
                  className="ct-chart"
                  data={{ series: [20, 10, 30, 40] }}
                  type="Pie"
                  options={{
                    width: "300px",
                    height: "300px",
                    align: "center",
                    labelInterpolationFnc: function(value) {
                      return value + "%";
                    }  
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Daily Sales</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                  increase in today sales.
                </p>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Box>
    </div>
  );
}

const mapStateToProps = ({ product, configuration }) => {
  const { productCount } = product;
  const { lastRunTime } = configuration;
  return {
    productCount: productCount,
    lastRunTime: lastRunTime
  }
}

export default withRouter(connect(mapStateToProps)(Dashboard));
