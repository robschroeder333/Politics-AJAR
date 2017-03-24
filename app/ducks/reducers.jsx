import { combineReducers } from 'redux';
import politicians from './politicians'
import issues from './issues'

const rootReducer = combineReducers({
  politicians: politicians,
  issues: issues
});

export default rootReducer;
