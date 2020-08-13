import {
  AUTH_FAILURE, AUTH_INIT_SUCCESS, AUTH_INIT_ERROR, LOGIN_REQUEST,
  LOGIN_SUCCESS, LOGOUT_REQUEST, LOGOUT_SUCCESS
} from "types";

const INITIAL_STATE = {
  isFetching: false,
  errorMessage: '',
  currentUser: null,
  loadingInit: true,
};

export default (state = INITIAL_STATE, action) => {
  const type = action.type;
  const payload = action.payload;

  switch (type)  {
    case AUTH_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: payload
      });
    case AUTH_INIT_SUCCESS:
      return Object.assign({}, state, {
        currentUser: payload.currentUser || null,
        loadingInit: false,
      });
    case AUTH_INIT_ERROR:
      return Object.assign({}, state, {
        currentUser: null,
        loadingInit: false,
      });
    case LOGIN_REQUEST:
    case LOGIN_SUCCESS:
    case LOGOUT_REQUEST:
    case LOGOUT_SUCCESS:
    default:
      return state;
  }
}
