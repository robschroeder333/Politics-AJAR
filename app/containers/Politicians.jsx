import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPoliticians } from '../ducks/politicians';
import Politician from '../components/Politician.jsx'
import RaisedButton from 'material-ui/RaisedButton';

const buttonStyle = {
  marginLeft: 600
}

class Politicians extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {politicians} = this.props
    return (
      <div>
         <RaisedButton style={buttonStyle} label="Toggle"  />
        <h3>Render all politicians</h3>
  
        <ul>
          {politicians.map(politician => {
              return (
                <li key={politician.id}>
                  <Politician politician={politician} />
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

/* REDUX CONTAINER */



export default connect(/*, mapDispatchToProps*/)(Politicians);
