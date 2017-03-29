import React, { Component } from 'react';
import {connect} from 'react-redux';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import { FlatButton} from 'material-ui';


class StanceData extends Component {

	constructor(props){
		super(props)
		this.state = {
		}
		this.handleAddIssue =  this.handleAddIssue.bind(this);

	}

	handleAddIssue() {
		let newState = this.state.data;
		newState.push({name: 'Taxes', score: 89, amt: 2000})
		this.setState({data: newState})
	}

		
	render() {
		console.log('new data is', this.props)
	    return (
		<div>
		    <div>
		       <BarChart width={850} height={300} data={this.props.politicians.politicianData} // instead of this.state.data
		            margin={{top: 30, right: 30, left: 20, bottom: 5}}>
		       <XAxis dataKey="name"/>
		       <YAxis/>
		       <CartesianGrid strokeDasharray="3 3"/>
		       <Tooltip/>
		       <Legend />
		       <Bar dataKey="score" fill="#00d861" />
		      </BarChart>
	      </div>

			<FlatButton
				label="Add Issue"
				onClick={this.handleAddIssue}
			/>

	    </div>
	    )
    } 
}

const mapStateToProps = ({politicians}) => {
	return {
		politicians
	}
}

export default connect(mapStateToProps)(StanceData)