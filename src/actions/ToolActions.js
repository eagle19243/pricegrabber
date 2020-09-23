import {
  TOOL_IMPORT_MASS_PRODUCTS_SUCCESS,
  TOOL_IMPORT_MASS_PRODUCTS_ERROR,
} from "types";
import API from "api/API";
import { startLoading, stopLoading, showAlert } from "actions/AppActions";

export function importMassProducts(file) {
  return (dispatch) => {
    dispatch(startLoading());

    API.importMassProducts(file).then(response => {
      dispatch(stopLoading());

      if (response.data && !response.data.success) {
        dispatch(showAlert(response.data.message, 'error'));
      } else if (response.problem) {
        dispatch(showAlert(response.problem, 'error'));
      } else {
        dispatch(showAlert(response.data.message, 'success'));
      }
    }).catch(error => {
      console.log(error.message);
    });
  }
}