import React, { Fragment, useState, useEffect, useReducer, useLayoutEffect, createRef, Children, cloneElement } from 'react'

import './App.css';

const CreateButton = ({copy, toolTipLabel}) => {
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
			<a style={ButtonStyles} ref={buttonRef} tool-tip={toolTipLabel}>
				<span style={{pointerEvents: 'none'}}>
					{ copy }
				</span>
			</a>
		</Fragment>
	)
}

const ToolTip = ({scrollPosition, toolTipLabel, children}) => {
	const [buttonDimensions, setButtonDimensions] = useState({left: null, top: null})
	const [toolTipDimensions, setToolTipDimensions] = useState({left: null, top: null})
	const [arrowDimensions, setArrowDimensions] = useState({left: null, top: null})
	const [label, setLabel] = useState('tooltip')
	const [showToolTip, setShowToolTip] = useState(false)
	const toolTipRef = createRef();
	const containerRef = createRef();
	const ToolTipArrowSize = 10;
	const ToolTipColor = '#e6e6e6';

	const ToolTipStyles = {
		padding: 7,
    background: ToolTipColor,
		position: 'absolute',
		left:  toolTipDimensions.left ? toolTipDimensions.left : -100,
		top:  toolTipDimensions.top ? toolTipDimensions.top : -100,
		zIndex: 1,
		opacity: showToolTip ? 1 : 0,
		transition: 'opacity 0.2s ease-in-out'
	}
	

	const ToolTipArrowStyles = {
		content: '',
		position: 'absolute',
		width: 0,
		height: 0,
		zIndex: 2,
		left:  arrowDimensions.left ? arrowDimensions.left : -100,
		top:  arrowDimensions.top ? arrowDimensions.top : -100,
		borderTop: `${ToolTipArrowSize/2}px solid transparent`,
    borderBottom: `${ToolTipArrowSize/2}px solid transparent`,
    borderRight: `${ToolTipArrowSize}px solid ${ToolTipColor}`,
		opacity: showToolTip ? 1 : 0,
		transition: 'opacity 0.2s ease-in-out'
	}

	const GetToolTipDimensions = () => {
		if(showToolTip) {
			const dimensions = toolTipRef.current.getBoundingClientRect();
			const { width, height, top, left, bottom, right, x, y } = dimensions;
			return { width, height, top, left, bottom, right, x, y };

		} else {
			return {}
		}
	}

	const GetButtonDimensions = (element) => {
		const dimensions = element.getBoundingClientRect();
		const { width, height, top, left, bottom, right, x, y } = dimensions;
		return { width, height, top, left, bottom, right, x, y };
	}

	const CalculateToolTipCentering = (referenceElement, toolTipReference, leftOffest) => {
		const referenceElementHeight = typeof referenceElement === 'function' ? referenceElement().height : referenceElement.height
		const referenceToolTipHeight = typeof toolTipReference === 'function' ? toolTipReference().height : toolTipReference.height
		const referenceElementTop = typeof referenceElement === 'function' ? referenceElement().y : referenceElement.y
		const referenceElementRight = typeof referenceElement === 'function' ? referenceElement().right : referenceElement.right

		const getTopOffset = referenceElementTop + ((  referenceElementHeight / 2 ) - (  referenceToolTipHeight / 2))
		const getLeftOffset = leftOffest + referenceElementRight

		return {
			top: getTopOffset,
			left: getLeftOffset
		}
	}

	const onMouseEnterEvt = (evt) => {
		setShowToolTip(true)
		setLabel(evt.target.getAttribute('tool-tip'))
		setButtonDimensions(GetButtonDimensions(evt.target))
	}
	
	const onMouseLeaveEvt = (evt) => {
		setShowToolTip(false)
		setLabel('tooltip')
		setButtonDimensions({left: -100, top: -100})
	}
	
	useEffect(() => {
		setToolTipDimensions( CalculateToolTipCentering(buttonDimensions, GetToolTipDimensions, 20) )
		setArrowDimensions( CalculateToolTipCentering(buttonDimensions, { height: ToolTipArrowSize, width: -4, left: buttonDimensions.right}, 10) )
	}, [ showToolTip ])

	useEffect(() => {
		setShowToolTip(false)
	}, [ scrollPosition ])

	return(
		<Fragment>
			<div ref={containerRef}>
				{
					children && Children.map(children, (child) => cloneElement(
						child,
						{
							onMouseOver: (evt) => onMouseEnterEvt(evt),
							onMouseOut: (evt) => onMouseLeaveEvt(evt),
							toolTipLabel: toolTipLabel
						}
					))
				}
				<Fragment>
					<div style={ToolTipStyles} ref={toolTipRef}>
						{ label }
					</div>
					<div style={ToolTipArrowStyles} />
				</Fragment> 
			</div>
		</Fragment>
	)
}



const Container = ({Buttons}) => {

	const scrollRef = createRef()
	const [scrollPos, setScrollPos] = useState(0)

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

	
	useEffect(() => {
		let children = scrollRef.current.children.length > 0 ? Array.from(scrollRef.current.children) : [];
		let innerHeight = 0;
		let outerHeight = scrollRef.current.clientHeight;

		if(children.length) {
			Array.from(scrollRef.current.children).forEach((child) => {
				innerHeight += child.clientHeight
			})
		}

		const onScroll = (evt) => {
			let scrollPos = evt.target.scrollTop;
			let maxBound = innerHeight - outerHeight;
			
			if( 0 < scrollPos < maxBound) {
				setScrollPos(evt.target.scrollTop)
			} else {
				setScrollPos(0)
			}
		}

		scrollRef.current.addEventListener('scroll', onScroll)
		return () => {
			scrollRef.current.removeEventListener('scroll', onScroll)
		};
	}, [])
	
	return (
		<Fragment>
			<div style={LayoutStyles}>
				<ToolTip scrollPosition={scrollPos}>
					<div style={ButtonContainerStyles} ref={scrollRef}>
						{
							Buttons.map((button) => {
								return(
									<Fragment key={Math.random(10)}>
										<CreateButton copy={`Button ${button.label}`} toolTipLabel={button.tooltip}/>
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
			<Container Buttons={[
				{ label: 1, tooltip: `tooltip ${parseInt(Math.random(10) * 100)}`},
				{ label: 2, tooltip: `tooltip ${parseInt(Math.random(10) * 100)}`},
				{ label: 3, tooltip: `tooltip ${parseInt(Math.random(10) * 100)}`},
				{ label: 4, tooltip: `tooltip ${parseInt(Math.random(10) * 100)}`},
				{ label: 5, tooltip: `tooltip ${parseInt(Math.random(10) * 100)}`},
				{ label: 6, tooltip: `tooltip ${parseInt(Math.random(10) * 100)}`},
				{ label: 7, tooltip: `tooltip ${parseInt(Math.random(10) * 100)}`},
				{ label: 8, tooltip: `tooltip ${parseInt(Math.random(10) * 100)}`},
				{ label: 9, tooltip: `tooltip ${parseInt(Math.random(10) * 100)}`},
				{ label: 10, tooltip: `tooltip ${parseInt(Math.random(10) * 100)}`}]}/>
    </div>
  );
}

export default App;
