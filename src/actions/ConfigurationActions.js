import {
  CONFIGURATION_GET_SUCCESS,
  CONFIGURATION_UPDATE_SUCCESS
} from "types";
import API from "api/API";

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
    API.updateConfig(config).then(response => {
      console.log(response.data.data);
      dispatch({
        type: CONFIGURATION_UPDATE_SUCCESS
      });
    }).catch(error => {
      console.log(error.message);
    });
  }
}