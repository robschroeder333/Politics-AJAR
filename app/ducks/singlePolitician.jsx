import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */
const GET_SINGLE_POLITICIAN = 'GET_SINGLE_POLITICIAN'

/* ------------   ACTION CREATORS     ----------------- */
export const getSinglePolitician = (politician) => ({
  type: GET_SINGLE_POLITICIAN,
  politician
})

/* -------------       REDUCER     ------------------- */

const initialState = {
  politician: {}
}

const reducer = (state = initialState, action) => {

  let newState = Object.assign({}, state)

  switch (action.type){

    case GET_SINGLE_POLITICIAN:
      newState.politician = action.politician;
      // newState.politicians = action.politicians;
      console.log('in reducer for single politician', action.politician, 'and', newState)
      return newState;

    default:
      return state;
    }
};

export default reducer;
