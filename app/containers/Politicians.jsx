import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPoliticians } from '../ducks/politicians';
import Politician from '../components/Politician.jsx'
// import RaisedButton from 'material-ui/RaisedButton';

// const buttonStyle = {
//   marginLeft: 600
// }
{/* <RaisedButton style={buttonStyle} label="Toggle"  onClick={this.props.handleToggle} /> */}

class Politicians extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {politicians} = this.props
    return (
      <div>
        <h3 className="text-center">Render all politicians</h3>

        <ul className="text-left">
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
