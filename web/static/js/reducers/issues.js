import * as ActionTypes from '../constants/action_types';

let initialState = {
  activeMetricIndex: 0,
};

const issueReducer = function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ISSUE_METRIC_CHANGED:
      return Object.assign({}, state, { activeMetricIndex: action.index });

    default:
      return state;
  }
}

export default issueReducer;
