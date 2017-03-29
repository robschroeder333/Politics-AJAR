import React from 'react';
import { Link } from 'react-router';
import { Paper } from 'material-ui';

const style = {
  margin: 20,
  display: 'inline-block',
  padding: '2%',
  width: '80%',
  height: '80%'
};

const Politician = (props) => {
  const politician = props.politician;
  return (
    <Link to={`/politicians/${politician.ppid}`}>
      <Paper
        style={style}
        zDepth={2}
      >
        <div>
        <img
          className="img-fluid"
          src={`http://bioguide.congress.gov/bioguide/photo/${politician.ppid[0]}/${politician.ppid}.jpg`}
          style={{maxWidth: '25%', float: 'left'}}
        />
      </div>
        <div style={{display: 'inline-block', paddingLeft: '2%'}}>
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
