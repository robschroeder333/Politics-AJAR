import React from 'react';
import {Carousel} from 'react-bootstrap'

const styles = {
	quote: {
		textAlign: 'center',
		color: 'black', 
		fontFamily: 'Roboto' // font is not working so I think it is rendering Times New Roman
	}
}

const QuotesComponent = () => (

<div style={styles.quote} >
<h5>
	A community is like a ship; everyone ought to be prepared to take the helm. 
</h5>
	<h6> - Henrik Ibsen </h6>
</div>

)

export default QuotesComponent;