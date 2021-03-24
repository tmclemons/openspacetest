import React, { Fragment, useState, useEffect, useReducer, createRef, Children, cloneElement } from 'react'

// import logo from './logo.svg';
import './App.css';

const CreateButton = ({copy}) => {
	const buttonRef = createRef();
	const ButtonStyles = {
		display: 'flex',
    flexFlow: 'row',
    justifyContent: 'center',
    height: 20,
    padding: '15px 24px',
    border: '1px solid',
    lineHeight: '20px',
    backgroundColor: '#e8e8ff',
		flex: 'auto',
	}

	return(
		<Fragment>
			<a style={ButtonStyles} ref={buttonRef}>
				<span style={{pointerEvents: 'none'}}>
					{ copy }
				</span>
			</a>
		</Fragment>
	)
}

const ToolTip = ({copy, children}) => {

	const [buttonDimensions, setButtonDimensions] = useState({left: null, top: null})
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
			const { width, height, top, left, bottom, right } = dimensions;
			return { width, height, top, left, bottom, right };

		} else {
			return {}
		}
	}

	const GetContainerDimensions = () => {
		// left, top, right, bottom, x, y, width, and height
		const dimensions = containerRef.current.getBoundingClientRect();
		const { width, height, top, left, bottom, right } = dimensions;
		return { width, height, top, left, bottom, right };
	}

	const GetButtonDimensions = (element) => {
		// left, top, right, bottom, x, y, width, and height
		const dimensions = element.getBoundingClientRect();
		const { width, height, top, left, bottom, right } = dimensions;
		return { width, height, top, left, bottom, right };
	}

	const CalculateToolTipCentering = (referenceElement, toolTipReference, leftOffest) => {
		const referenceElementHeight = typeof referenceElement === 'function' ? referenceElement().height : referenceElement.height
		const referenceToolTipHeight = typeof toolTipReference === 'function' ? toolTipReference().height : toolTipReference.height
		const referenceToolTipLeft = typeof toolTipReference === 'function' ? toolTipReference().left : toolTipReference.left
		const referenceToolTipRight = typeof toolTipReference === 'function' ? toolTipReference().right : toolTipReference.right
		const referenceToolTipWidth = typeof toolTipReference === 'function' ? toolTipReference().width : toolTipReference.width
		const referenceElementTop = typeof referenceElement === 'function' ? referenceElement().top : referenceElement.top

		const getTopOffset = referenceElementTop + ((  referenceElementHeight / 2 ) - (  referenceToolTipHeight / 2))
		const getLeftOffset = referenceToolTipRight + leftOffest + referenceToolTipWidth
		return {
			top: getTopOffset,
			left: getLeftOffset
		}
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

	const onMouseEnterEvt = (evt) => {
		setShowToolTip(true)
		setButtonDimensions(GetButtonDimensions(evt.target))
	}
	
	const onMouseLeaveEvt = (evt) => {
		setShowToolTip(false)
		setButtonDimensions({left: null, top: null})
	}

	useEffect(() => {

		setToolTipDimensions( showToolTip ? CalculateToolTipCentering(buttonDimensions, GetToolTipDimensions, 10) : { left: null, width: null} )
		setArrowDimensions( showToolTip ? CalculateToolTipCentering(buttonDimensions, {height: ToolTipArrowSize, width: -4, right: GetContainerDimensions().right}, 0) : { left: null, width: null} )

	}, [ showToolTip ])

	return(
		<Fragment>
			{/* <div style={ToolTipWrapperStyles} ref={containerRef} onMouseEnter={consoleLog} onMouseLeave={consoleLog}> */}
			<div  ref={containerRef}>
				{
					children && Children.map(children, (child) => cloneElement(
						child,
						{
							onMouseOver: (evt) => onMouseEnterEvt(evt),
							onMouseOut: (evt) => onMouseLeaveEvt(evt)
						}
					))
				}
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



const Layout = ({Buttons}) => {
	const LayoutStyles = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexFlow: 'column',
		width: '100vw',
		height: '100vh'
	}

	const ButtonContainerStyles = {
		flex: 'auto',
		maxWidth: 150,
		maxHeight: 200,
		overflowX: 'hidden',
		overflowY: 'scroll'
	}

	return (
		<Fragment>
			<div style={LayoutStyles}>
				<ToolTip copy={'tooltip'}>
					<div style={ButtonContainerStyles}>
						{
							Buttons.map((button) => {
								return(
									<Fragment key={Math.random(10)}>
										<CreateButton copy={`Button ${button}`}/>
									</Fragment>
								)
							})
						}
					</div>
				</ToolTip>
			</div>
		</Fragment>
	)
}


function App() {
  return (
    <div className="App">
			<Layout Buttons={[1,2,3,4,5,6,7,8,9,10]}/>
    </div>
  );
}

export default App;
