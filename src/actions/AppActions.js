import {
  START_LOADING,
  STOP_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
} from "types";

export function startLoading() {
  return (dispatch) => {
    dispatch({
      type: START_LOADING
    });
  }
}

export function stopLoading() {
  return (dispatch) => {
    dispatch({
      type: STOP_LOADING
    });
  }
}

export function showAlert(message, type) {
  return (dispatch) => {
    dispatch({
      type: SHOW_ALERT,
      payload: {
        alertMessage    : message,
        alertType       : type
      }
    });
  }
}

export function hideAlert() {
  return (dispatch) => {
    dispatch({
      type: HIDE_ALERT
    });
  }
}