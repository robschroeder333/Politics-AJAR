import React from 'react';
import { Link } from 'react-router';


const style = {
  marginLeft: '0%'
}

const Politician = (props) => {
  const politician = props.politician;
  return (
    <Link to="#">
      <div className="row" style={style}>
        <div className="col-sm-2">
          <img
            src="https://i.ytimg.com/vi/jkZf_J3wqYc/maxresdefault.jpg"
            style={{height: '50px', width: '100px'}}
          />
        </div>
        <div className="col-sm-4">
          <h3>{politician.fullName}</h3>
          <h6>{politician.partyName}</h6>
          <h6>{politician.chamberName}</h6>
          <h6>{politician.state}</h6>
        </div>
      </div>
    </Link>
  )
}

export default Politician;
