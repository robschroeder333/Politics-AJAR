import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaTwitterSquare, FaFacebookSquare, FaGlobe } from 'react-icons/lib/fa';
let ZingChart = require('zingchart-react').core;

const styles = {
  content: {
    marginTop: '5%',
  },
  ticket: {
    marginLeft: '10%',
  },
  memberInfo: {
    display: 'inline-block',
    margin: '2%',
  },
  image: {
    float: 'left',
  },
  address: {
    display: 'inline-block',
    paddingRight: '10px',
  },
  websites: {
    borderLeft: '2px solid black',
    display: 'inline-block',
    paddingLeft: '10px',
    hover: 'none',
  },
  issues: {
    display: 'inline-block',
    marginTop: '8%',
    marginLeft: '20%',
  },
  issue: {
    display: 'inline-block',
  },
  fontStyle : {
  fontFamily: 'Cormorant'
}

}

class Profile extends Component {
  constructor(props) {
    super(props)
    this.handleIssues = this.handleIssues.bind(this);
    this.addDefaultSrc = this.addDefaultSrc.bind(this);
  }

  addDefaultSrc(evt){
    evt.target.src = 'http://cdn.blackenterprise.com/wp-content/blogs.dir/1/files/2010/05/Congressional-seal.png'
  }

  handleIssues() {
    let issueArray = [];
    const issues = this.props.issues.issues;
    for (let prop in issues) {
      if (issues[prop].included && issues[prop].link) {
        issueArray[issues[prop].link - 1] = [prop, issues[prop]]
      }
    }
    let xAxis = [];
    let scoreValue = [];
    issueArray.forEach(issue => {
      let issueName = issue[0].slice(0, 5) + '...'
      xAxis.push(issueName)
      const politicianScores = this.props.issues.politicianScores[this.props.singlePolitician.ppid][issue[0]]
      // if (!politicianScores.length) scoreValue.push(Math.random() * 100)
      if (issue[1].score === 0) scoreValue.push(politicianScores[0])
      if (issue[1].score === 25) scoreValue.push(politicianScores[1])
      if (issue[1].score === 50) scoreValue.push(politicianScores[2])
      if (issue[1].score === 75) scoreValue.push(politicianScores[3])
      if (issue[1].score === 100) scoreValue.push(politicianScores[4])
    })
    return [xAxis, scoreValue];
  }

  render() {
    let chartConfig = {
      type: 'hbar',
      plot: {
        layout: 'auto'
      },
      title: {
        text: 'Issue Breakdown'
      },
      scaleX: {
        values: this.handleIssues()[0].reverse(),  // reverse order so issue adds to bottom
      },
      scaleY: {
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        step: 25,
        'min-value': 0,
        'max-value': 100
      },
      series: [
        { // score values
          values: this.handleIssues()[1].reverse()  // reverse order so score matches the reversed issue
        }
      ]
    };

    const politician = this.props.singlePolitician;
    return (
      <div style={styles.content}>
        <div style={styles.ticket}>
          <img
            className="img-fluid"
            onError={this.addDefaultSrc}
            src={`http://bioguide.congress.gov/bioguide/photo/${politician.ppid[0]}/${politician.ppid}.jpg`}
            style={styles.image}
          />
          <div style={styles.memberInfo}>
            <h1 style={styles.fontStyle}>{politician.fullName}</h1>
            <h2>{politician.chamberName} | {politician.partyName}</h2>
            <h2>{this.props.issues.states[politician.state]}</h2>
            <h2>{politician.totalAgreementScore}</h2>
            {
              politician.info
              ? (
                <div>
                  <div style={styles.address}>
                    <h6>{politician.info ? politician.info.office : ''}</h6>
                    <h6>Washington, D.C. 20510</h6>
                    <h6>{politician.info.phone}</h6>
                  </div>
                  <div style={styles.websites}>
                    <h6>
                      <a href={`https://twitter.com/${politician.info.twitter}?lang=en`}>
                      <FaTwitterSquare /> {`@${politician.info.twitter}`}
                    </a>
                    </h6>
                    <h6>
                      <a href={`https://www.facebook.com/${politician.info.facebook}/`}>
                        <FaFacebookSquare /> {`facebook.com/${politician.info.facebook}`}
                      </a>
                    </h6>
                    <h6>
                      <a href={politician.info.website}>
                        <FaGlobe /> website
                      </a>
                    </h6>
                  </div>
                </div>
              )
              : ''
            }
          </div>
        </div>
        <div style={styles.issues}>
          <ZingChart id="chart" height="400" width="600" data={chartConfig} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({singlePolitician, issues}) => {
  return {
    singlePolitician,
    issues,
    info: singlePolitician.info
  }
}

export default connect(mapStateToProps)(Profile);
