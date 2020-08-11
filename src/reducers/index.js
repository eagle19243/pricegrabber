import { combineReducers } from "redux";
import AuthReducer from "reducers/AuthReducer";
import { connectRouter } from "connected-react-router";

export default (history) => {
  return combineReducers({
    router: connectRouter(history),
    auth: AuthReducer
  });
}