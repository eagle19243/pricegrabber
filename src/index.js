import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { routerMiddleware, ConnectedRouter } from "connected-react-router";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import createRootReducer from "reducers";
import { doInit } from "actions/AuthActions";

// core components
import Admin from "layouts/Admin.js";
import Login from "views/Login/Login";
import { UserRoute, AuthRoute } from "routes.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";

const history = createBrowserHistory();

export const store = createStore(
  createRootReducer(history),
  compose(
    applyMiddleware(
      routerMiddleware(history),
      ReduxThunk
    ),
  )
);

store.dispatch(doInit());

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <UserRoute path="/app" dispatch={store.dispatch} component={Admin} />
        <AuthRoute path="/login" exact component={Login} />
        <Redirect from="/" to="/app/dashboard" />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
