import { combineReducers } from 'redux';
import politicians from './politicians';
import issues from './issues';
import singlePolitician from './singlePolitician';

const rootReducer = combineReducers({
  politicians: politicians,
  issues: issues,
  singlePolitician: singlePolitician
});

export default rootReducer;
