import { combineReducers } from 'redux';
import politicians, * as fromPoliticians from './politicians'
import issues from './issues'

const rootReducer = combineReducers({
  politicians: politicians,
  issues: issues
});

export default rootReducer;

export const selectPoliticianByState = (state) => {
	return fromPoliticians.selectPoliticianByState(state.politicians, state.issues)
}