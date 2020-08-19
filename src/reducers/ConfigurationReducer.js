import {
  CONFIGURATION_GET_SUCCESS,
  CONFIGURATION_UPDATE_SUCCESS
} from "types";

const INITIAL_STATE = {
  lastRunTime: null,
  interval: null
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type)  {
    case CONFIGURATION_GET_SUCCESS:
      return {
        ...state,
        lastRunTime: payload.lastRunTime,
        interval: payload.interval
      };
    case CONFIGURATION_UPDATE_SUCCESS:
    default:
      return state;
  }
}
