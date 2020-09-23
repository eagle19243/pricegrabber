import React from "react";
import { Route, Redirect } from "react-router-dom";
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Settings from "@material-ui/icons/Settings";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard";
import ConfigurationsPage from "views/Configurations/Configurations";
import ToolsPage from "views/Tools/Tools";
import ProductsPage from "views/Products/Products";
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
    path: "/tools",
    name: "Tools",
    icon: "handyman",
    component: ToolsPage,
    layout: "/app"
  },
  {
    path: "/configurations",
    name: "Configurations",
    icon: Settings,
    component: ConfigurationsPage,
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