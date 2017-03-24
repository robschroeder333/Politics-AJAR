import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DropDownMenu, MenuItem, Checkbox, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Issue from '../components/Issue.jsx';
import {modifyIncludedIssue, modifyScoreAndWeight} from '../ducks/issues'

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
            value: 1,
            slidebar: 50,
    }
    this.handleChange = this.handleChange.bind(this);
    // this.listIssues = this.listIssues.bind(this); // What is this for?
    this.handleMenuChange = this.handleMenuChange.bind(this);
  }

  handleChange(evt, newValue) {
    this.setState({slidebar: newValue})
    // console.log('this is value', this.state.value, 'and this is score', newValue)
    this.props.changeScore(this.state.value, newValue)
  }

  handleMenuChange(event, index, value) {
    this.setState({value: value})
    // console.log('this is value', value)
    this.props.includeOrNot(value)
  }

  render() {
    const {issues} = this.props.issues;
    console.log('Issues component rendering, these are issues', issues)
    return (
      <div style={styles.block}>
        <Checkbox  style={styles.checkbox} />

        <DropDownMenu value={this.state.value} onChange={this.handleMenuChange}>
          {Object.keys(issues).map((issue, index) => <MenuItem value={issues[issue].id} key={issues[issue].id} primaryText={issue} /> )}
        </DropDownMenu>

        <Issue
          value={this.state.slidebar}
          handleChange={this.handleChange}
        />

        <FloatingActionButton
          mini={true}
          secondary={true}>
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
  includeOrNot(issueId){  // dispatched if an issue is selected in drop down menu
    dispatch(modifyIncludedIssue(issueId)) // in order to turn the include to true and be
    // able to use the issue in the calculation later
  },
  changeScore(issueId, score){ // disptached in order to change the score/importance of each issue
    dispatch(modifyScoreAndWeight(issueId, score)) // for the user within the array
  } // dispatched when the slider moves
})

export default connect(mapStateToProps, mapDispatchToProps)(Issues);