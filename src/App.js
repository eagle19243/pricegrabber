import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Admin from "layouts/Admin.js";
import Login from "views/Login/Login";
import { getHistory } from "index.js";
import { UserRoute, AuthRoute } from "routes.js";
import { hideAlert } from "actions/AppActions";

import styles from "assets/jss/material-dashboard-react/layouts/appStyle";

const useStyles = makeStyles(styles);

function App({dispatch, isFetching, alertMessage, alertType, shouldShowAlert, ...rest }) {
  const classes = useStyles();

  return (
    <div>
      <ConnectedRouter history={getHistory()}>
        <Switch>
          <UserRoute path="/app" dispatch={dispatch} component={Admin} />
          <AuthRoute path="/login" exact component={Login} />
          <Redirect from="/" to="/app/dashboard" />
        </Switch>
      </ConnectedRouter>
      <Backdrop className={classes.backdrop} open={isFetching}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar 
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={shouldShowAlert} 
        autoHideDuration={6000} 
        onClose={() => { dispatch(hideAlert()) }}>
        <Alert 
          className={classes.alert} 
          severity={alertType} 
          elevation={6} 
          variant="filled" 
          onClose={() => {dispatch(hideAlert())}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

const mapStateToProps = ({ app }) => {
  const { isFetching, alertMessage, alertType, shouldShowAlert } = app;
  return {
    isFetching: isFetching,
    alertMessage: alertMessage,
    alertType: alertType,
    shouldShowAlert: shouldShowAlert
  }
}

export default connect(mapStateToProps)(App);
