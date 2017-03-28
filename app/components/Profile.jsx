import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'

class Profile extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const politician = this.props.politician;
    console.log('props', this.props)
    return (
      <div>
        <img
          className="img-fluid"
          src={`http://bioguide.congress.gov/bioguide/photo/${politician.ppid[0]}/${politician.ppid}.jpg`}
          style={{maxWidth: '25%', float: 'left'}}
        />
        <h1>{politician.fullName}</h1>
        <h2>{politician.chamberName} | {politician.partyName}</h2>
        <h2>{politician.state}</h2>
        <h2>{politician.totalAgreementScore}</h2>

        <div style={{float: 'right'}}>
          <a href="">@twitterHandle</a>
          <a href="">facebook.com/generalPalpateen</a>
          <a href="">bigbrother.gov/gotcha</a>
        </div>
        <h6>77 7th Street</h6>
        <h6>New York, NY 11111</h6>
        <h6>(555) 555-5555</h6>


      </div>
    )
  }
}

const mapStateToProps = ({politicians}) => {
  return {
    politicians
  }
}

export default connect(mapStateToProps)(Profile);
