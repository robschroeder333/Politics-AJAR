import React from 'react';
import { Link } from 'react-router';


const style = {
  marginLeft: 600
}

const Politician = (props) => {
  const politician = props.politician;
  return (
    <Link to="#">
      <div className="row well" style={style}>
        <div className="col-sm-2">
          <img src="http://static.tvgcdn.net/mediabin/galleries/shows/s_z/si_sp/spongebob_squarepants/season1/sponge-bob-square-pants11.jpg"
          style={{height: '50px', width: '100px'}}
          />
        </div>
        <div className="col-sm-4">
          <h3>{politician.fullName}</h3>
          <h6>{politician.partyName}</h6>
          <h6>{politician.chamberName}</h6>
          <h6> {politician.state} </h6>           
        </div>
      </div>
    </Link>
  )
}

export default Politician;
