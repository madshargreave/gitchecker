import * as ActionTypes from '../constants/action_types';

let initialState = {
  activeMetricIndex: 0,
};

const commitsReducer = function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.COMMIT_METRIC_CHANGED:
      return Object.assign({}, state, { activeMetricIndex: action.index });

    default:
      return state;
  }
}

export default commitsReducer;
