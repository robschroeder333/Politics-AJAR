import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPoliticians } from '../ducks/politicians';
import Politician from '../components/Politician.jsx'

class Politicians extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {politicians} = this.props.politicians
    return (
      <div>

        <ul
          className="text-left"
          style={{listStyle: 'none'}}>
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

export default connect()(Politicians);
