import React, {Component} from 'react';
import { connect } from 'react-redux';
import Sidebar from 'react-sidebar';
import { FlatButton, AppBar } from 'material-ui';
import Politicians from './Politicians';
import Issues from './Issues';

const buttonStyle = {
	textAlign: 'center',
	paddingTop: 200
}

const navbarStyle = {
	 root: {
	   position: 'absolute',
	   top: 0,
	   left: 0,
	   right: 0,
	   bottom: 0,
	   overflow: 'hidden',
	 },
	 sidebar: {
	   zIndex: 2,
	   position: 'absolute',
	   top: 0,
	   bottom: 0,
	   right: '80%',
	   transition: 'transform .3s ease-out',
	   WebkitTransition: '-webkit-transform .3s ease-out',
	   willChange: 'transform',
	   overflowY: 'auto',
		//  backgroundColor: '#a52a2a',
	 },
	 content: {
	   position: 'absolute',
	   top: 0,
	   left: 0,
	   right: 0,
	   bottom: 0,
	   overflow: 'auto',
	   transition: 'left .3s ease-out, right .3s ease-out',
	 },
	 overlay: {
	   zIndex: 1,
	   position: 'fixed',
	   top: 0,
	   left: 0,
	   right: 0,
	   bottom: 0,
	   opacity: 0,
	   visibility: 'hidden',
	   transition: 'opacity .3s ease-out',
		 backgroundColor: 'rgba(0,0,0,.3)'
	 },
	 dragHandle: {
	   zIndex: 1,
	   position: 'fixed',
	   top: 0,
	   bottom: 0,
	 }
}

class DisplayAndPoliticians extends Component {

	constructor(props){
		super(props);
		this.state = {
			sidebarOpen: false,
			sidebarDocked: true,
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

	onSetSidebarOpen(open) {
		this.setState({sidebarOpen: open})
	}

	handleToggle(){
		this.setState({sidebarDocked: !this.state.sidebarDocked})
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
			this.setState({senateClickedColor: '#00008b', senateSelected: true, senateText: {color: 'white'} })
		}
		if (filter === 'house' && this.state.houseSelected === false) {
			this.setState({houseClickedColor: '#00008b', houseSelected: true, houseText: {color: 'white'} })
		}
	}

	render(){
		let sidebarContent = (
			<div style={buttonStyle}>
				<FlatButton
					label="Senate"
					onClick={() => this.onClick('senate')}
					backgroundColor={this.state.senateClickedColor}
					labelStyle={this.state.senateText}
				/>
				<FlatButton
					label="House"
					onClick={() => this.onClick('house')}
					backgroundColor={this.state.houseClickedColor}
					labelStyle={this.state.houseText}
				/>
			<hr />
				<Issues />
			</div>
		)
		let {politicians} = this.props
		let {senateSelected, houseSelected} = this.state

		// console.log('this', this.props)

		if (senateSelected && !houseSelected){
			politicians = politicians.filter(politician => politician.chamber.match('senate'))
		}
		else if (!senateSelected && houseSelected){
			politicians = politicians.filter(politician => politician.chamber.match('house'))
		}
		else if (senateSelected && houseSelected){
			politicians = politicians;
		}
		else {
			politicians = []
		}
		return (
			<div>
				<Sidebar
					sidebar={sidebarContent}
					open={this.state.sidebarOpen}
					onSetOpen={this.onSetSidebarOpen}
					docked={this.state.sidebarDocked}
					styles={navbarStyle}
				>
					<AppBar
						title="Render All Politicians"
						onLeftIconButtonTouchTap={this.handleToggle}
						style={{backgroundColor: '#596cff'}}
					/>
					<Politicians
						handleToggle={this.handleToggle}
						politicians={politicians}
					/>
				</Sidebar>
			</div>
		)
	}
}


const mapStateToProps = ({politicians}) => {
  return {
    politicians
  }
}


export default connect(mapStateToProps)(DisplayAndPoliticians)
