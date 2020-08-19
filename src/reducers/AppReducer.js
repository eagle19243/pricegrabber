import {
  START_LOADING,
  STOP_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
} from "types";

const INITIAL_STATE = {
  isFetching: false,
  alertMessage: '',
  alertType: '',
  shouldShowAlert: false
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type)  {
    case START_LOADING:
      return {
        ...state,
        isFetching: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        isFetching: false,
      };
    case SHOW_ALERT: 
      const { alertMessage, alertType } = payload;
      return {
        ...state,
        alertMessage,
        alertType,
        shouldShowAlert: true,
      }
    case HIDE_ALERT:
      return {
        ...state,
        shouldShowAlert: false
      }
    default:
      return state;
  }
}
