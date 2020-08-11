import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Settings from "@material-ui/icons/Settings";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import SettingsPage from "views/Settings/Settings.js";
import ProductsPage from "views/Products/Products.js";
import { isAuthenticated, logout } from "actions/AuthActions";

export const Routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/app"
  },
  {
    path: "/products",
    name: "Products",
    icon: "content_paste",
    component: ProductsPage,
    layout: "/app"
  },
  {
    path: "/settings",
    name: "Settings",
    icon: Settings,
    component: SettingsPage,
    layout: "/app"
  }
];

export const UserRoute = ({dispatch, component, ...rest}) => {
  if (!isAuthenticated()) {
    dispatch(logout());
    return (<Redirect to="/login" />);
  } else {
    return (
      <Route {...rest} render={props => (React.createElement(component, props))} />
    )
  }
}

export const AuthRoute = ({dispatch, component, ...rest}) => {
  const { from } = rest.location.state || { from: {pathname: '/app'} };

  if (isAuthenticated()) {
    return (
      <Redirect to={from} />
    );
  } else {
    return (
      <Route {...rest} render={props => React.createElement(component, props)} />
    );
  }
}