import axios from 'axios';
import store from '../store';

/* -----------------    ACTIONS     ------------------ */
const GET_POLITICIANS = 'GET_POLITICIANS'

/* ------------   ACTION CREATORS     ----------------- */

export const getPoliticians = (politicians) => ({
  type: GET_POLITICIANS,
  politicians
})

export const getAllPoliticians = () => {
  return dispatch => {
    axios.get('/api/politicians')
    .then(response => {
      dispatch(getPoliticians(response.data))
    })
    .catch(err => console.error(err))
  }
}

// possible 
const initialState = {
  politicians: []
}


/* -------------       REDUCER     ------------------- */

const reducer = (state = [] , action) => { // state = initialState

  // let newState = Object.assign({}, state)

  switch (action.type){

    case GET_POLITICIANS:
      return action.politicians
      // newState.politicians = action.politicians
      // return newState;

    default:
      return state;
    }
};

export default reducer;

// how can I loop through the politicians array within the state and use the variables in the other state
// to render a new politician array. 


// get weight of importance for each user when input changes
// now weight for each issue is in the state for each issue
// to calculate the TAS for each politician
  // loop through state of issues.
      // if issue included is true, look up score of member on issue
      // return array of score for issue
      // use the score in the state to select right Single Agreement Score.
      // store to the politicians object as total Score if it does not exist 
        // total score : scores (which is going to be incremented) / weight (also variable that will be incremented)
      // continue looping
      // if issue is false, keep going
      // if next issue is true, then look up politician score array for that issue (with categoryId)
      // use score to select the right score
      // add score*weight to scores, add weight to weight variable
      // keep looping
      // when loop over, add TAS to the politician object. 
      // 