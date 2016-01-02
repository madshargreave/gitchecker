import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import routes from './routes';

require('expose?moment!moment');
require('expose?mathjs!mathjs');
require('expose?_!lodash');

if (PRODUCTION) {
  require('./vendor/ga.js');
}

const entry = (
  <Provider store={store}>
    {routes}
  </Provider>
);

render(entry, document.getElementById('root'));
