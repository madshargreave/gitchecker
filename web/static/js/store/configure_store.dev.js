import { compose, createStore, applyMiddleware } from 'redux';
import { reduxReactRouter, ReduxRouter } from 'redux-router';
import { createHistory } from 'history';
import { Route } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { devTools, persistState } from 'redux-devtools';
import rootReducer from '../reducers';
import App from '../containers/app';
import routes from '../routes';

const loggerMiddleware = createLogger();
const createStoreWithMiddleware = compose(
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  ),
  reduxReactRouter({
    routes,
    createHistory
  }),
  devTools()
)(createStore);

const store = createStoreWithMiddleware(rootReducer);

export default store;
