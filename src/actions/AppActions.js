import {
  START_LOADING,
  STOP_LOADING
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