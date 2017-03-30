import React from 'react';
import { Slider } from 'material-ui';
// import { Slider } from 'react-toolbox';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';

const sliderStyle = {
  width: '70%',
  margin: 'auto',
  paddingTop: '5%'
}

const muiTheme = getMuiTheme({
  slider: {
    // trackColor: 'white',
    // selectionColor: '#ffffff',
    handleColorZero: '#00008b',
    handleFillColor: '#00008b',
    selectionColor: '#00008b',
  },
});

const Issue = (props) => {
  return (
    <div>
      <form>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Slider
            step={25}
            style={sliderStyle}
            value={props.value}
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


  // <Slider pinned snaps min={0} max={100} step={25} editable value={props.value ? props.value : 50} onChange={props.handleChange} />
