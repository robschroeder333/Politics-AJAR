import axios from 'axios';
import store from '../store';
import {getScoreForPoliticians, addScoreToPoliticians} from './issues'

/* -----------------    ACTIONS     ------------------ */
const GET_POLITICIANS = 'GET_POLITICIANS'

/* ------------   ACTION CREATORS     ----------------- */
export const getPoliticians = (politicians) => ({
  type: GET_POLITICIANS,
  politicians
})

export const getAllPoliticians = () => {
  return (dispatch, getState) => {
    axios.get('/api/politicians')
    .then(response => {
      // console.log('this is response data', response.data)
      dispatch(getPoliticians(response.data))
    })
    .catch(err => console.error(err))
  }
}


const initialState = {
  politicians: []
}

/* -------------       REDUCER     ------------------- */

const reducer = (state = initialState, action) => { // state = []

  let newState = Object.assign({}, state)

  switch (action.type){

    case GET_POLITICIANS:
    newState.politicians = action.politicians;
    return newState;

    default:
      return state;
    }
};

export const selectPoliticianByState = (state, issues) => {
  return state.politicians.filter(politician => politician.state.match(issues.selectedState))
}


export default reducer;
