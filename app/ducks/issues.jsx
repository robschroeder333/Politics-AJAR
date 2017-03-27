 import axios from 'axios';
import store from '../store';
import {getPoliticians} from './politicians'


/* -----------------    ACTIONS     ------------------ */
const MODIFY_INCLUDED_ISSUE = "MODIFY_INCLUDED_ISSUE"; // will change included to its opposite
const CHANGE_SCORE_WEIGHT = "CHANGE_SCORE_WEIGHT"; 
const ADD_ISSUE = "ADD_ISSUE";
const ISSUE_CHANGE = "ISSUE_CHANGE";
const SCORE_CHANGE = "SCORE_CHANGE";
const DELETE_ISSUE = 'DELETE_ISSUE';


/* ------------   ACTION CREATORS     ----------------- */
// At this point, focus solely on what actions will be sent from the React Components to change
// the score and action needs an ID to be added, just like for the politicians on the side.

export const modifyIncludedIssue = (issueId, linkId) => ({
	type: MODIFY_INCLUDED_ISSUE,
	issueId,
	linkId
})


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

export const addIssue = () => ({
	type: ADD_ISSUE
})

export const issueChange = (index, value) => ({
	type: ISSUE_CHANGE,
	index, 
	value
})

export const scoreChange = (index, newValue) => ({
	type: SCORE_CHANGE,
	index,
	newValue
})


export const getScoreForPoliticians = () => {
  return (dispatch, getState) => {
    const state = getState()
	let politiciansArray = state.politicians.politicians;
	let issues = state.issues.issues
	let politiciansWithScore;

    return politiciansWithScore = politiciansArray.map(politician => {
    	// if (politician.ppid === "B000944") { // only loop for one politician. I got to make sure that it works right for each issue
    	// console.log('this is politician', politician)
    	const indIssue = state.issues.issues
    	const polId = politician.ppid
    	let totalScore = 0;
    	let totalWeight = 0;
    	// let totalAgreementScore = 0;
    	for (let issue in issues) {
    		// console.log('this is the issue', indIssue[issue].categoryId, 'and', indIssue[issue].included) 
    		if (indIssue[issue].included === true) {
    			// console.log('this is issue', indIssue[issue], indIssue[issue].included)
    			let rightScore;
				axios.get(`api/politicians/${polId}/${indIssue[issue].categoryId}`)  // 
	    		.then(response => {
	    			let arrayOfScore = response.data 
	    			console.log('this is the catscore', response.data, politician.fullName, issue)  
	    			if (arrayOfScore[0] === null) {
	    				rightScore = 50; // why does the array return null? 
	    			}
	    			else {
						if (indIssue[issue].score === 0) rightScore = arrayOfScore[0];
		    			if (indIssue[issue].score === 25) rightScore = arrayOfScore[1];
		    			if (indIssue[issue].score === 50) rightScore = arrayOfScore[2];
		    			if (indIssue[issue].score === 75) rightScore = arrayOfScore[3];
		    			if (indIssue[issue].score === 100) rightScore = arrayOfScore[4];
		    			totalWeight += indIssue[issue].weight; // weight does not increase even if it is important to user
		    			// console.log(totalWeight, 'this is totalWeight')
	    			}
	    			// console.log('the right score is', rightScore, indIssue[issue].weight);
	    			totalScore += rightScore * indIssue[issue].weight;
	    			// console.log('this is totalScore', totalScore)
	    			// totalAgreementScore += Number(totalScore / totalWeight) === totalScore/totalWeight ? (totalScore/totalWeight) : 0 ;  // what to put if the politician has no 
					// console.log('this is TS and weight', totalScore/totalWeight, politician.fullName)
					// console.log('this is the final politician', politiciansArray)

					return politician.totalAgreementScore = totalScore/totalWeight;
					// console.log('this is the array', arrayOfScores)
	    		})
	    		.then(() => dispatch(getPoliticians(politiciansArray)))
    		}
    	}
    })

    // around line 70, why does the catScore sometimes respond with null. How to deal with that? Do we assign a score of 0 becasue the politican did not vote?
    // do we keep the weight? because if it is important for our user, then it should also be important for the politician?
    // also, imagine that the user uses different issues to see agreement
    // if the politician score is not added, then one politician who agrees on all issues but one might be ranked higher than another politician
    // simply becasue he has no opinion on the issue. which does not necessarily make him in more agreement.

  }
}

/* -------------       REDUCER     ------------------- */

const initialState = { 
	issueNumber: 0,
	issueValues: {},
	issues: {
			'Agriculture': {
				id: 2, // Fixed. Used to find which issue to change when slider or menu on the UI is modified.
				score: null, // Flexible. Is tracked in order to select the  index to get the right Agreement Score from the returned array.
				weight: 0, // Flexible. Will change at the same time as score is changed
				included: false, // Flexible. Will change when receives modifyIncludedIssue action above.
				categoryId: 1, // Id will be hard coded depending on the iD in the database.
				link: null,
			},
			'Construction & Public Works': {
				id:3,
				score: 0,
				weight: 0,
				included: false,
				categoryId: 2,
          
			},
		    'Communication & Electronics': {
		        id: 4,
		        score: 0, 
		        weight: 0,
		        included: false,
		        categoryId: 3
		    },
		    'Defense': {
				id:5,
				score: 0,
				weight: 0,
				included: false,
				categoryId: 4 
			},
			'Energy & Environment': {
				id:6,
				score: 0,
				weight: 0,
				included: true,
				categoryId: 5 
			},
			'Finance, Insurance & Real Estate': {
				id:7,
				score: 0,
				weight: 0,
				included: false,
				categoryId: 6 
			},
			'General commerce': {
				id:8,
				score: 0,
				weight: 0,
				included: false,
				categoryId: 7 
			},
			'Health, Education & Human Resources': {
				id:9,
				score: 0,
				weight: 0,
				included: false,
				categoryId: 8 
			},
			'Ideological & Single Issue': {
				id:10,
				score: 0,
				weight: 0,
				included: false,
				categoryId: 9 
			},
			'Legal Services': {
				id:11,
				score: 0,
				weight: 4,
				included: false,
				categoryId: 10 
			},
			'Labor Unions': {
				id:12,
				score: 0,
				weight: 0,
				included: false,
				categoryId: 11 
			}
	}
}


const reducer = (state = initialState, action) => {

	const newState = Object.assign({}, state)


	switch (action.type){

		case MODIFY_INCLUDED_ISSUE:
			for (let issue in newState.issues) {
				if (newState.issues[issue].id === action.issueId) {
					newState.issues[issue].included = true;
					newState.issues[issue].link = action.linkId;
					newState.issues[issue].score = 50;
					newState.issues[issue].weight = 1;
				} else if (newState.issues[issue].link === action.linkId) {
					newState.issues[issue].link = null;
					newState.issues[issue].included = false;
					newState.issues[issue].score = null;
					newState.issues[issue].weight = 0;
				}
			}

			return newState;

		case DELETE_ISSUE:
			for (let issue in newState.issues) {
				if (newState.issues[issue].link === action.linkId) {
					newState.issues[issue].included = false;
					newState.issues[issue].link = null;
					newState.issues[issue].score = null;
					newState.issues[issue].weight = 0;
				} else if (newState.issues[issue].included && newState.issues[issue].link >= action.linkId) {
					newState.issues[issue].link--;
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
				else if (action.score === 50) {
					newState.issues[issue].score = 50
					newState.issues[issue].weight = 1;
					break;
				}
				else if (action.score === 0 || action.score === 100) {
					newState.issues[issue].score = action.score;
					newState.issues[issue].weight = 4;
					break;
				}
		  } else {
				console.log('other issue hit', newState.issues[issue])
			}
		}
		return newState;

		case ADD_ISSUE:
		newState.issueNumber = newState.issueNumber + 1;
		newState.issueValues[newState.issueNumber] = {value: 1, slidebar: 50}
		return newState;

		case ISSUE_CHANGE:
		newState.issueValues[action.index] = {value: action.value, slidebar: 50};
		console.log(newState);
		return newState;

		case SCORE_CHANGE:
		newState.issueValues[action.index].slidebar = action.newValue;
		console.log(newState)
		return newState;

		default: 
		return state
	}
}

export default reducer;
