import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import projectsReducer from './projects';
import issueReducer from './issues';
import commitsReducer from './commits';

const rootReducer = combineReducers({
  router: routerStateReducer,
  project: projectsReducer,
  issueStatisticBoxState: issueReducer,
  commitStatisticBoxState: commitsReducer
});

export default rootReducer;
