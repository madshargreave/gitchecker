import * as ActionTypes from '../constants/action_types';

export function issueMetricChanged (index) {
  return { type: ActionTypes.ISSUE_METRIC_CHANGED, index };
}
