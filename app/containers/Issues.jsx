import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DropDownMenu, MenuItem, Checkbox, FloatingActionButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import Issue from '../components/Issue.jsx';

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  }
}

class Issues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      slidebar: 50
    }
    this.handleChange = this.handleChange.bind(this);
    this.listIssues = this.listIssues.bind(this);
  }

  handleChange(evt, newValue) {
    this.setState({slidebar: newValue})
  }

  listIssues() {
    const issues = this.props.issues;
    for (let issue in issues) {
      return (
        <MenuItem
          key={issue.id}
          primaryText={issue}
        />
      )
    }
  }

  render() {
    return (
      <div style={styles.block}>
          <Checkbox
            style={styles.checkbox}
          />
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}>
          {this.listIssues}
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

export default connect()(Issues);
