import React, {Component} from 'react';
import {connect} from 'react-redux';
import Politicians from './Politicians'
// import Sidebar from 'react-sidebar';


import {Drawer, MenuItem, FlatButton} from 'material-ui'


class DisplayAndPoliticians extends Component {

	constructor(props){
		super(props);
		this.state = {
			open: true,
			search: '',
			senateSelected: true,
			houseSelected: true,
			senateClickedColor: '#00008b',
			houseClickedColor: '#00008b',
			senateText: {color: 'white'},
			houseText: {color: 'white'}
		}
		this.handleToggle = this.handleToggle.bind(this)
	}


	handleToggle(){
		this.setState({open: !this.state.open})
	}

	onClick(filter){
		this.setState({search: filter})
		if (filter === 'senate' && this.state.senateSelected === true){
			this.setState({senateClickedColor: '#ffffff', senateSelected: false, senateText: {color: '#00008b'}})
		}
		if (filter === 'house' && this.state.houseSelected === true) {
			this.setState({ houseClickedColor: '#ffffff', houseSelected: false, houseText: {color: '#00008b'} })
		}
		if (filter === 'senate' && this.state.senateSelected === false){
			this.setState({senateClickedColor:'#00008b', senateSelected: true, senateText:{color: 'white'} })
		}
		if (filter === 'house' && this.state.houseSelected === false) {
			this.setState({houseClickedColor:'#00008b', houseSelected: true, houseText:{color: 'white'} })
		}
	}

	render(){
		let sidebarContent = <p> Sidebar content </p>
		let {politicians} = this.props
		let {senateSelected, houseSelected} = this.state

		if (senateSelected && !houseSelected){
			politicians = politicians.filter(politician => politician.chamber.match('senate'))
		}
		if (!senateSelected && houseSelected){
			politicians = politicians.filter(politician => politician.chamber.match('house'))
		}
		if (senateSelected && houseSelected){
			politicians = politicians;
		}

		return(
			<div>
			<Politicians handleToggle={this.handleToggle} politicians={politicians} />
			<Drawer open={this.state.open} docked={true} > 
			   <FlatButton label="Senate" onClick={() => this.onClick('senate')} backgroundColor={this.state.senateClickedColor}  labelStyle={this.state.senateText} />
			   <FlatButton label="House"  onClick={() => this.onClick('house')} backgroundColor={this.state.houseClickedColor} labelStyle={this.state.houseText} />
        	</Drawer>
        	</div>
		)
	}
}


const mapStateToProps = ({politicians}) => {
  return {
    politicians
  }
}

// const mapDispatchToProps = dispatch => ({
//   update: () => dispatch(getPoliticians())
// })

export default connect(mapStateToProps)(DisplayAndPoliticians)