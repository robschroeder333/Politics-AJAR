import React from 'react';
import { Slider } from 'material-ui';
// import { Slider } from 'react-toolbox';
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

const Issue = (props) => {
  return (
    <div>
      <form>
        {/* <Slider
          pinned
          snaps
          min={0}
          max={10}
          step={1}
          editable
          value={this.state.slider3}
        /> */}
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


  // <Slider pinned snaps min={0} max={100} step={25} editable value={props.value ? props.value : 50} onChange={props.handleChange} />
