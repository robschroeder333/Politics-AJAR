import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './ducks/reducers';
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { getAllPoliticians } from './ducks/politicians.jsx';
import {getAllIssues} from './ducks/issues.jsx';

import { loadState, saveState } from './sessionStorage';
import throttle from 'lodash/throttle';

// logs state changes in chrome console
const logger = createLogger({collapsed: true})

// allows use of Redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedState = loadState();

const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(
    applyMiddleware(logger, thunkMiddleware)
  )
);

store.subscribe(throttle(() => {
	// saveState(store.getState());
	saveState({
		politicians: store.getState().politicians,
		issues: store.getState().issues
	});
}, 1000));

store.dispatch(getAllPoliticians())
store.dispatch(getAllIssues())

export default store;