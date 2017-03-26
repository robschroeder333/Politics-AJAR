import axios from 'axios';
import store from '../store';


/* -----------------    ACTIONS     ------------------ */
const MODIFY_INCLUDED_ISSUE = 'MODIFY_INCLUDED_ISSUE'; // will change included to its opposite
const CHANGE_SCORE_WEIGHT = 'CHANGE_SCORE_WEIGHT';
const DELETE_ISSUE = 'DELETE_ISSUE';

/* ------------   ACTION CREATORS     ----------------- */
// At this point, focus solely on what actions will be sent from the React Components to change
// the score and action needs an ID to be added, just like for the politicians on the side.

export const modifyIncludedIssue = (issueId, linkId) => ({
	type: MODIFY_INCLUDED_ISSUE,
	issueId,
	linkId
})

// Sent to reducer with issueId in order to switch the included property so that issue can be included in calculations

export const modifyScoreAndWeight = (issueId, score) => ({
	type: CHANGE_SCORE_WEIGHT,
	issueId,
	score
})

export const deleteIssue = (issueId, linkId) => ({
	type: DELETE_ISSUE,
	issueId,
	linkId
})

/* -------------       REDUCER     ------------------- */

const initialState = { // Will add a new key with a new object for each additional issue.
	issues: {
			'Gun Control': {
				id: 2, // Fixed. Used to find which issue to change when slider or menu on the UI is modified.
				score: null, // Flexible. Is tracked in order to select the  index to get the right Agreement Score from the returned array.
				weight: 0, // Flexible. Will change at the same time as score is changed
				included: false, // Flexible. Will change when receives modifyIncludedIssue action above.
				categoryId: 1, // Id will be hard coded depending on the iD in the database.
				link: null
			},
			'Environment': {
				id: 3,
				score: null,
				weight: 0,
				included: false,
				categoryId: 2, // will change according to the categories in the database.
				link: null
			},
      'Foreign & Defense Spending': {
        id: 4,
        score: null,
        weight: 0,
        included: false,
        categoryId: 3,
				link: null
      }
	}
}

const reducer = (state = initialState, action) => {

	const newState = Object.assign({}, state)
	console.log('Entering the reducer, this is the issue object', newState.issues) // For some reason if I get rid of this, everything breaks.
	console.log('Still in reducer of issues.jsx, rendering the store', store)

	switch (action.type){

		case MODIFY_INCLUDED_ISSUE:
			for (let issue in newState.issues) {
				if (newState.issues[issue].id === action.issueId) {
					newState.issues[issue].included = true;
					newState.issues[issue].link = action.linkId;
					newState.issues[issue].score = 50;
				}
			}
			return newState;

		case DELETE_ISSUE:
			for (let issue in newState.issues) {
				if (newState.issues[issue].link === action.linkId) {
					newState.issues[issue].included = false;
					newState.issues[issue].link = null;
					newState.issues[issue].score = 50;
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
