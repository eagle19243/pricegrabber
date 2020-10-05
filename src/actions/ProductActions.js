import { push } from "connected-react-router";
import API from "api/API";
import { startLoading, stopLoading, showAlert } from "actions/AppActions"
import {
  PRODUCT_GET_SUCCESS, PRODUCT_REMOVE_SUCCESS, GET_PRODUCT_COUNT, PRODUCT_GET_ALL_SUCCESS,
} from "types";

export function addProduct(product) {
  return (dispatch) => {
    dispatch(startLoading());

    API.addProduct(product).then(response => {
      dispatch(stopLoading());

      if (response.problem) {
        dispatch(showAlert(response.problem, 'error'));
      } else {
        dispatch(showAlert(response.data.message, 'success'));
        dispatch(push('/app/products'));
      }
    }).catch(error => {
      console.log(error.message);
    });
  }
}

export function getAllProducts() {
  return (dispatch) => {
    API.getProduct().then(response => {
      dispatch({
        type: PRODUCT_GET_ALL_SUCCESS,
        payload: {
          allProducts: response.data.data
        }
      });
    }).catch(error => {
      console.log(error.message);
    });
  }
}

export function getProduct(productId=null, filterErrored=false, filterUpdated=false) {
  return (dispatch) => {
    dispatch(startLoading());

    API.getProduct(productId, filterErrored, filterUpdated).then(response => {
      if (productId) {
        dispatch({
          type: PRODUCT_GET_SUCCESS,
          payload: {
            currentProduct: response.data.data
          }
        });
      } else {
        dispatch({
          type: PRODUCT_GET_SUCCESS,
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

export function removeProduct(productId) {
  return (dispatch) => {
    dispatch(startLoading());

    API.removeProduct(productId).then(response => {
      dispatch(stopLoading());

      if (response.data && !response.data.success) {
        dispatch(showAlert(response.data.message, 'error'));
      } else if (response.problem) {
        dispatch(showAlert(response.problem, 'error'));
      } else {
        dispatch(showAlert(response.data.message, 'success'));
        dispatch({
          type: PRODUCT_REMOVE_SUCCESS,
          payload: {
            productId: productId
          }
        });
      }
    }).catch(error => {
      console.log(error.message);
    });
  }
}

export function updateProduct(productId, product) {
  return (dispatch) => {
    dispatch(startLoading());

    API.updateProduct(productId, product).then(response => {
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

export function getProductCount() {
  return (dispatch) => {
    API.getProductCount().then(response => {
      dispatch({
        type: GET_PRODUCT_COUNT,
        payload: {
          productCount: response.data.data
        }
      });
    }).catch(error => {
      console.log(error.message);
    });
  }
}