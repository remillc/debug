'use strict';

var moment = require('moment'),
	debug = require('debug');

function useColors() {
	// is webkit? http://stackoverflow.com/a/16459606/376773
	return ('WebkitAppearance' in document.documentElement.style) ||
		// is firebug? http://stackoverflow.com/a/398120/376773
		(window.console && (console.firebug || (console.exception && console.table))) ||
		// is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

debug.formatArgs = function formatArgs() {
	var args = Array.prototype.slice.call(arguments);

	var useColors = useColors();

	args[0] = (useColors ? '%c' : '') + moment().format('YYYY-MM-DD HH:mm:ss') + (useColors ? ' %c' : ' ') + '[' + this.namespace + ']' + (useColors ? ' %c' : ' ') + args[0];

	if (!useColors) {
		return args;
	}

	var c = 'color: ' + this.color;
	args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	// the final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	var index = 0;
	var lastC = 0;
	args[0].replace(/%[a-z%]/g, function(match) {
		if ('%%' === match) {
			return;
		}
		index++;
		if ('%c' === match) {
			// we only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
	return args;
}

module.exports = function(namespace, level) {
	namespace = namespace || '*';
	level = level || 'log';

	var logger = debug(namespace);
	//logger.useColors = true;
	logger.log = console[level].bind(console);

	logger.level = function(level) {
		return console[level] && (this.log = console[level].bind(console));
	};

	return logger;
};
