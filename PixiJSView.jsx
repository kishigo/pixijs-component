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

CameraType = {
	perspective: 0,
	orthographic: 1
};

PixiJSView = React.createClass({
    proptypes: {
		// optional
		testMode: React.PropTypes.bool,
        canvasWidth: React.PropTypes.number.isRequired,
        canvasHeight: React.PropTypes.number.isRequired
    },
	getDefaultProps: function () {
		return {
			canvasWidth: 800,
			canvasHeight: 600
		};
	},
	render: function () {
		console.log('PixiJSView:render');
		return (<div className="PixiJSView" ref='threeJSView' align="center"
					 style={{position: 'absolute', left: 0, width: 100 + '%', height: 100 + '%'}}>
			<canvas className='PixiJSCanvas' ref='pixiJSCanvas'
					style={{display: 'table-row', backgroundColor: '#222222'}}></canvas>
		</div>);
	},
	componentDidMount: function () {
		// Use a ref to get the underlying DOM element once we are mounted
		let renderCanvas = this.refs.pixiJSCanvas;
		console.log('componentDidMount, canvas: ' + renderCanvas);
        this.configureCanvas(renderCanvas);
		
		if (!this.pixiRenderer) {
			this.pixiRenderer = PIXI.autoDetectRenderer(renderCanvas.width, renderCanvas.height, {view: renderCanvas});
		}
		if (!this.pixiRootContainer) {
			this.pixiRootContainer = new PIXI.Container();
		}
		if (this.props.state.plugin) {
			this.props.state.plugin.setContext(this.pixiRenderer, this.pixiRootContainer);
		}
		
		this.resizeLayout(renderCanvas.width, renderCanvas.height, this.props.defaultFitMode);
		
	},
	componentWillUnmount: function componentWillUnmount () {
	},
	shouldComponentUpdate: function shouldComponentUpdate (nextProps, nextState) {
		console.log('PixiJSView: shouldComponentUpdate: ENTRY');
		let action = nextProps.state.action;
		var delta;
		switch (action.constructor.name) {
		case 'ActionZoom':
			delta = (action.direction === ActionType.ZoomIn) ? -action.zUnits : action.zUnits;
			this.threeCamera.position.z += delta;
			break;
		case 'ActionRotate':
			this.rotateCameraAroundScene(action.speed, action.direction);
			break;
		case 'ActionPan':
			this.panCameraAcrossScene(action.direction, action.delta);
			break;
		case 'ActionCamera':
			delta = (action.direction === ActionType.CameraUp) ? action.delta : -action.delta;
			this.threeCamera.position.y += delta;
			break;
		case 'ActionAddMesh':
			this.threeScene.add(action.mesh);
			break;
		}
		return !this.isMounted();
	},
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
		
	},
	threeAnimate: function threeAnimate () {
		if (this.runAnimation) {
			requestAnimationFrame(this.threeAnimate);
			this.threeControls.update();
			this.threeRenderer.render(this.threeScene, this.threeCamera)
		}
	},
	rotateCameraAroundScene: function rotateCameraAroundScene (rotSpeed, direction) {
		var x = this.threeCamera.position.x,
			z = this.threeCamera.position.z;
	
		if (direction === ActionType.RotateLt){
			this.threeCamera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
			this.threeCamera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
		} else if (direction === ActionType.RotateRt){
			this.threeCamera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
			this.threeCamera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
		}
	
		this.threeCamera.lookAt(this.threeScene.position);
	},
	panCameraAcrossScene: function panCameraAcrossScene (direction, delta) {
		if (direction === ActionType.PanLt) {
			this.threeScene.position.x -= delta;
		}
		else if (direction === ActionType.PanRt) {
			this.threeScene.position.x += delta;
		}
		this.threeCamera.lookAt(this.threeScene.position);
	}
});

var stupidFunction = function stupidFunction(canvas) {
	console.log('stupidFunction: ENTRY, canvas: ' + canvas);
};

