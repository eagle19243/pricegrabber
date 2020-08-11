import jwt from "jsonwebtoken";
import { push } from "connected-react-router";
import API from "api/API";

export const AUTH_FAILURE = 'AUTH_FAILURE';
export const AUTH_INIT_SUCCESS = 'AUTH_INIT_SUCCESS';
export const AUTH_INIT_ERROR = 'AUTH_INIT_ERROR';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export function login(email, password) {
  return (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST,
    });
  
    if (email.length === 0 || password.length === 0) {
      dispatch(authError('Email or Password cannot be empty'));
    }
  
    API.login(email, password).then(response => {
      const token = response.data;
      dispatch(receiveToken(token));
      // dispatch(doInit());
      // dispatch(push('/app'));
    }).catch(error => {
      dispatch(authError(error.response.data));
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

export function authError(payload) {
  return {
    type: AUTH_FAILURE,
    payload
  }
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
        currentUser = await getUser();
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
  return response.data;
}