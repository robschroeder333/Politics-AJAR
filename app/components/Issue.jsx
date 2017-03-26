import React from 'react';
import { Slider } from 'material-ui';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';

const sliderStyle = {
  width: '70%',
  margin: 'auto'
}

const muiTheme = getMuiTheme({
  slider: {
    // trackColor: 'white',
    // selectionColor: '#ffffff',
    handleColorZero: '#00bcd4',
    handleFillColor: '#00bcd4',
  },
});
console.log('mui', muiTheme)

const Issue = (props) => {
  return (
    <div>
      <form>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Slider
            step={25}
            style={sliderStyle}
            value={props.value ? props.value : 50}
            onChange={props.handleChange}
            min={0}
            max={100}
          />
        </MuiThemeProvider>
      </form>
    </div>
  )
}

export default Issue;
