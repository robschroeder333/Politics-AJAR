import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */
const GET_SINGLE_POLITICIAN = 'GET_SINGLE_POLITICIAN';
const GET_POLITICIAN_INFO = 'GET_POLITICIAN_INFO';

/* ------------   ACTION CREATORS     ----------------- */
export const getSinglePolitician = (politician) => ({
  type: GET_SINGLE_POLITICIAN,
  politician
});

export const getPoliticianInfo = (info) => ({
  type: GET_POLITICIAN_INFO,
  info
});

export const fetchPoliticianInfo = (id) => {
  return (dispatch, getState) => {
    axios.get(`/api/politicians/${id}`)
    .then(response => {
      dispatch(getPoliticianInfo(response.data))
    })
    .catch(err => console.error(err))
  }
}

/* -------------       REDUCER     ------------------- */

const initialState = {}

const reducer = (state = initialState, action) => {

  let newState = Object.assign({}, state)

  switch (action.type){

    case GET_SINGLE_POLITICIAN:
      newState = action.politician;
      return newState;

    case GET_POLITICIAN_INFO:
      newState.info = action.info;
      return newState;

    default:
      return state;
    }
};

export default reducer;
