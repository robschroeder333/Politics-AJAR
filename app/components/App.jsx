import React, { Component } from 'react';

/* The 'App' component is the parent of all other components in React-Router. */

const App = props => {
  const { children } = props;

  return (
    <div>
      { children }
    </div>
  )
}

export default App;
