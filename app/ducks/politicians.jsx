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


// after this, politicians will be added as a property to the state, as an array 
// full of politicians object

export const getAllPoliticians = () => {
  return dispatch => {
    axios.get('/api/politicians')
    .then(response => {
      dispatch(getPoliticians(response.data))
    })
    .then(() => {
      dispatch(getScoreForPoliticians())
    })
    // .then(() => {
    //   dispatch(addScoreToPoliticians())
    // })
    .catch(err => console.error(err))
  }
}


/* -------------       REDUCER     ------------------- */

const reducer = (state = [] , action) => { // state = []

  let newState = Object.assign({}, state)

  switch (action.type){

    case GET_POLITICIANS:
    // console.log('in reducer, this is array', action.politicians)
      return action.politicians
    // newState.politicians = action.politicians
    // console.log('this is the new state', newState) // state comes back as {politicians: Array[8]}
    // return newState

    default:
      return state;
    }
};

export default reducer;