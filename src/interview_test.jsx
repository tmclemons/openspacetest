import React, { Fragment, useState, useEffect, useReducer, createRef } from 'react'


const CreateButton = ({copy}) => {

	const ButtonRef = createRef();
	const ButtonStyles = {
		outline: 'none',
		padding: '10 15',
		display: 'flex',
		flexFlow: 'row',
		justifyContent: 'center'
	}

	return(
		<Fragment>
			<a style={ButtonStyles} ref={ButtonRef}>
				<span>
					{ copy }
				</span>
			</a>
		</Fragment>
	)
}
const ToolTip = ({copy}) => {
	return(
		<Fragment>
			<div>
				{ copy }
			</div>
		</Fragment>
	)
}
const GetButtonDimensions = () => {
	// left, top, right, bottom, x, y, width, and height
	const ButtonDimensions = ButtonRef.getBoundingClientRect();
}

const Layout = () => {
	const LayoutStyles = {
		display: 'flex',
		justifyContent: 'center',
		alignItem: 'center',
		width: '100vw',
		height: '100vh'
	}

	return (
		<Fragment>
			<div style={LayoutStyles}>

			</div>
		</Fragment>
	)
}

export default Layout
