import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DropDownMenu, MenuItem, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { FaMinusCircle } from 'react-icons/lib/fa';

import Issue from '../components/Issue.jsx';
import {modifyIncludedIssue, modifyScoreAndWeight, addIssue, issueChange, scoreChange, deleteIssue, stateChange, hideState} from '../ducks/issues'


const styles = {
  block: {
    maxWidth: 250
  },
  delete: {
    marginTop: '20px',
    color: 'red',
    display: 'inline'
  },
  dropdown: {
    display: 'inline'
  },
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
    this.props.scoreChange(index, newValue)
    const itemValue = this.props.issues.issueValues[index].value
    // const updatedIssueValues = Object.assign({}, this.state.issueValues);
    // updatedIssueValues[index] = { value: itemValue, slidebar: newValue };
    // this.setState({issueValues: updatedIssueValues})
    this.props.changeScore(itemValue, newValue)
  }

  handleMenuChange(index, value) {
    this.props.issueChange(index, value)
    // const updatedIssueValues = Object.assign({}, this.state.issueValues);
    // updatedIssueValues[index] = {value: value, slidebar: 50};
    // this.setState({issueValues: updatedIssueValues})
    this.props.includeOrNot(value)

  }

  handleChangeIssueNumbers() {
    this.props.addIssue()
    // let stateChanges = {};
    // stateChanges.IssueNumber = this.state.IssueNumber+1;
    // stateChanges.issueValues = Object.assign({}, this.state.issueValues);
    // stateChanges.issueValues[this.state.IssueNumber+1] = { value: 1, slidebar: 50 };

     // this.setState(stateChanges)
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
    const {issues, issueValues, issueNumber} = this.props.issues;
    let issuesList = [];

    for (let i = 1; i <= issueNumber; i++) {
      issuesList.push(
          <div key={i}>
           <DropDownMenu 
             value={issueValues[i].value} 
             autoWidth={true} 
             onChange={(event, index, value) => this.handleMenuChange(i, value)} 
             maxHeight={300} 
             labelStyle={{color: 'black', fontWeight: 'bold'}}
           >
           <MenuItem value={1} primaryText="Select Issue" disabled={true} />
              {
                //TODO: FIX slider reverts to 50 from 0 when another is changed
                Object.keys(issues).map((issue) => {
                  return (
                    (issues[issue].included)
                    ? <MenuItem
                      value={issues[issue].id}
                      key={issues[issue].id}
                      primaryText={issue}
                      disabled
                    />
                    : <MenuItem
                      value={issues[issue].id}
                      key={issues[issue].id}
                      primaryText={issue}
                    />
                  )
                })
              }
             
           </DropDownMenu>

           <FaMinusCircle
              style={styles.delete}
              value={issueValues[i].value}
              onClick={() => {this.handleDeleteIssue(i, issueValues[i].value)}}
            />         
          
           <Issue
             value={issueValues[i].slidebar}
             handleChange={(evt, newValue) => this.handleChange(i, newValue)}
           />
         </div>
       )
      }
    return issuesList;
   }

  render() {
    const {issues, issueValues, issueNumber} = this.props.issues;

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
const mapStateToProps = ({issues, issueValues, issueNumber, states, selectedState, displayState}) => {
  return {
    issues,
    issueValues,
    issueNumber,
    states,
    selectedState,
    displayState
  }
}

const mapDispatchToProps = (dispatch) => ({
  includeOrNot(issueId){  
    dispatch(modifyIncludedIssue(issueId)) 
  },
  changeScore(issueId, score){ 
    dispatch(modifyScoreAndWeight(issueId, score))
  },
  addIssue(){
    dispatch(addIssue())
  },
  issueChange(index, value){
    dispatch(issueChange(index, value))
  },
  scoreChange(index, newValue){
    dispatch(scoreChange(index, newValue))
  }, 
  removeIssue(issueId, linkId) {
    dispatch(deleteIssue(issueId, linkId))
  },
  stateChange(state) {
    dispatch(stateChange(state))
  },
  hideState(){
    dispatch(hideState())
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(Issues);

