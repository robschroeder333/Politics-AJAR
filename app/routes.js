import React from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import App from './components/App';
import PoliticianProfile from './containers/PoliticianProfile';
import DisplayAndPoliticians from './containers/DisplayAndPoliticians';
import Homepage from './containers/Homepage';
import About from './containers/About';

let indexRedirectTarget = '/home';
let homeTarget = Homepage;
if (sessionStorage.state){
  indexRedirectTarget = '/politicians';
  homeTarget = DisplayAndPoliticians;
}

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to={indexRedirectTarget} />
      <Route path="/home" component={homeTarget} />
      <Route path="/politicians" component={DisplayAndPoliticians} />
      <Route path="/politicians/:id" component={PoliticianProfile} />
      <Route path="/about" component={About} />
    </Route>
  </Router>
);
