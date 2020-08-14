import {
  START_LOADING,
  STOP_LOADING
} from "types";

const INITIAL_STATE = {
  isFetching: false,
};

export default (state = INITIAL_STATE, action) => {
  const type = action.type;

  switch (type)  {
    case START_LOADING:
      return {
        ...state,
        isFetching: true
      };
    case STOP_LOADING:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}
