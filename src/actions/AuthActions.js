import jwt from "jsonwebtoken";
import { push } from "connected-react-router";
import API from "api/API";
import { startLoading, stopLoading, showAlert } from "actions/AppActions"
import {
  AUTH_FAILURE, AUTH_INIT_SUCCESS, AUTH_INIT_ERROR, LOGIN_REQUEST,
  LOGIN_SUCCESS, LOGOUT_REQUEST, LOGOUT_SUCCESS
} from "types";

export function login(email, password) {
  return (dispatch) => {
    dispatch(startLoading());
    dispatch({
      type: LOGIN_REQUEST,
    });
  
    if (email.length === 0 || password.length === 0) {
      dispatch(showAlert('Email or Password cannot be empty', 'error'));
    }
    
    API.login(email, password).then(response => {
      response = response.data;
      dispatch(stopLoading());

      if (response.success) {
        dispatch(receiveToken(response.data));
        dispatch(doInit());
        dispatch(push('/app'));
      } else {
        dispatch(showAlert(response.message, 'error'));
      }
    }).catch(error => {
      dispatch(stopLoading());
      dispatch(showAlert(error.message, 'error'));
    });
  }
}

export function logout() {
  return (dispatch) => {
    dispatch({
      type: LOGOUT_REQUEST,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({
      type: LOGOUT_SUCCESS,
    });
    dispatch(push('/login'));
  }
}

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  
  if (!token) return;

  const date = new Date().getTime() / 1000;
  const data = jwt.decode(token);

  if (!data) return;

  return date < data.exp;
}

export function receiveToken(token) {
  return (dispatch) => {
    const user = jwt.decode(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({
      type: LOGIN_SUCCESS
    });
    dispatch(push('/app'));
  }
}

export function doInit() {
  return async (dispatch) => {
    try {
      let currentUser = null;
      const token = localStorage.getItem('token');

      if (token) {
        currentUser = await getUser(token);
      }

      dispatch({
        type: AUTH_INIT_SUCCESS,
        payload: {
          currentUser
        }
      });
    } catch (error) {
      dispatch({
        type: AUTH_INIT_ERROR,
        payload: error
      });
    }
  }
}

async function getUser(token) {
  const response = await API.getUser(token);
  return response.data.data;
}