'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Routes from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


injectTapEventPlugin();

ReactDOM.render(
<MuiThemeProvider>
  <Provider store={store}>
    <Routes />
  </Provider>
 </MuiThemeProvider>,
  document.getElementById('origin')
);
