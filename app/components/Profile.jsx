import React, { Component } from 'react';
import { connect } from 'react-redux';

const styles = {
  content: {
    marginTop: '5%',
    marginLeft: '10%'
  },
  memberInfo: {
    display: 'inline-block',
    margin: '2%'
  },
  image: {
    float: 'left'
  },
  address: {
    display: 'inline-block',
    paddingRight: '10px'
  },
  websites: {
    borderLeft: '2px solid black',
    display: 'inline-block',
    paddingLeft: '10px'
  },
  issues: {
    display: 'block',
    marginTop: '8%'
  },
  issue: {
    display: 'inline-block',
  }
}

class Profile extends Component {
  constructor(props) {
    super(props)
    this.handleIssues = this.handleIssues.bind(this);
  }

  handleIssues() {
    let issueArray = [];
    const issues = this.props.issues.issues;
    for (let prop in issues) {
      if (issues[prop].included && issues[prop].link) {
        issueArray[issues[prop].link] = [prop, issues[prop]]
      }
    }
    return issueArray.map((issue) => {
      return (
        <div key={issue[1].link}>
          <h3 style={styles.issue}>{issue[0]}</h3>
          <h3 style={styles.issue}>{issue[1].score}</h3>
        </div>
      )
    })
  }

  render() {
    const politician = this.props.singlePolitician;
    return (
      <div style={styles.content}>
        <div>
          <img
            className="img-fluid"
            src={`http://bioguide.congress.gov/bioguide/photo/${politician.ppid[0]}/${politician.ppid}.jpg`}
            style={styles.image}
          />
          <div style={styles.memberInfo}>
            <h1>{politician.fullName}</h1>
            <h2>{politician.chamberName} | {politician.partyName}</h2>
            <h2>{politician.state}</h2>
            <h2>{politician.totalAgreementScore}</h2>

            <div style={styles.address}>
              <h6>{politician.info.office}</h6>
              <h6>Washington, D.C. 20510</h6>
              <h6>{politician.info.phone}</h6>
            </div>
            <div style={styles.websites}>
              <h6><a href={`https://twitter.com/${politician.info.twitter}?lang=en`}>{`@${politician.info.twitter}`}</a></h6>
              <h6><a href={`https://www.facebook.com/${politician.info.facebook}/`}>{`facebook.com/${politician.info.facebook}`}</a></h6>
              <h6><a href={politician.info.website}>website</a></h6>
            </div>
          </div>
        </div>
        <div style={styles.issues}>
          {this.handleIssues()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({singlePolitician, issues}) => {
  return {
    singlePolitician,
    issues
  }
}

export default connect(mapStateToProps)(Profile);
