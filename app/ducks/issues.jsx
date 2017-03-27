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


export const gotScoreForPoliticians = (politiciansWithScore) => ({
  type: GET_POLITICIANS_SCORES,
  politiciansWithScore
})

let arrayOfScores = [];

export const addScoreToPoliticians = () => {
	return (dispatch, getState) => {
		const state = getState();
		let politiciansArray  = state.politicians;

		console.log('addign scores to politicians', arrayOfScores)
		// for (let i=0; i<politiciansArray.length; i++){
		// 	politiciansArray[i].totalScore = arrayOfScores[i]
		// 	console.log(politiciansArray[i])
		// }
	}
}

export const getScoreForPoliticians = () => {
  return (dispatch, getState) => {
    const state = getState()
	let politiciansArray = state.politicians;
	let issues = state.issues.issues

    const politiciansWithScore = politiciansArray.map(politician => {
    	const indIssue = state.issues.issues
    	const polId = politician.id
    	let totalScore = 0;
    	let totalWeight = 0;
    	let totalAgreementScore = 0;
    	for (let issue in issues) {
    		// console.log('this is the issue', indIssue[issue].categoryId, 'and', indIssue[issue].included)
    		if (indIssue[issue].included === true) {
    			let rightScore;
				axios.get(`api/politicians/${polId}/${indIssue[issue].categoryId}`)
	    		.then(response => {
	    			let arrayOfScore = response.data
	    			console.log('this is the catscore', response.data)
	    			if (indIssue[issue].score === 0) rightScore = arrayOfScore[0];
	    			if (indIssue[issue].score === 25) rightScore = arrayOfScore[1];
	    			if (indIssue[issue].score === 50) rightScore = arrayOfScore[2];
	    			if (indIssue[issue].score === 75) rightScore = arrayOfScore[3];
	    			if (indIssue[issue].score === 100) rightScore = arrayOfScore[4];
	    			// console.log('the right score is', rightScore, indIssue[issue].weight);
	    			totalScore += rightScore * indIssue[issue].weight;
	    			totalWeight += indIssue[issue].weight;
	    			totalAgreementScore += Number(totalScore / totalWeight) === totalScore/totalWeight ? (totalScore/totalWeight) : 0 ;  // what to put if the politician has no 
					console.log('this is TS and weight', totalAgreementScore, politician.fullName)
					arrayOfScores.push(totalAgreementScore)
					console.log('this is the array', arrayOfScores)
	    		})
    		}
    	}

    })

    dispatch(addScoreToPoliticians())

    // axios.get('api/politicians/politician.id/1')
    // .then(response => {
    // 	console.log('this is the catscore', response)
    // })

    // for (let i = 0; i<politiciansArray.length; i++){
    // 	console.log('this is the catscore', politiciansArray[i].getCatScore(1))
    // }

	// const politiciansWithScore = politiciansArray.map(politician => {
	// 	let totalScore = 0;
	// 	let totalWeight = 0;
	// 	let totalAgreementScore;
	// 	for (let issue in issues) {
	// 		if (issue.included === true) {
	// 			let rightScore;
	// 			let arrayOfScores = politician.getMemberScore(issue.categoryId) // E.g. Array of scores to possible user positions is: [ 33, 8, 16, 41, 66 ]
	// 			if (issue.score === 0) rightScore = arrayOfScores[0];
	// 			if (issue.score === 25) rightScore = arrayOfScores[1]; 
	// 			if (issue.score === 50) rightScore = arrayOfScores[2]; 
	// 			if (issue.score === 75) rightScore = arrayOfScores[3]; 
	// 			if (issue.score === 100) rightScore = arrayOfScores[4]; 
	// 			totalScore += rightScore * issue.weight; // weight of specific issue
	// 			weight += issue.weight // keep increasing the weight so that we can later divide
	// 		} // loops through every issue in the issue object and adds it
	// 	}
	// 	totalAgreementScore = totalScore / totalWeight;
	// 	return politician.totalAgreementScore = totalAgreementScore
	// })
	// // should return a new array with totalAgreementScore appended to each politician.
	// // this new array gets sent in the getAllPoliticians function on the right
	// // dispatched to reducer as argument in getPoliticians 
	// dispatch(gotScoreForPoliticians(politiciansWithScore))

  }
}

/* -------------       REDUCER     ------------------- */

const initialState = { // Will add a new key with a new object for each additional issue.
	issues: {
			'Gun Control': {
				id: 2, // Fixed. Used to find which issue to change when slider or menu on the UI is modified.
				score: 25, // Flexible. Is tracked in order to select the  index to get the right Agreement Score from the returned array.
				weight: 2, // Flexible. Will change at the same time as score is changed
				included: true, // Flexible. Will change when receives modifyIncludedIssue action above.
				categoryId: 1 // Id will be hard coded depending on the iD in the database.
			},
			'Environment': {
				id:3,
				score: 0,
				weight: 0,
				included: false,
				categoryId: 2 // will change according to the categories in the database.
			},
            'Foreign & Defense Spending': {
                id: 4,
                score: 0, 
                weight: 0,
                included: false,
                categoryId: 3
            }
	}
}


const reducer = (state = initialState, action) => {

	const newState = Object.assign({}, state)
	// console.log('Entering the reducer, this is the issue object', newState.issues) // For some reason if I get rid of this, everything breaks.
	// console.log('Still in reducer of issues.jsx, rendering the store', store)

	switch (action.type){

		case MODIFY_INCLUDED_ISSUE:
		for (let issue in newState.issues) {
 
			if (newState.issues[issue].id === action.issueId) {
				newState.issues[issue].included = true; // Makes the included property the opposite of what it currently is.
			}
			else {
				if (newState.issues[issue].included === true) {
					newState.issues[issue].included = false;
				}
				// else newState.issues[issue].included = false;
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