// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Settings from "@material-ui/icons/Settings";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import SettingsPage from "views/Settings/Settings.js";
import ProductsPage from "views/Products/Products.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/products",
    name: "Products",
    icon: "content_paste",
    component: ProductsPage,
    layout: "/admin"
  },
  {
    path: "/settings",
    name: "Settings",
    icon: Settings,
    component: SettingsPage,
    layout: "/admin"
  }
];

export default dashboardRoutes;
