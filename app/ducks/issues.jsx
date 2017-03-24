import axios from 'axios';
import store from '../store';


/* -----------------    ACTIONS     ------------------ */
const MODIFY_INCLUDED_ISSUE = "MODIFY_INCLUDED_ISSUE"; // will change included to its opposite
const CHANGE_SCORE_WEIGHT = "CHANGE_SCORE_WEIGHT"; 

/* ------------   ACTION CREATORS     ----------------- */
// At this point, focus solely on what actions will be sent from the React Components to change 
// the score and action needs an ID to be added, just like for the politicians on the side.

export const modifyIncludedIssue = (issueId) => ({ 
	type: MODIFY_INCLUDED_ISSUE,
	issueId
})

// Sent to reducer with issueId in order to switch the included property so that issue can be included in calculations

export const modifyScoreAndWeight = (issueId, score) => ({
	type: CHANGE_SCORE_WEIGHT,
	issueId,
	score
}) 

/* -------------       REDUCER     ------------------- */

const initialState = { // will add a new key with an object to each issue
	issues: {
			'Gun Control': {
				id: 1, // fixed
				score: 0, // flexible. is tracked in order to select the right AS from the array.
				weight: 0, // flexible. will change at the same time as score is changed
				included: false, // flexible. will change when receives an action to uncheck it, 
								// does not enter calculation
				categoryId: 1 // used to get the info for the right issue for each member of Senate
			},
			'Environment': {
				id: 2,
				score: 0,
				weight: 0,
				included: false,
				categoryId: 2 // will change according to the categories in the database.
			},
            'Foreign & Defense Spending': {
                id: 3,
                score: 0, 
                weight: 0,
                included: false,
                categoryId: 3
            }
	}
}

const reducer = (state = initialState, action) => {

	const newState = Object.assign({}, state)
	console.log('Entering the reducer, this is the issue object', newState.issues) // for some reason if i get rid of this, everything breaks
	console.log('Still in reducer of issues.jsx, rendering the store', store)

	switch (action.type){

		case MODIFY_INCLUDED_ISSUE:
		for (let issue in newState.issues) {

			if (newState.issues[issue].id === action.issueId) {
				newState.issues[issue].included = !newState.issues[issue].included // Makes the included property the opposite of what it currently is.
				break;
			}
		}
		return newState;

		case CHANGE_SCORE_WEIGHT:
		for (let issue in newState.issues) {
			if (newState.issues[issue].id === action.issueId) {
			if (action.score === 25 || action.score === 75) { 
				newState.issues[issue].score = action.score; 
				newState.issues[issue].weight = 2;
				break;
			}
			else if (action.score === 50){
				newState.issues[issue].score = 50
				newState.issues[issue].weight = 1;
				break;
			}
			else if (action.score === 0 || action.score === 100) {
				newState.issues[issue].score = action.score;
				newState.issues[issue].weight = 4;
				break;
			}
		  }
		}
		return newState;

		default: 
		return state
	}
}

export default reducer;