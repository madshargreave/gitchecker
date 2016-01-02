import React from 'react';
import App from './containers/app';
import Report from './containers/report';
import About from './containers/about';
import { Router, Route, NoMatch  } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

const routes = (
  <Router history={createBrowserHistory()}>
    <Route path='/' component={App}/>
    <Route path='/:owner/:repository' component={Report}/>
    <Route path='/about' component={About}/>
    <Route path='*' component={NoMatch}/>
  </Router>
);

export default routes;
