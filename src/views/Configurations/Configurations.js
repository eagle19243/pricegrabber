import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { getConfig, updateConfig } from "actions/ConfigurationActions";

function Configurations({dispatch, interval}) {
  const [hours, setHours] = React.useState(2);
  const [hourState, setHourState] = React.useState("");

  React.useEffect(() => {
    dispatch(getConfig());
  }, []); 
  React.useEffect(() => {
    setHours(interval);
  }, [interval]);

  const validateHours = value => {
    if (value > 0) {
      return true;
    }
    return false;
  }

  const doSave = () => {
    if (hourState === "") {
      setHourState("error");
    }
    console.log(typeof(hours));
    if (hourState === "success") {
      dispatch(updateConfig({
        interval: hours
      }));
    }
  }
  
  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={3} md={2}>
                  <CustomInput
                    success={hourState === "success"}
                    error={hourState === "error"}
                    labelText="Interval"
                    id="interval"
                    align="right"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: (event) => {
                        if (validateHours(event.target.value)) {
                          setHourState("success");
                        } else {
                          setHourState("error");
                        }
                        setHours(Number(event.target.value));
                      },
                      type: "number",
                      value: hours
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
      </GridContainer>
    </div>
  );
}

const mapStateToProps = ({ configuration }) => {
  const { interval } = configuration;
  return {
    interval: interval
  }
}

export default withRouter(connect(mapStateToProps)(Configurations));
