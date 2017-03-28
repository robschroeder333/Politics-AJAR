import React from 'react';

const Profile = (props) => {
  const politician = props.politician;
  console.log('props in profile', this)
  return (
    <div>
      {/* <img
        className="img-fluid"
        src={`http://bioguide.congress.gov/bioguide/photo/${politician.ppid[0]}/${politician.ppid}.jpg`}
        style={{maxWidth: '25%', float: 'left'}}
      /> */}
      {/* <h3>{politician.fullName}</h3>
      <h6>{politician.chamberName} | {politician.partyName}</h6>
      <h6>{politician.state}</h6>
      <h6>{politician.totalAgreementScore}</h6> */}

      <div style={{float: 'right'}}>
        <a href="">Twitter</a>
        <a href="">Facebook</a>
        <a href="">Website</a>
      </div>
      <h6>Office Address</h6>
      <h6>Phone</h6>


    </div>
  )
}

export default Profile;
