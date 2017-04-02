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

const fontStyle = {
  fontFamily: 'Cormorant'
}

const addDefaultSrc = (evt) => {
  evt.target.src = 'http://cdn.blackenterprise.com/wp-content/blogs.dir/1/files/2010/05/Congressional-seal.png';
}

const Politician = (props) => {
  const politician = props.politician;
  // console.log(politician);
  return (
    <Link to={`/politicians/${politician.ppid}`}>
      <Paper
        style={style}
        zDepth={2}
      >
        <div>
        <img
          className="img-fluid"
          onError={addDefaultSrc}
          src={`http://bioguide.congress.gov/bioguide/photo/${politician.ppid[0]}/${politician.ppid}.jpg`}
          style={{maxWidth: '20%', float: 'left'}}
        />
      </div>
        <div style={{display: 'inline-block', paddingLeft: '2%'}}>
          <h3 style={fontStyle}>{politician.fullName}</h3>
            <h6>{politician.chamberName} | {politician.partyName}</h6>
            <div style={{display: 'inline-block'}}>
            <h6>{politician.state}</h6>
          </div>
        </div>
        <div style={{style: 'inline-block', float: 'right', fontWeight: 'strong', border: 'black solid 2px', padding: '2%', marginTop: '50px'}}>
          <h6>{politician.totalAgreementScore + '%'}</h6>
        </div>
      </Paper>
    </Link>
  )
}

export default Politician;
