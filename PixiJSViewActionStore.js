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
// Sample store

// Sample actions
AbstractAction = class AbstractAction {
	constructor () {}
};

ActionAddBackground = class ActionAddBackground extends AbstractAction {
	constructor (color) {
		super();
		this.color = color;
	}
};

ActionBlink = class ActionBlink extends AbstractAction {
	constructor (color, msg) {
		super();
		this.color = color;
		this.msg = msg;
	}
};

ActionText = class ActionText extends AbstractAction {
	constructor (color, text) {
		super();
		this.color = color;
		this.text = text;
	}
};

/**
 * Singleton sample store
 * @type {{setPlugin, getAll, getState}}
 */
PixiJSViewActionStore = (function () {
	const EVENT_TYPE = 'PixiJSViewActionStore';
	Dispatcher.register(function (action) {
		switch (action.type) {
		case 'ADD_BACKGROUND':
			_state.action = new ActionAddBackground(0x0000FF);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'BLINK_BACKGROUND':
			console.log('BLINK_BACKGROUND');
			_state.action = new ActionBlink(0xFF0000, 'testing blink');
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'ADD_HELLO':
			console.log('ADD_HELLO');
			_state.action = new ActionText(0x00FF00, 'Hello');
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		}
	});
	
	var _state = {
	};

	/**
	 * callback to get the plugin which supports app specific rendering
	 * @param {object} plugin - User defined per specific component usage.
	 * @private
	 */
	var _setPlugin = function _setPlugin (plugin) {
		_state.plugin = plugin;
	};
	
	var _getAll = function _getAll () {
		return _state;
	};
	
	return {
		name: 'PixiJSViewActionStore',
		setPlugin: _setPlugin,
		getAll: _getAll
	}
})();