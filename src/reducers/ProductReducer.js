import {
  PRODUCT_ADD_REQUEST, PRODUCT_ADD_SUCCESS, PRODUCT_GET_REQUEST, PRODUCT_GET_SUCCESS,
  PRODUCT_REMOVE_REQUEST, PRODUCT_REMOVE_SUCCESS, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS
} from "types";

const INITIAL_STATE = {
  tableData: [],
  isFetched: false
};

export default (state = INITIAL_STATE, action) => {
  const type = action.type;
  const payload = action.payload;

  switch (type)  {
    case PRODUCT_GET_SUCCESS:
      return Object.assign({}, state, {
        tableData: payload.tableData,
        isFetched: true
      });
    case PRODUCT_REMOVE_SUCCESS:
      const tableData = state.tableData.filter((row) => {
        return row._id != payload.productId;
      });
      return Object.assign({}, state, {
        tableData: tableData
      });
    default:
      return state;
  }
}
