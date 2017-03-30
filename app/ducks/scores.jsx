// import axios from 'axios';
import store from '../store';
// import { selectPoliticianByState } from '../ducks/reducers';
import {setRenderScoreToFalse} from './issues'

/* -----------------    ACTIONS     ------------------ */
const GET_USSTATES = 'GET_STATES';
const GET_POLITICIAN = 'GET_POLITICIAN';
const GET_ISSUES = 'GET_ISSUES';
const GET_SCORES = 'GET_SCORES';

/* ------------   ACTION CREATORS     ----------------- */
export const getStates = (usstates) => ({
  type: GET_USSTATES,
  usstates
});

export const getPolitician = (politician, selectedState) => ({
  type: GET_POLITICIAN,
  politician,
  selectedState
});

export const getIssues = (issues, selectedState, selectedPoliticians) => ({
  type: GET_ISSUES,
  issues,
  selectedState,
  selectedPoliticians
});

export const getScores = (scores) => ({
  type: GET_SCORES,
  scores
});

export const setPoliticians = (state, issues) => {
  return (dispatch) => {
    // axios.get('/api/politicians')
    // .then(response => {
    //   // console.log('this is response data', response.data)
    //   dispatch(getPoliticians(response.data))
    // })
    // .catch(err => console.error(err))
    console.log('I was also visited');
    console.log('state is', state);
    console.log('issues are', issues);
    let selectedPoliticians = [];
    state.map(politician => {
      let politicianNameObject = {};
      politicianNameObject[politician.fullName] = {};
      selectedPoliticians.push(politician.fullName);
      dispatch(getPolitician(politician, issues.selectedState));
    });
    return dispatch(setRenderScoreToFalse());

  };
};


const initialState = {
  usstates: {'CA': {}}
}

// usstates: {
//     'CA': {
//       'Diane Feinstein' :{
//         'Environment': 48,
//         'Gun Control': 50
//       }
//      }
//   }
// }

// we're going to pass in the state filtered politicians by using 
// the selectPoliticianByState selector 


/* -------------       REDUCER     ------------------- */

const reducer = (state = initialState, action) => { // state = []

  let newState = Object.assign({}, state);

  switch (action.type){

    case GET_USSTATES:
    newState.usstates = action.usstates;
    return newState;

    case GET_POLITICIAN:
    console.log('state.usstates[action.selectedState]', state.usstates[action.selectedState]);
    newState.usstates[action.selectedState] = Object.assign({}, state.usstates[action.selectedState], action.politician);
    return newState;

    // case GET_ISSUES:
    // action.selectedPoliticians.map(politician => {
    //   newState.usstates[action.selectedState][politician]
    // Object.assign({}, newState.usstates[action.selectedState][politician], 
    // })
    //politicians.scores = action.politicians.scores;
    // return newState;

    // case GET_SCORES:
    // newState.politicians.scores = action.politicians.scores;
    // return newState;

    default:
      return state;
    }
};
function testFunction(){
  console.log("********INSIDE TEST FUNCITON")
}
export const selectScoresForSelectedPoliticians = (state, issues, scores) => {
  // console.log("IN SELECT SCORES")
  // testFunction()
  if(issues.renderScore){
    store.dispatch(setPoliticians(state, issues));
  }
  // return (dispatch) => {
  // let selectedPoliticians = [];
  // state.map(politician => {
  //   let politicianNameObject = {};
  //   politicianNameObject[politician.fullName] = {};
  //   selectedPoliticians.push(politician.fullName);
  //   dispatch(getPolitician(politician, issues.selectedState));
  // });


  //array of politicians
  // let filteredIssues = Object.keys(issues.issues).filter(key => issues.issues[key].included);
  // getIssues(filteredIssues, issues.selectedState, selectedPoliticians);
  //array of issues
  return scores.usstates[issues.selectedState];
  // console.log('filteredPoliticians', state);
  // console.log('issues.selectedState', issues.selectedState)
  // console.log('scores.usstates', scores.usstates)
  // return scores.usstates;
}


export default reducer;
