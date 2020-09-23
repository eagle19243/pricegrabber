import {
  TOOL_IMPORT_MASS_PRODUCTS_SUCCESS,
  TOOL_IMPORT_MASS_PRODUCTS_ERROR
} from "types";

const INITIAL_STATE = {
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type)  {
    case TOOL_IMPORT_MASS_PRODUCTS_SUCCESS:
      return state;
    case TOOL_IMPORT_MASS_PRODUCTS_ERROR:
      return state;
    default:
      return state;
  }
}
