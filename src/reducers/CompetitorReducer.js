import {
  COMPETITOR_ADD_REQUEST, COMPETITOR_ADD_SUCCESS, COMPETITOR_GET_REQUEST, COMPETITOR_GET_SUCCESS,
  COMPETITOR_REMOVE_REQUEST, COMPETITOR_REMOVE_SUCCESS, COMPETITOR_UPDATE_REQUEST, COMPETITOR_UPDATE_SUCCESS,
} from "types";

const INITIAL_STATE = {
  tableData: [],
  currentCompetitor: null,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type)  {
    case COMPETITOR_GET_SUCCESS:
      return {
        ...state,
        tableData: payload.tableData || state.tableData,
        currentCompetitor: payload.currentCompetitor || state.currentCompetitor,
      };
    case COMPETITOR_REMOVE_SUCCESS:
      const tableData = state.tableData.filter((row) => {
        return row._id != payload.competitorId;
      });
      return {
        ...state,
        tableData: tableData
      };
    default:
      return state;
  }
}
