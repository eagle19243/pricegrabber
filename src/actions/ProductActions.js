import { push } from "connected-react-router";
import API from "api/API";
import { startLoading, stopLoading } from "actions/AppActions"
import {
  PRODUCT_ADD_REQUEST, PRODUCT_ADD_SUCCESS, PRODUCT_GET_REQUEST, PRODUCT_GET_SUCCESS,
  PRODUCT_REMOVE_REQUEST, PRODUCT_REMOVE_SUCCESS, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS
} from "types";

export function addProduct(product) {
  return (dispatch) => {
    dispatch(startLoading());

    API.addProduct(product).then(response => {
      dispatch(stopLoading());
      dispatch(push('/app/products'));
    }).catch(error => {
      console.log(error.message);
    });
  }
}

export function getProduct(productId) {
  return (dispatch) => {
    dispatch(startLoading());

    API.getProduct(productId).then(response => {
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
      if (response.data.success) {
        dispatch({
          type: PRODUCT_REMOVE_SUCCESS,
          payload: {
            productId: productId
          }
        });
      }
      dispatch(stopLoading());
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
    }).catch(error => {
      console.log(error.message);
    });
  }
}