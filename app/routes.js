import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import App from './components/App';
import PoliticianProfile from './containers/PoliticianProfile';
import DisplayAndPoliticians from './containers/DisplayAndPoliticians'
import Homepage from './containers/Homepage'

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/home" />
      <Route path="/home" component={Homepage} />
      <Route path="/politicians" component={DisplayAndPoliticians} />
      <Route path="/politicians/:id" component={PoliticianProfile} />
    </Route>
  </Router>
);
