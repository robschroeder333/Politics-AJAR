import React from 'react';
import { Link } from 'react-router';
import { Paper } from 'material-ui';

const style = {
  margin: 20,
  display: 'inline-block',
  padding: '2%',
  width: '80%'
};

const Politician = (props) => {
  const politician = props.politician;

  return (
    <Link to="#">
      <Paper
        style={style}
        zDepth={2}
      >
        <img
          src="https://i.ytimg.com/vi/jkZf_J3wqYc/maxresdefault.jpg"
          style={{height: '50px', width: '100px'}}
        />
        <div style={{float: 'right', paddingLeft: '2%'}}>
          <h3>{politician.fullName}</h3>
          <h6>{politician.chamberName} | {politician.partyName}</h6>
          <h6>{politician.state}</h6>
          <h6>{politician.totalAgreementScore}</h6>
        </div>
      </Paper>
    </Link>
  )
}

export default Politician;
