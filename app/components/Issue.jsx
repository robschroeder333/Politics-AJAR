import React from 'react';
import { Slider } from 'material-ui';
// import { Slider } from 'react-toolbox/lib/slider';

const sliderStyle = {
  width: '70%',
  margin: 'auto'
}

const Issue = (props) => {
  return (
    <div>
      <form>
        <Slider
          step={25}
          style={sliderStyle}
          value={props.value ? props.value : 50}
          onChange={props.handleChange}
          min={0}
          max={100}
        />
        {/* value=this.props.sliderValue */}
      </form>
    </div>
  )
}
// defaultValue={props.slidebar}

export default Issue;


  // <Slider pinned snaps min={0} max={100} step={25} editable value={props.value ? props.value : 50} onChange={props.handleChange} />
