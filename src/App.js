import React, { Fragment, useState, useEffect, useReducer, createRef } from 'react'

// import logo from './logo.svg';
import './App.css';

const CreateButton = ({copy}) => {
	const ButtonStyles = {
		display: 'flex',
    flexFlow: 'row',
    justifyContent: 'center',
    height: 20,
    padding: '15px 24px',
    border: '1px solid',
    lineHeight: '20px',
    backgroundColor: '#e8e8ff',
		position: 'relative'
	}

	return(
		<Fragment>
			<a style={ButtonStyles}>
				<span>
					{ copy }
				</span>
			</a>
		</Fragment>
	)
}

const ToolTip = ({copy, children}) => {

	const [dimensions, setDimensions] = useState({left: null, top: null})
	const [showToolTip, setShowToolTip] = useState(false)
	const toolTipRef = createRef();
	const containerRef = createRef();
	
	const GetToolTipDimensions = () => {
		// left, top, right, bottom, x, y, width, and height
		if(showToolTip) {
			const dimensions = toolTipRef.current.getBoundingClientRect();
			const { width, height } = dimensions;
			return { width, height };
		} else {
			return {}
		}
	}

	const GetButtonDimensions = () => {
		// left, top, right, bottom, x, y, width, and height
		const dimensions = containerRef.current.getBoundingClientRect();
		const { width, height } = dimensions;
		return { width, height };
	}

	const CalculateToolTipCentering = (referenceElement, toolTipReference) => {
		const referenceElementHeight = referenceElement().height
		const referenceToolTipeHeight = toolTipReference().height
		return (  referenceElementHeight / 2 ) - (  referenceToolTipeHeight / 2)
	}


	const ToolTipWrapperStyles={
		position: 'relative'
	}

	const ToolTipStyles = {
		padding: 7,
    background: '#e6e6e6',
    border: '1px solid grey',
		position: 'absolute',
		left:  dimensions.left ? dimensions.left + 10 : "initial",
		top:  dimensions.top ? dimensions.top : "initial"
	}

	const onMouseEnterEvt = () => {
		setShowToolTip(true)
	}

	const onMouseLeaveEvt = () => {
		setShowToolTip(false)
	}

	useEffect(() => {
		setDimensions({ 
			left: showToolTip ? GetButtonDimensions().width : null, 
			top: showToolTip ? CalculateToolTipCentering(GetButtonDimensions, GetToolTipDimensions) : null
		})
	}, [ showToolTip ])

	return(
		<Fragment>
			<div style={ToolTipWrapperStyles} ref={containerRef} onMouseEnter={onMouseEnterEvt} onMouseLeave={onMouseLeaveEvt}>
				{ children }
				{
					showToolTip ? 
					<div style={ToolTipStyles} ref={toolTipRef}>
						{ copy }
					</div>  : null
				}
			</div>
		</Fragment>
	)
}



const Layout = () => {
	const LayoutStyles = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100vw',
		height: '100vh'
	}

	return (
		<Fragment>
			<div style={LayoutStyles}>
				<ToolTip copy={'tooltip'}>
					<CreateButton copy={'Button'}/>
				</ToolTip>
			</div>
		</Fragment>
	)
}


function App() {
  return (
    <div className="App">
			<Layout />
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
