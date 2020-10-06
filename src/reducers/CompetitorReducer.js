import {
  COMPETITOR_ADD_REQUEST, COMPETITOR_ADD_SUCCESS, COMPETITOR_GET_REQUEST, COMPETITOR_GET_SUCCESS,
  COMPETITOR_REMOVE_REQUEST, COMPETITOR_REMOVE_SUCCESS, COMPETITOR_UPDATE_REQUEST, COMPETITOR_UPDATE_SUCCESS,
  COMPETITIR_GET_ALL_STORE_NAMES_REQUEST, COMPETITIR_GET_ALL_STORE_NAMES_SUCCESS
} from "types";

const INITIAL_STATE = {
  allStoreNames: [],
  tableData: [],
  currentCompetitor: null,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type)  {
    case COMPETITOR_GET_SUCCESS:
      let tData = payload.tableData || state.tableData;
      
      for (let i = 0; i < tData.length; i++) {
        if (tData[i].store_names && Array.isArray(tData[i].store_names)) {
          tData[i].store_names = tData[i].store_names.join(', ');
        }
      }

      return {
        ...state,
        tableData: tData,
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
    case COMPETITIR_GET_ALL_STORE_NAMES_SUCCESS:
      return {
        ...state,
        allStoreNames: payload.allStoreNames
      };
    default:
      return state;
  }
}
