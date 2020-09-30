import { push } from "connected-react-router";
import API from "api/API";
import { startLoading, stopLoading, showAlert } from "actions/AppActions"
import {
  COMPETITOR_GET_SUCCESS, COMPETITOR_REMOVE_SUCCESS, COMPETITIR_GET_ALL_STORE_NAMES_SUCCESS,
} from "types";

export function addCompetitor(competitor) {
  return (dispatch) => {
    dispatch(startLoading());

    API.addCompetitor(competitor).then(response => {
      dispatch(stopLoading());

      if (response.problem) {
        dispatch(showAlert(response.problem, 'error'));
      } else {
        dispatch(showAlert(response.data.message, 'success'));
        dispatch(push('/app/competitors'));
      }
    }).catch(error => {
      console.log(error.message);
    });
  }
}

export function getCompetitor(competitorId=null) {
  return (dispatch) => {
    dispatch(startLoading());

    API.getCompetitor(competitorId).then(response => {
      if (competitorId) {
        dispatch({
          type: COMPETITOR_GET_SUCCESS,
          payload: {
            currentCompetitor: response.data.data
          }
        });
      } else {
        dispatch({
          type: COMPETITOR_GET_SUCCESS,
          payload: {
            tableData: response.data.data
          }
        });
      }
      dispatch(stopLoading());
    }).catch(error => {
      console.log(error.message);
    });
  }
}

export function removeCompetitor(competitorId) {
  return (dispatch) => {
    dispatch(startLoading());

    API.removeCompetitor(competitorId).then(response => {
      dispatch(stopLoading());

      if (response.data && !response.data.success) {
        dispatch(showAlert(response.data.message, 'error'));
      } else if (response.problem) {
        dispatch(showAlert(response.problem, 'error'));
      } else {
        dispatch(showAlert(response.data.message, 'success'));
        dispatch({
          type: COMPETITOR_REMOVE_SUCCESS,
          payload: {
            competitorId,
          }
        });
      }
    }).catch(error => {
      console.log(error.message);
    });
  }
}

export function updateCompetitor(competitorId, competitor) {
  return (dispatch) => {
    dispatch(startLoading());

    API.updateCompetitor(competitorId, competitor).then(response => {
      dispatch(stopLoading());

      if (response.data && !response.data.success) {
        dispatch(showAlert(response.data.message, 'error'));
      } else if (response.problem) {
        dispatch(showAlert(response.problem, 'error'));
      } else {
        dispatch(showAlert(response.data.message, 'success'));
      }
    }).catch(error => {
      console.log(error.message);
    });
  }
}

export function getAllStoreNames() {
  return (dispatch) => {
    API.getAllStoreNames().then(response => {
      dispatch({
        type: COMPETITIR_GET_ALL_STORE_NAMES_SUCCESS,
        payload: {
          allStoreNames: response.data.data
        }
      });
    }).catch(error => {
      console.log(error.message);
    });
  }
}