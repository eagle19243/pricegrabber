import {
  PRODUCT_ADD_REQUEST, PRODUCT_ADD_SUCCESS, PRODUCT_GET_REQUEST, PRODUCT_GET_SUCCESS,
  PRODUCT_REMOVE_REQUEST, PRODUCT_REMOVE_SUCCESS, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS,
  GET_PRODUCT_COUNT, PRODUCT_GET_ALL_SUCCESS,
} from "types";

const INITIAL_STATE = {
  productCount: 0,
  allProducts: [],
  tableData: [],
  currentProduct: null,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type)  {
    case PRODUCT_GET_ALL_SUCCESS:
      return {
        ...state,
        allProducts: payload.allProducts,
      };
    case PRODUCT_GET_SUCCESS:
      return {
        ...state,
        tableData: payload.tableData || state.tableData,
        currentProduct: payload.currentProduct || state.currentProduct,
      };
    case PRODUCT_REMOVE_SUCCESS:
      const tableData = state.tableData.filter((row) => {
        return row._id != payload.productId;
      });
      return {
        ...state,
        tableData: tableData
      };
    case GET_PRODUCT_COUNT:
      return {
        ...state,
        productCount: payload.productCount
      }
    default:
      return state;
  }
}
