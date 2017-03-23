import axios from 'axios';

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

/* -------------       REDUCER     ------------------- */

const reducer = (state = [], action) => {
  switch (action.type){
    case GET_POLITICIANS:
      return action.politicians
    default:
      return state;
    }
};

export default reducer;
