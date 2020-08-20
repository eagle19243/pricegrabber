import {
  CONFIGURATION_GET_SUCCESS,
  CONFIGURATION_UPDATE_SUCCESS
} from "types";
import API from "api/API";
import { startLoading, stopLoading, showAlert } from "actions/AppActions"

export function getConfig() {
  return (dispatch) => {
    API.getConfig().then(response => {
      const config = response.data.data;
      dispatch({
        type: CONFIGURATION_GET_SUCCESS,
        payload: {
          lastRunTime: config.last_run_time,
          interval: config.interval
        }
      });
    }).catch(error => {
      console.log(error.message);
    });
  }
}

export function updateConfig(config) {
  return (dispatch) => {
    dispatch(startLoading());

    API.updateConfig(config).then(response => {
      dispatch(stopLoading());

      if (response.data && !response.data.success) {
        dispatch(showAlert(response.data.message, 'error'));
      } else if (response.problem) {
        dispatch(showAlert(response.problem, 'error'));
      } else {
        dispatch(showAlert(response.data.message, 'success'));
        dispatch({
          type: CONFIGURATION_UPDATE_SUCCESS
        });
      }
    }).catch(error => {
      console.log(error.message);
    });
  }
}