import { compose, createStore, applyMiddleware } from 'redux';
import { reduxReactRouter, ReduxRouter } from 'redux-router';
import { createHistory } from 'history';
import { Route } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import App from '../containers/app';
import routes from '../routes';

const createStoreWithMiddleware = compose(
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
  ),
  reduxReactRouter({
    routes,
    createHistory
  }),
)(createStore);

const store = createStoreWithMiddleware(rootReducer);

export default store;
