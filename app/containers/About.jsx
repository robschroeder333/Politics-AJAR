import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Paper, AppBar} from 'material-ui';
import {Link} from 'react-router';
import { browserHistory } from 'react-router'


const style = {
  height: 200,
  width: 200,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
  margin: 80
};

class About extends Component {
	constructor(props){
		super(props)
		this.goToHome = this.goToHome.bind(this)
	}

	goToHome(){
		browserHistory.push('/home')

	}

	render(){

		return(

			<div>
			<AppBar
				title=""
				style={{backgroundColor: '#596cff'}}
				onLeftIconButtonTouchTap={this.goToHome}
		 	/>

			<div >
			<h2 style={{textAlign: 'center', color: '#596cff', fontFamily: 'Roboto', fontSize: 40, marginTop: 90}}> Knowledge is power </h2>
			<h4 style={{textAlign: 'justify', fontFamily: 'Roboto', fontSize: 20, marginTop: 55, marginRight: 50, marginLeft: 50}}> 
			Politics AJAR was born out of our common realization that there is no 
			centralized space of information to look at the members of the Senate
			and the house of Representatives and their different stance on the multitude of political issues in the United States.
			In order for people to make the right decision, it is important for them to have access to complete information.
			In order for people to elect the right representatives, it is  important to create a system of transparency
			and a way for the public to analyze and compare the views of the different candidates. Politics AJAR is our attempt to create this
			system. Through the work of the great people of ProPublica, we were able to receive information about the 500+ members of the legislative 
			branch and their past votes on passed bills, and thanks to the hardwork of the people at Maplight, we were able to deduce the stance of these 
			bills by analyzing the type of organization that supported and opposed these numerous bills. Understanding the political issue and the stance
			that these bills took allowed us in turn to infer the political stance of the members of the Senate and the House. Through this information, we 
			enable our users to select the issues that are most important to them and see which candidates align the most and the least with their interests.

			In creating Politics AJAR, we are hoping to inspire others to help us inform the American public and create a better world. 
			</h4>

			<h2 style={{textAlign: 'center', color: '#596cff', fontFamily: 'Roboto', fontSize: 40, marginTop: 90}}> Team </h2>
			<div style={{width: '100%'}}>
			<a href="https://github.com/avarona">
		    <Paper 
		    	 style={style}
		   		 zDepth={2} 
		   		 circle={true}
		   		 children={
		   		 	<h4> Alejandro Varona </h4>
		   		 }
		   		 />
		   	</a>

		   	<a href="https://github.com/JFUCHS-FULLSTACK">
		   	<Paper 
		    	 style={style}
		   		 zDepth={2} 
		   		 circle={true}
		   		 children={
		   		 	<h4> Jonhathan Fuchs </h4>
		   		 }
		   	/>
		   	</a>

			<a href="https://github.com/abdelshok">
		   	<Paper 
		    	 style={style}
		   		 zDepth={2} 
		   		 circle={true}
		   		 children={
		   		 	<h4> Abdel-Aziz Shokair </h4>
		   		 }
		   	/>
		   	</a>

			<a href="https://github.com/robschroeder333">
		   	<Paper 
		    	 style={style}
		   		 zDepth={2} 
		   		 circle={true}
		   		 children={
		   		 	<h4> Robert Schroeder </h4>
		   		 }
		    />
			</a>
		    </div>
			</div>
			</div>

		)

	}

}

export default connect()(About)