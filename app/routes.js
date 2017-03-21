import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import App from './components/App'
import Politicians from './containers/Politicians'
import Politician from './components/Politician';


export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/politicians" />
      <Route path="/politicians" component={Politicians} />
      <Route path="/politician" component={Politician} />
    </Route>
  </Router>
);
