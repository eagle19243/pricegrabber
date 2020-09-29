import { combineReducers } from "redux";
import AuthReducer from "reducers/AuthReducer";
import ProductReducer from "reducers/ProductReducer";
import CompetitorReducer from "reducers/CompetitorReducer";
import AppReducer from "reducers/AppReducer";
import ConfigurationReducer from "reducers/ConfigurationReducer";
import { connectRouter } from "connected-react-router";

export default (history) => {
  return combineReducers({
    router: connectRouter(history),
    auth: AuthReducer,
    product: ProductReducer,
    competitor: CompetitorReducer,
    app: AppReducer,
    configuration: ConfigurationReducer
  });
}