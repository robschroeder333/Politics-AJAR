import axios from 'axios';
import store from '../store';
import {getPoliticians} from './politicians';


/* -----------------    ACTIONS     ------------------ */
const ADD_ISSUE = 'ADD_ISSUE';
const ISSUE_CHANGE = 'ISSUE_CHANGE';
const MODIFY_INCLUDED_ISSUE = 'MODIFY_INCLUDED_ISSUE';
const DELETE_ISSUE = 'DELETE_ISSUE';
const CHANGE_SCORE_WEIGHT = 'CHANGE_SCORE_WEIGHT';
const SCORE_CHANGE = 'SCORE_CHANGE';
const STATE_CHANGE = 'STATE_CHANGE';
const HIDE_STATE = 'HIDE_STATE';
const GET_ISSUES = 'GET_ISSUES';
const CREATE_POLITICIAN_SCORE = 'CREATE_POLITICIAN_SCORE';
// const GET_SCORES = 'GET_SCORES';


/* ------------   ACTION CREATORS     ----------------- */

export const addIssue = () => ({
	type: ADD_ISSUE
})

export const issueChange = (index, value) => ({
	type: ISSUE_CHANGE,
	index,
	value
})

export const modifyIncludedIssue = (issueId, linkId) => ({
	type: MODIFY_INCLUDED_ISSUE,
	issueId, linkId
})

export const scoreChange = (index, newValue) => ({
	type: SCORE_CHANGE,
	index,
	newValue
})

export const deleteIssue = (issueId, linkId) => ({
	type: DELETE_ISSUE,
	issueId,
	linkId
})

export const modifyScoreAndWeight = (issueId, score) => ({
	type: CHANGE_SCORE_WEIGHT,
	issueId,
	score
})

export const stateChange = (state) => ({
	type: STATE_CHANGE,
	state
})

export const hideState = () => ({
	type: HIDE_STATE
})

export const getIssues = (issues) => ({
	type: GET_ISSUES,
	issues
})

export const createPolitician = (politicianObject) => ({
	type: CREATE_POLITICIAN_SCORE,
	politicianObject
})

export const scorePoliticiansChange = () => {
	return (dispatch, getState) => {
		// console.log('entered 2nd action creator')
		let state = getState();
		// console.log('state is', state)
		let politicians = state.politicians.politicians;
		let issues = state.issues.issues;
		let politicianScore = state.issues.politicianScores;
		// console.log('these are the issues', issues)
		let selectedState = state.issues.selectedState;
		let statePoliticians = politicians.filter(politician => politician.state.match(selectedState))
		// console.log('filtered politicians are', statePoliticians)
		let includedIssues = Object.keys(issues).filter(issue => issues[issue].included)   //.map(issue => {if (issues[issue].included === true){return issue}})
		console.log('included issues are', includedIssues)
		let politicianObject = politicianScore;
		for (let i = 0; i < statePoliticians.length; i++) {
			for (let j = 0; j < includedIssues.length; j++) {
				if (politicianScore[statePoliticians[i].ppid] && politicianScore[statePoliticians[i].ppid][includedIssues[j]]) {
					console.log('true')
					//skip in this case
				}
				else {
					console.log('statePoliticians[i]', statePoliticians[i]);
					if (!politicianScore[statePoliticians[i].ppid]){
						politicianObject[statePoliticians[i].ppid] = {};
						politicianObject[statePoliticians[i].ppid][includedIssues[j]] = [];
						// politicianScore[statePoliticians[i].ppid] = {}
					  // dispatch(createPolitician(statePoliticians[i].ppid, ));

					}
					else if (politicianScore[statePoliticians[i].ppid] && !politicianScore[statePoliticians[i].ppid][includedIssues[j]]){
						// politicianScore[statePoliticians[i].ppid][includedIssues[j]] = {}//axios.get
						politicianObject[statePoliticians[i].ppid][includedIssues[j]] = [];
					}

				}
			}
		}
		dispatch(createPolitician(politicianObject));
	}
}

export const getScores = () => {
	return (dispatch, getState) => {

		let state = getState();
		// let politicians = state.politicians.politicians;
		let issues = state.issues.issues; //need this for categoryId
		let politicianScore = state.issues.politicianScores;

		let politicianId = Object.keys(politicianScore);
		let arrayOfPromises = [];
		let promisesArrayIndexes = [];
		let politicianObject = politicianScore;
		console.log('politicianObject', politicianObject)

		for (let i = 0; i < politicianId.length; i++){
			for (let issueName in politicianScore[politicianId[i]]){
				if (politicianScore[politicianId[i]][issueName].length === 0){
					// console.log('politicianScore[politicianId[i]]', politicianScore[politicianId[i]]);
					// console.log('politicianId[i] is', politicianId[i]);
					// console.log('issues[issueName].categoryId', issues[issueName].categoryId);
					arrayOfPromises.push(axios.get(`api/politicians/${politicianId[i]}/${issues[issueName].categoryId}`));
					// arrayOfPromises.push(axios.get(`api/politicians/I000024/Q09`).catch(() => console.log('hey, this messed up')));
					promisesArrayIndexes.push(issueName);
					// politicianScore[politicianId][issueName] = ;
				}
			}
		}
		// console.log('arrayOfPromises', arrayOfPromises);
		// console.log('promisesArrayIndexes', promisesArrayIndexes);
		return Promise.all(arrayOfPromises)
		.then(promises => {
			console.log('promises are', promises)
			// return promises.map((promise, index) => {
			// 	politicianScore[politicianId[index]][promisesArrayIndexes[index]] = promise.data;
			// });
			return promises.map((promise, index) => {
				console.log('politicianId[index]', politicianId[index]);
				console.log('[promisesArrayIndexes[index]]', [promisesArrayIndexes[index]]);
				console.log('promise.data', promise.data);
				politicianObject[politicianId[index]][promisesArrayIndexes[index]] = promise.data;
			});
		})
		.then(result => {
			console.log('this is inside the then from the axios', result);
			dispatch(createPolitician(politicianObject))
		})
	};
};

// export const getScoreForPoliticians = () => {
//   return (dispatch, getState) => {
//     const state = getState()
//     let politiciansArray = state.politicians.politicians;
//     let issues = state.issues.issues
//     let politiciansWithScore;

//     return politiciansWithScore = politiciansArray.map(politician => {
//     	// if (politician.ppid === "B000944") { // only loop for one politician. I got to make sure that it works right for each issue
//     	// console.log('this is politician', politician)
//     	// const indIssue = state.issues.issues

//     	const polId = politician.ppid
//     	let totalScore = 0;
//     	let totalWeight = 0;
//     	for (let issue in issues) {
//     		// console.log('this is the issue', indIssue[issue].categoryId, 'and', indIssue[issue].included)
//     		if (indIssue[issue].included === true) {
//     			// console.log('this is issue', indIssue[issue], indIssue[issue].included)
//     			let rightScore;
// 				axios.get(`api/politicians/${polId}/${indIssue[issue].categoryId}`)  //
// 	    		.then(response => {
// 	    			let arrayOfScore = response.data 
// 	    			// console.log('this is the catscore', response.data, politician.fullName, issue)  
// 	    			if (arrayOfScore[0] === null) {
// 	    				rightScore = 50; // why does the array return null? 
// 	    			}
// 	    			else {
// 						if (indIssue[issue].score === 0) rightScore = arrayOfScore[0];
// 		    			if (indIssue[issue].score === 25) rightScore = arrayOfScore[1];
// 		    			if (indIssue[issue].score === 50) rightScore = arrayOfScore[2];
// 		    			if (indIssue[issue].score === 75) rightScore = arrayOfScore[3];
// 		    			if (indIssue[issue].score === 100) rightScore = arrayOfScore[4];
// 		    			totalWeight += indIssue[issue].weight; // weight does not increase even if it is important to user
// 		    			// console.log(totalWeight, 'this is totalWeight')
// 	    			}
// 	    			// console.log('the right score is', rightScore, indIssue[issue].weight);
// 	    			totalScore += rightScore * indIssue[issue].weight;
// 	    			// console.log('this is totalScore', totalScore)

// 	    			// totalAgreementScore += Number(totalScore / totalWeight) === totalScore/totalWeight ? (totalScore/totalWeight) : 0 ;  // what to put if the politician has no 
//             // console.log('this is TS and weight', totalScore/totalWeight, politician.fullName)
//             // console.log('this is the final politician', politiciansArray)

// 					return politician.totalAgreementScore = totalScore/totalWeight;
// 					// console.log('this is the array', arrayOfScores)
// 	    		})
// 	    		.then(() => dispatch(getPoliticians(politiciansArray)))
//     		}
//     	}
//     })


//     // around line 70, why does the catScore sometimes respond with null. How to deal with that? Do we assign a score of 0 becasue the politican did not vote?
//     // do we keep the weight? because if it is important for our user, then it should also be important for the politician?
//     // also, imagine that the user uses different issues to see agreement
//     // if the politician score is not added, then one politician who agrees on all issues but one might be ranked higher than another politician
//     // simply becasue he has no opinion on the issue. which does not necessarily make him in more agreement.

//   }
// }


export const getAllIssues = () => {
	return (dispatch, getState) => {
		let issues = {}
		axios.get('/api/issues')
		.then(response => {
			// console.log('this is the response', response.data)
			  response.data.map((issue, index) => {
				issues[issue[0]] = {
					id: ((issue[1].charCodeAt(0) - 64) * 100) + Number(issue[1].slice(1)),
					score: null,
					weight: 0,
					included: false,
					categoryId: issue[1],
					link: null
				}
			})
			  return issues;
		})
		.then(finalIssues => {
			dispatch(getIssues(finalIssues))
		})
	}
}

/* -------------       REDUCER     ------------------- */

// let inititialselectedState = store.issues.selectedState ? store.issues.selectedState : 'AA';

const initialState = {
	issueNumber: 0,
	issueValues: {},
	issues: {},
	states: { 'AK': 'Alaska',
			  'AL': 'Alabama',
			  'AR': 'Arkansas',
			  'AZ': 'Arizona',
			  'CA': 'California',
			  'CO': 'Colorado',
			  'CT': 'Connecticut',
			  'DE': 'Delaware',
			  'FL': 'Florida',
			  'GA': 'Georgia',
			  'HI': 'Hawaii',
			  'IA': 'Iowa',
			  'ID': 'Idaho',
			  'IL': 'Illinois',
			  'IN': 'Indiana',
			  'KS': 'Kansas',
			  'KY': 'Kentucky',
			  'LA': 'Louisiana',
			  'MA': 'Massachusetts',
			  'MD': 'Maryland',
			  'ME': 'Maine',
			  'MI': 'Michigan',
			  'MN': 'Minnesota',
			  'MO': 'Missouri',
			  'MS': 'Mississippi',
			  'MT': 'Montana',
			  'NC': 'North Carolina',
			  'ND': 'North Dakota',
			  'NE': 'Nebraska',
			  'NH': 'New Hampshire',
			  'NJ': 'New Jersey',
			  'NM': 'New Mexico',
			  'NV': 'Nevada',
			  'NY': 'New York',
			  'OH': 'Ohio',
			  'OK': 'Oklahoma',
			  'OR': 'Oregon',
			  'PA': 'Pennsylvania',
			  'RI': 'Rhode Island',
			  'SC': 'South Carolina',
			  'SD': 'South Dakota',
			  'TN': 'Tennessee',
			  'TX': 'Texas',
			  'UT': 'Utah',
			  'VA': 'Virginia',
			  'VT': 'Vermont',
			  'WA': 'Washington',
			  'WI': 'Wisconsin',
			  'WV': 'West Virginia',
			  'WY': 'Wyoming' },
	selectedState: 'AA',
	displayState: true,
	politicianScores: {
		// ppid : { Environment: 60, Taxes: 88}}
	}
}


const reducer = (state = initialState, action) => {

	const newState = Object.assign({}, state)

	switch (action.type){

		case ADD_ISSUE:
			newState.issueNumber = newState.issueNumber + 1;
			newState.issueValues[newState.issueNumber] = {value: 1, slidebar: 50}
			return newState;

		case ISSUE_CHANGE:
			newState.issueValues[action.index] = {value: action.value, slidebar: 50};
			return newState;

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

		case SCORE_CHANGE:
			newState.issueValues[action.index].slidebar = action.newValue;
			return newState;

		case DELETE_ISSUE:
			// iterate though issues and uninclude it
			for (let issue in newState.issues) {
				if (newState.issues[issue].link === action.linkId) {
					newState.issues[issue].included = false;
					newState.issues[issue].link = null;
					newState.issues[issue].score = null;
				} else if ( newState.issues[issue].included && newState.issues[issue].link >= action.linkId) {
					newState.issues[issue].link--;
				}
			}
			let newIssueValues = {};
			let num = 0
			for (let prop in newState.issueValues) {
				if (+prop !== action.linkId) newIssueValues[++num] = newState.issueValues[+prop]
			}
			newState.issueValues = newIssueValues;
			newState.issueNumber--;
			return newState;

		case CHANGE_SCORE_WEIGHT:
		for (let issue in newState.issues) {
			if (newState.issues[issue].id === action.issueId) {
				if ( newState.issues[issue].included === false) {
					newState.issues[issue].included = true

				}
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
		 	}
		}
		return newState;

		case STATE_CHANGE:
		newState.selectedState = action.state;
		return newState;

		case HIDE_STATE:
		newState.displayState = false;
		return newState;

		case GET_ISSUES:
		newState.issues = action.issues;
		return newState;

		case CREATE_POLITICIAN_SCORE:
		console.log('in reducer', action.politicianObject);
		newState.politicianScores = Object.assign({}, newState.politicianScores, action.politicianObject);
		return newState;

		default:
		return state
	}
}

export default reducer;
