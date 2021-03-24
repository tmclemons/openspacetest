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

	const [toolTipDimensions, setToolTipDimensions] = useState({left: null, top: null})
	const [arrowDimensions, setArrowDimensions] = useState({left: null, top: null})
	const [showToolTip, setShowToolTip] = useState(false)
	const toolTipRef = createRef();
	const containerRef = createRef();
	
	const consoleLog = () => {
		console.log('test')
	}

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
		const referenceElementHeight = typeof referenceElement === 'function' ? referenceElement().height : referenceElement.height
		const referenceToolTipHeight = typeof toolTipReference === 'function' ? toolTipReference().height : toolTipReference.height

		return ((  referenceElementHeight / 2 ) - (  referenceToolTipHeight / 2))
	}

	const ToolTipArrowSize = 10;
	const ToolTipColor = '#e6e6e6';

	const ToolTipWrapperStyles={
		position: 'relative'
	}

	const ToolTipStyles = {
		padding: 7,
    background: ToolTipColor,
		position: 'absolute',
		left:  toolTipDimensions.left ? toolTipDimensions.left + 10 : "initial",
		top:  toolTipDimensions.top ? toolTipDimensions.top : "initial",
		zIndex: 1,
		opacity: showToolTip ? 1 : 0
	}
	

	const ToolTipArrowStyles = {
		content: '',
		position: 'absolute',
		left: 0,
		width: 0,
		height: 0,
		zIndex: 2,
		left:  arrowDimensions.left ? arrowDimensions.left : "initial",
		top:  arrowDimensions.top ? arrowDimensions.top : "initial",
		borderTop: `${ToolTipArrowSize/2}px solid transparent`,
    borderBottom: `${ToolTipArrowSize/2}px solid transparent`,
    borderRight: `${ToolTipArrowSize}px solid ${ToolTipColor}`,
		opacity: showToolTip ? 1 : 0
	}

	const onMouseEnterEvt = () => {
		setShowToolTip(true)
	}

	const onMouseLeaveEvt = () => {
		setShowToolTip(false)
	}

	useEffect(() => {
		setToolTipDimensions({ 
			left: showToolTip ? GetButtonDimensions().width : null, 
			top: showToolTip ? CalculateToolTipCentering(GetButtonDimensions, GetToolTipDimensions) : null
		})

		console.log(CalculateToolTipCentering(GetButtonDimensions, {height: ToolTipArrowSize, width: ToolTipArrowSize}))

		setArrowDimensions({ 
			left: showToolTip ? GetButtonDimensions().width : null, 
			top: showToolTip ? CalculateToolTipCentering(GetButtonDimensions, {height: ToolTipArrowSize, width: ToolTipArrowSize}) : null
		})

	}, [ showToolTip ])

	return(
		<Fragment>
			{/* <div style={ToolTipWrapperStyles} ref={containerRef} onMouseEnter={consoleLog} onMouseLeave={consoleLog}> */}
			<div style={ToolTipWrapperStyles} ref={containerRef} onMouseEnter={onMouseEnterEvt} onMouseLeave={onMouseLeaveEvt}>
				{ children }
				{
					showToolTip ? 
					<Fragment>
						<div style={ToolTipStyles} ref={toolTipRef}>
							{ copy }
						</div>
						<div style={ToolTipArrowStyles} />
					</Fragment> : null
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
