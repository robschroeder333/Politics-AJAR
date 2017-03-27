import React, { Component } from 'react';
import { connect } from 'react-redux';
import Politician from '../components/Politician.jsx';
import { GridList, GridTile } from 'material-ui';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
  gridTile: {
    margin: '2%'
  }
}

class Politicians extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {politicians} = this.props.politicians
    return (
      <div>
        <GridList
          cellHeight={'100%'}
          cellWidth={'100%'}
          cols={2}
        >
          {politicians.map(politician => {
              return (
                <GridTile key={politician.id}>
                  <Politician
                    politician={politician}
                  />
                </GridTile>
              )
            })
          }
        </GridList>
      </div>
    )
  }
}

/* REDUX CONTAINER */

export default connect()(Politicians);
