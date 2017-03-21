import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPoliticians } from '../ducks/politicians';
import Politician from '../components/Politician.jsx'


class Politicians extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { politicians } = this.props

    return (
      <div>
        <h3>Render all politicians</h3>
        <ul>
          {
            politicians.map((politician) => {
              console.log(politician)
              return (
                <li key={politician.id}>
                  <Politician
                  politician={politician}
                />
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

const mapStateToProps = ({ politicians }) => {
  return {
    politicians

  }
}

// const mapDispatchToProps = dispatch => ({
//   update: () => dispatch(getPoliticians())
// })

export default connect(mapStateToProps/*, mapDispatchToProps*/)(Politicians);
