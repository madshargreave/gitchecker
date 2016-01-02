import * as ActionTypes from '../constants/action_types';

export function commitMetricChanged (index) {
  return { type: ActionTypes.COMMIT_METRIC_CHANGED, index };
}
