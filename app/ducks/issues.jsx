import axios from 'axios';

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

// Will be sent with the specific issueId from the react component so that it will switch the 
// selected property of the specific issue to true or false. --> in order to determine if it is 
// going to be used in the final calculation.

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
			categoryId: 2 // ????
		}
	}
}


const reducer = (state = initialState, action) => {

	let newState = Object.assign({}, state)

	switch (action.type){

		case MODIFY_INCLUDED_ISSUE:
		for (var issue in newState.issues) {
			if (issue.id === action.issueId) {
				issue.included = !issue.included // makes it true if false, vice versa.
				break;
			}
		}
		return newState;

		case CHANGE_SCORE_WEIGHT:
		for (var issue in newState.issues) {
			if (issue.id === action.issueId) {
			if (action.score === 25 || action.score === 75) { // the issue score may change later, depending on what is done in the React Component
				issue.score = action.score; // might to lead to some problems if .score is not set up correctly
				issue.weight = 2;
				break;
			}
			else if (action.score === 50){
				issue.score = 50
				issue.weight = 1;
				break;
			}
			else if (action.score === 0) {
				issue.score = 0;
				issue.weight = 4;
				break;
			}
			else if (action.score === 100) {
				issue.score =  100;
				issue.weight = 4;
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