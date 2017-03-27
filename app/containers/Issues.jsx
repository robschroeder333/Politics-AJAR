import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DropDownMenu, MenuItem, Checkbox, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Issue from '../components/Issue.jsx';
import {modifyIncludedIssue, modifyScoreAndWeight, addIssue, issueChange, scoreChange} from '../ducks/issues'

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

   renderIssues() {
    const {issues, issueValues, issueNumber} = this.props.issues;
    let issuesList = [];

    for (let i = 1; i <= issueNumber; i++) {
      issuesList.push(
          <div key={i}>
           <DropDownMenu value={issueValues[i].value} autoWidth={true} onChange={(event, index, value) => this.handleMenuChange(i, value)} maxHeight={300} labelStyle={{color: 'black', fontWeight: 'bold'}}>
           <MenuItem value={1} primaryText="Select Issue" />
             {Object.keys(issues).map((issue, index) => <MenuItem value={issues[issue].id} key={issues[issue].id} primaryText={issue} /> )}
           </DropDownMenu>

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
        <Checkbox  style={styles.checkbox} />

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
const mapStateToProps = ({issues, issueValues, issueNumber}) => {
  return {
    issues,
    issueValues,
    issueNumber
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
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(Issues);