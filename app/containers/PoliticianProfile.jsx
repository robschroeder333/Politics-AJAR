import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Sidebar } from 'react-sidebar';
import { AppBar, FlatButton } from 'material-ui';
import Profile from '../components/Profile';

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

class PoliticianProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.setState({sidebarDocked: !this.state.sidebarDocked})
  }

  render() {
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
            title="Politics AJAR"
            onLeftIconButtonTouchTap={this.handleToggle}
            iconElementRight={
              <Link to="/about">
                <FlatButton
                  label="About"
                  style={{color: '#C3C3C3 ', fontSize: 30, fontWeight: 'bold'}}
                />
              </Link>
            }
            />
          {console.log('props in politicians profile container', this.props)}
          <Profile />
        </Sidebar>
      </div>
    )
  }
}

/* REDUX CONTAINER */

export default connect()(PoliticianProfile);
