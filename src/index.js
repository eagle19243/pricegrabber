import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import createRootReducer from "reducers";
import { doInit } from "actions/AuthActions";

// core components
import App from "App.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";

const history = createBrowserHistory();

export const getHistory = () => {
  return history;
}

export const store = createStore(
  createRootReducer(history),
  compose(applyMiddleware(routerMiddleware(history), ReduxThunk))
);

const { dispatch } = store;
dispatch(doInit());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
