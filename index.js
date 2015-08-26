require('colors');

var methods = {
	pad: function(str, align, width) {
		var s = '', iter = width;
		while(iter-->0) s += ' ';
		var length = str.replace(/\u001b\[\d+m/g, '').length;
		if(align == 'right') return s.slice(0, width - length) + str;
		if(align == 'left') return str + s.slice(0, width - length);
		if(align == 'center') {
			var margin = (width - length)/2;
			return s.slice(0, Math.floor(margin)) + str + s.slice(0, Math.ceil(margin));
		}
	},
	
	headerWidth: 15,
	headerAlign: 'right',
	toHeader: function(str) { return this.pad(('[' + str + ']').dim, this.headerAlign, this.headerWidth); },
	header: function() {
		arguments[0] = methods.toHeader(arguments[0]);
		console.log.apply(console, arguments);
	};
};

console.header = methods.header.bind(methods);
module['exports'] = methods;
