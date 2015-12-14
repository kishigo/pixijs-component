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
PixiJSViewPlugin = class PixiJSViewPlugin {
	constructor () {
		this.pixiRenderer = null;
	}

	/**
	 * Store pixi context into plugin
	 * This should be called once the pixijs engine is initialized
	 * @param {object} pixiRenderer
	 * @param {object} pixiRootContainer
	 */
	setContext (pixiRenderer, pixiRootContainer) {
		this.pixiRenderer = pixiRenderer;
		this.pixiRootContainer = pixiRootContainer;
	}
	/**
	 * Called from shouldComponentUpdate when it proxies action to here
	 * @param {object} action - See ActionClass and extensions in the store
	 */
	handleAction (action) {
		switch (action.constructor.name) {
		case 'ActionAddBackground':
			this.addBackground(action.color);
			break;
		case 'ActionBlink':
			this.blink(action.color, action.msg);
			break;
		}
	}

	/**
	 * Example of adding either text or rectangle background as graphics
	 * @param color
	 */
	addBackground (color) {
		let test = false;
		if (test) {
			let style = {
				fill: '#00FF00'
			};
			let testItem = new PIXI.Text('Background', style);
			testItem.x = 0;
			testItem.y = 50;
			this.pixiRootContainer.addChild(testItem);
		}
		else {
			let background = new PIXI.Graphics();
			background.beginFill(color);
			background.lineStyle(5, 0xFF0000);
			background.drawRect(100, 100, 200, 300);
			background.endFill();
			this.pixiRootContainer.addChild(background);
			this.background = background;
		}
	}

	/**
	 * Blink "background"
	 * @param color
	 * @param msg
	 */
	blink (color, msg) {
		this.blinkItem(this.background, color);
	}

	/**
	 * Blink specific item
	 * @param item
	 * @param color
	 * @param duration
	 * @param nextFn
	 */
	blinkItem (item, color, duration, nextFn) {
		var blinkColor = color || 0xFF0000;
		var blinkDuration = duration || 200;
		var originalTint = item.tint;
		item.tint = blinkColor;
		setTimeout(function () {
			item.tint = originalTint;
			if (nextFn) {
				nextFn();
			}
		}, blinkDuration);
	}
};

// plug us into the store, couple a particular store and associated plugin
if (Meteor.isClient) {
	Meteor.startup(function () {
		console.log('PixiJSViewActionStore.setPlugin');
		PixiJSViewActionStore.setPlugin(new PixiJSViewPlugin());
	});
}
