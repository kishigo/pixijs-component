/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 kishigo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

PixiJSView = React.createClass({
    proptypes: {
		// optional
		testMode: React.PropTypes.bool,
        canvasWidth: React.PropTypes.number.isRequired,
        canvasHeight: React.PropTypes.number.isRequired
    },
	getDefaultProps: function () {
		return {canvasWidth: 900, canvasHeight: 700, testMode: true, WIDTH: 400, HEIGHT: 300, VIEW_ANGLE: 75, NEAR: 0.1, FAR: 1000};
	},
	getInitialState: function getInitialState () {
		return this.props.store.getAll();
	},
	/**
	 * For pixijs components which render themselves, this is a one time action
	 * @returns {XML}
	 */
	render: function () {
		console.log('PixiJSView:render');
		return (<div className="PixiJSView" ref='threeJSView' align="center"
					 style={{position: 'absolute', left: 0, width: 100 + '%', height: 100 + '%'}}>
			<canvas className='PixiJSCanvas' ref='pixiJSCanvas'
					style={{display: 'table-row', backgroundColor: '#222222'}}></canvas>
		</div>);
	},
	/**
	 * Set up the pixijs basic render context, controls
	 */
	componentDidMount: function () {
		// Use a ref to get the underlying DOM element once we are mounted
		let renderCanvas = this.refs.pixiJSCanvas;
		console.log('componentDidMount, canvas: ' + renderCanvas);
        this.configureCanvas(renderCanvas);
		this.plugin = this.state.plugin;
		let storeName = this.props.store.name;
		let listener = function (bar) {
			console.log('Event: ' + storeName);
			// Pass the state to the real component whenever the store updates the state
			this.setState(this.props.store.getAll());
		}.bind(this);
		EventEx.on(storeName, listener);

		if (!this.pixiRenderer) {
			this.pixiRenderer = PIXI.autoDetectRenderer(renderCanvas.width, renderCanvas.height, {view: renderCanvas});
		}
		if (!this.pixiRootContainer) {
			this.pixiRootContainer = new PIXI.Container();
			let style = {
				fill: '#FF0000'
			};
			let testItem = new PIXI.Text('Hello', style);
			testItem.x = 0;
			testItem.y = 0;
			this.pixiRootContainer.addChild(testItem);
		}
		if (this.plugin) {
			this.plugin.setContext(this.pixiRenderer, this.pixiRootContainer);
		}
		
		this.resizeLayout(renderCanvas.width, renderCanvas.height, this.props.defaultFitMode);
		this.runAnimation = true;
		this.pixiAnimate();
		this.pixiRender();
		
	},
	/**
	 * Clear out pixijs context on unmount
	 */
	componentWillUnmount: function componentWillUnmount () {
		this.pixiRootContainer = null;
		this.pixiRenderer = null;
	},
	/**
	 * This is where we proxy action to plugin and also prevent vdom activity
	 * @param nextProps
	 * @param nextState
	 * @returns {boolean}
	 */
	shouldComponentUpdate: function shouldComponentUpdate (nextProps, nextState) {
		console.log('PixiJSView: shouldComponentUpdate: ENTRY');
		let action = nextState.action;
		if (this.plugin) {
			this.plugin.handleAction(action);
		}
		return !this.isMounted();
	},
	/**
	 * Compute canvas height and width
	 * @param canvas - dom item, mutate height and width on it
	 */
    configureCanvas: function configureCanvas (canvas) {
        var renderContainer = this.refs.pixiJSView;
        var width;
        var height;
        // set area either from container or props if no container
        if (!this.props.testMode && renderContainer) {
            width = renderContainer.clientWidth;
            height = renderContainer.clientHeight;
        }
        else {
            width = this.props.canvasWidth;
            height = this.props.canvasHeight;
        }
        canvas.height = height;
        canvas.width = width;
    },
	resizeLayout: function resizeLayout (width, height, fitMode) {
		// TBD, tied to window size change
	},
	/**
	 * wrapper around the pixijs render call
	 */
	pixiRender: function pixiRender () {
		this.pixiRenderer.render(this.pixiRootContainer);
	},
	/**
	 * pixijs render with RAF
	 */
	pixiAnimate: function pixiAnimate () {
		if (this.runAnimation) {
			requestAnimationFrame(this.pixiAnimate);
			this.pixiRender();
		}
	},
	updateState: function updateState (state) {
		console.log('PixiJSView: updateState: ENTRY,state: ' + state);
		// Just setState which will cause shouldComponentUpdate to fire
		this.setState(state);
	}
});

