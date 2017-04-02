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
		let politicianObject = politicianScore;
		for (let i = 0; i < statePoliticians.length; i++) {
			for (let j = 0; j < includedIssues.length; j++) {
				if (politicianScore[statePoliticians[i].ppid] && politicianScore[statePoliticians[i].ppid][includedIssues[j]]) {
					// console.log('true')
					//skip in this case
				}
				else {
					// console.log('statePoliticians[i]', statePoliticians[i]);
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

// export const getTotalScores = () => {
// 	console.log('and we also get here');
// 	return (dispatch, getState) => {
// 		console.log('but I do not think we are here');
// 		let state = getState();
// 		// let issues = state.issues.issues; //need this for categoryId
// 		let politicianScore = state.issues.politicianScores;

// 		let politicianId = Object.keys(politicianScore);
// 		let politicianObject = politicianScore;

// 		for (let i = 0; i < politicianId.length; i++){
// 			politicianObject.politicianId[i].totalAgreementScore = 50;
// 		}
// 		console.log('politicianObject is', politicianObject);
// 		dispatch(createPolitician(politicianObject));
	
// 	};
// };

export const getScores = () => {
	return (dispatch, getState) => {

		let state = getState();
		// let politicians = state.politicians.politicians;
		let issues = state.issues.issues; //need this for categoryId
		let issueValues = state.issues.issueValues;
		let politicianScore = state.issues.politicianScores;

		let politicianId = Object.keys(politicianScore);
		let arrayOfPromises = [];
		let promisesArrayIndexes = [];
		let politicianObject = politicianScore;

		// console.log('politicianId.length is first', politicianId.length);

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
			// console.log('promises are', promises)
			// return promises.map((promise, index) => {
			// 	politicianScore[politicianId[index]][promisesArrayIndexes[index]] = promise.data;
			// });
			return promises.map((promise, index) => {
				// console.log('politicianId[index]', politicianId[index]);
				// console.log('[promisesArrayIndexes[index]]', [promisesArrayIndexes[index]]);
				// console.log('promise.data', promise.data);
				politicianObject[politicianId[index]][promisesArrayIndexes[index]] = promise.data;
			});
		})
		.then(() => {
			// console.log('politicianObject is', politicianObject)
			// console.log('slider values can be found on', issueValues);
			console.log('issue ids can be found on', issues);
			for (let i = 0; i < politicianId.length; i++){
				let denominator = 0;
				let numerator = 0;
				for (let sliderValues in issueValues){
					for (let issueNames in issues){
						if (issueValues[sliderValues].value === issues[issueNames].id){
							console.log('politicianObject[politicianId[i]][issueNames] is', politicianObject[politicianId[i]][issueNames]);
							numerator += (issues[issueNames].weight * politicianObject[politicianId[i]][issueNames][issues[issueNames].score / 25]);
							denominator += issues[issueNames].weight;
						}
					}

				}
				console.log('numerator is', numerator);
				console.log('denominator is', denominator);
				politicianObject[politicianId[i]].totalAgreementScore = numerator / denominator;
			}
			// console.log('politicianObject is', politicianObject)
		})
		.then(() => {
			dispatch(createPolitician(politicianObject));
		});
	};
};

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
				};
			});
			  return issues;
		})
		.then(finalIssues => {
			dispatch(getIssues(finalIssues));
		});
	};
};

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
};


const reducer = (state = initialState, action) => {

	const newState = Object.assign({}, state);

	switch (action.type){

		case ADD_ISSUE:
			newState.issueNumber = newState.issueNumber + 1;
			newState.issueValues[newState.issueNumber] = {value: 1, slidebar: 50};
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
		// console.log('in reducer', action.politicianObject);
		newState.politicianScores = Object.assign({}, newState.politicianScores, action.politicianObject);
		return newState;

		default:
		return state
	}
}

export default reducer;
