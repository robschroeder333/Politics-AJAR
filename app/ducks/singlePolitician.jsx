import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */
const GET_SINGLE_POLITICIAN = 'GET_SINGLE_POLITICIAN';
const GET_POLITICIAN_INFO = 'GET_POLITICIAN_INFO';

/* ------------   ACTION CREATORS     ----------------- */
export const getSinglePolitician = (politician) => ({
  type: GET_SINGLE_POLITICIAN,
  politician
});

export const getPoliticianInfo = (id) => ({
  type: GET_POLITICIAN_INFO,
  id
});

/* -------------       REDUCER     ------------------- */

const initialState = {}

const reducer = (state = initialState, action) => {

  let newState = Object.assign({}, state)

  switch (action.type){

    case GET_SINGLE_POLITICIAN:
      newState = action.politician;
      return newState;

    case GET_POLITICIAN_INFO:
     axios.get(`/api/politicians/${action.id}`)
     .then(member => {
       newState.info = member.data;
      });
      return newState;

    default:
      return state;
    }
};

export default reducer;
