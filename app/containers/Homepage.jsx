import React, {Component} from 'react';
import {connect} from 'react-redux';
import { DropDownMenu, MenuItem, FloatingActionButton, FlatButton } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { FaMinusCircle } from 'react-icons/lib/fa';
import { Link } from 'react-router';
import Issue from '../components/Issue.jsx';
import {modifyIncludedIssue, modifyScoreAndWeight, addIssue, issueChange, scoreChange} from '../ducks/issues';
import QuotesComponent from '../components/Quotes.jsx'

let imgUrl = 'http://static2.businessinsider.com/image/577548084321f171088b5334-1190-625/the-story-of-the-only-man-who-signed-the-declaration-of-independence-and-recanted-his-signature.jpg';

const styles = {
  align: {
    textAlign: 'center',
  },
  homepage: {
    backgroundImage: 'url(' + imgUrl + ')',
  	height: 600,
  	backgroundSize: 'cover',
    overflow: 'hidden',
  },
  title: {
  	color: 'white',
  	fontSize: 75,
  	marginTop: 50,
  	fontFamily: 'Roboto',
  	fontWeight: 'bold'
  },
  buttonSlider: {
  	marginTop: 150
  },
  blocks: {
  	display: 'block',
  	fontSize: 30,
  	marginTop: 40
  }
}


class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
            // issueValues: {},
            // IssueNumber: 0
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
           <DropDownMenu value={issueValues[i].value} autoWidth={true} onChange={(event, index, value) => this.handleMenuChange(i, value)} maxHeight={300} labelStyle={{color: 'white', fontWeight: 'bold', fontSize: '25px'}}>
           <MenuItem value={1} primaryText="Select Issue" />
             {Object.keys(issues).map((issue, index) => <MenuItem value={issues[issue].id} key={issues[issue].id} primaryText={issue} /> )}
           </DropDownMenu>

           <div  >
           <Issue
             value={issueValues[i].slidebar}
             handleChange={(evt, newValue) => this.handleChange(i, newValue)}
             style={styles.description} 
           />
           </div>
         </div>
       )
      }
    return issuesList;
   }

  render() {
    const {issues, issueValues, issueNumber} = this.props.issues;
    console.log('these are props', issueNumber)
    return (
    <div style={styles.blocks} >
    <div style={styles.homepage} >
      <div style={styles.align} >

      	<h1 style={styles.title}> POLITICS AJAR </h1> 
        <div style={styles.buttonSlider} >
          { this.renderIssues() }
        </div>

        { (issueNumber <= 0) ? 
	        <FloatingActionButton
	          mini={true}
	          secondary={true}
	          onClick={this.handleChangeIssueNumbers}>
	          <ContentAdd />
	        </FloatingActionButton>
	        :
	        <div >
	        <Link to="/displayPoliticians" >
	             <FlatButton
			      label="SUBMIT"
			      backgroundColor="white"
      			  hoverColor="#77dfff"
      			  primary={true}
			    />
			 </Link>
        	 </div>
        }
      </div>
     </div>
     <div style={styles.blocks} >
     <QuotesComponent />
     </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);