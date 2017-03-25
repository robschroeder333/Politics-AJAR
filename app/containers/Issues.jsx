import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DropDownMenu, MenuItem, Checkbox, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FaMinusCircle from 'react-icons/lib/fa/minus-circle';
import { modifyIncludedIssue, modifyScoreAndWeight, deleteIssue } from '../ducks/issues'
import Issue from '../components/Issue.jsx';

const styles = {
  block: {
    maxWidth: 250
  },
  checkbox: {
    marginBottom: 16
  }
}

class Issues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issueValues: {},
      IssueNumber: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleChangeIssueNumbers =  this.handleChangeIssueNumbers.bind(this);
    this.renderIssues =  this.renderIssues.bind(this);
    this.handleDeleteIssue = this.handleDeleteIssue.bind(this);
  }

  handleChange(index, newValue) {
    const itemValue = this.state.issueValues[index].value
    const updatedIssueValues = Object.assign({}, this.state.issueValues);
    updatedIssueValues[index] = { value: itemValue, slidebar: newValue };
    this.setState({issueValues: updatedIssueValues})
    this.props.changeScore(itemValue, newValue)
  }

  handleMenuChange(index, value) {
    const updatedIssueValues = Object.assign({}, this.state.issueValues);
    updatedIssueValues[index] = {value: value, slidebar: 50};
    this.setState({issueValues: updatedIssueValues})
    this.props.includeOrNot(value, index)
  }

  handleChangeIssueNumbers() {
    let stateChanges = {};
    stateChanges.IssueNumber = this.state.IssueNumber + 1;
    stateChanges.issueValues = Object.assign({}, this.state.issueValues);
    stateChanges.issueValues[this.state.IssueNumber + 1] = { value: 1, slidebar: 50 };

    this.setState(stateChanges)
  }

  handleDeleteIssue(index, value) {
    const issueValues = this.state.issueValues;
    let newIssueValues = {};
    let num = 0
    for (let prop in issueValues) {
      if (issueValues.hasOwnProperty) {
        if (+prop !== index) newIssueValues[++num] = issueValues[+prop]
      }
    }
    // deletes the dropdown issue component
    this.setState({issueValues: newIssueValues, IssueNumber: --this.state.IssueNumber});
    // dispatched and removes link to issue
    this.props.removeIssue(value, index)
  }

   renderIssues() {
    const { issues } = this.props.issues;
    let issuesList = [];
    for (let i = 1; i <= this.state.IssueNumber; i++) {
      issuesList.push(
        <div key={i}>
          <div className="row">
            {/* <Checkbox
              className="col-sm-2"
              style={styles.checkbox}
            /> */}
            <DropDownMenu
              className="col-sm-8"
              value={this.state.issueValues[i].value}
              onChange={(event, index, value) =>  this.handleMenuChange(i, value)}
            >
            <MenuItem className="col-sm-12" value={1} primaryText="Select Issue" />
              {
                Object.keys(issues).map((issue) => {
                  return (
                    <MenuItem
                      value={issues[issue].id}
                      key={issues[issue].id}
                      primaryText={issue}
                    />
                  )
                })
              }
            </DropDownMenu>

            <FaMinusCircle
              style={{color: 'red', float: 'right'}}
              value={this.state.issueValues[i].value}
              onClick={() => {this.handleDeleteIssue(i, this.state.issueValues[i].value)}}
            />

          </div>
          <Issue
            value={this.state.issueValues[i].slidebar}
            handleChange={(evt, newValue) => this.handleChange(i, newValue)}
          />
        </div>
       )
      }
    return issuesList;
   }

  render() {
    const {issues} = this.props.issues;
    // console.log(this.state);
    console.log('Issues component rendering, these  are issues', issues)
    return (
      <div style={styles.block}>

        <div>
          { this.renderIssues() }
        </div>

        <FloatingActionButton
          mini={true}
          secondary={true}
          onClick={this.handleChangeIssueNumbers}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

/* REDUX CONTAINER */
const mapStateToProps = ({issues}) => {
  return {
    issues
  }
}

const mapDispatchToProps = (dispatch) => ({
  includeOrNot(issueId, linkId){  // dispatched if an issue is selected in drop down menu
    dispatch(modifyIncludedIssue(issueId, linkId)) // in order to turn the include to true and be
    // able to use the issue in the calculation later
  },
  changeScore(issueId, score){ // disptached in order to change the score/importance of each issue
    dispatch(modifyScoreAndWeight(issueId, score)) // for the user within the array
  }, // dispatched when the slider moves
  removeIssue(issueId, linkId) {
    dispatch(deleteIssue(issueId, linkId))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Issues);
