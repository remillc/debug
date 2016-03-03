'use strict';

var moment = require('moment'),
	debug = require('debug'),
	now = require('performance-now');

debug.formatArgs = function formatArgs() {
	var args = Array.prototype.slice.call(arguments);

	var useColors = false;

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

	logger.now = now;

	return logger;
};