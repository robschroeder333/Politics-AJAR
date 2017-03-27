import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import App from './components/App'
import Politicians from './containers/Politicians'
import Politician from './components/Politician';
import DisplayAndPoliticians from './containers/DisplayAndPoliticians'
import Homepage from './containers/Homepage'


export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/displayPoliticians" />
      <Route path="/home" component={Homepage} />
      <Route path="/displayPoliticians" component={DisplayAndPoliticians} />
      <Route path="/politicians" component={Politicians} />
      <Route path="/politician" component={Politician} />
    </Route>
  </Router>
);
