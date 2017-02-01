const isInspected = process.execArgv.includes('--inspect');
const util = require('util');
const color = require('ansicolour').nice;

if(isInspected)
{
	util.inspect.styles.number = 'blue';
	util.inspect.styles.boolean = 'magenta';
	util.inspect.styles.string = 'red';
	util.inspect.styles.date = 'cyan';
	util.inspect.styles.null = 'magenta';
	util.inspect.styles.undefined = 'gray';
	util.inspect.styles.special = 'magenta';
	util.inspect.styles.name = 'magenta';
}

else
{
	util.inspect.styles.number = 'cyan';
	util.inspect.styles.boolean = 'cyan';
	util.inspect.styles.string = 'red';
	util.inspect.styles.date = 'italic';
	util.inspect.styles.null = 'italic';
	util.inspect.styles.undefined = 'italic';
	util.inspect.styles.special = 'bold';
	util.inspect.styles.name = 'bold';
}



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
	header: function(heading, ...args) {
		let datetime = '[' + (new Date().toJSON()) + ']';
		heading = datetime.dim + this.toHeader(heading);
		let output = [heading].concat(args.map(arg => typeof arg === 'string'? arg : this.inspect(arg))).join(' ');
		if(isInspected) console.log(...color.parse(output).browserConsoleArguments);
		else console.log(output);
	},
	
	method: function(heading, name, args, retrn) {
		let datetime = '[' + (new Date().toJSON()) + ']';
		heading = datetime.dim + this.toHeader(heading);
		let output = [heading].concat(this.toMethod(name, args, retrn)).join(' ');
		if(isInspected) console.log(...color.parse(output).browserConsoleArguments);
		else console.log(output);
	},
	
	toMethod: function(name, args, retrn) {
		if(isInspected)
		{
			let out = [name.dim];
			if(args === undefined) out.push('()'.dim);
			else
			{
				out.push('('.dim);
				if(!Array.isArray(args)) out.push(args);
				else args.forEach((arg, i, a) => { out.push(this.inspect(arg)); if(i < a.length-1) out.push(','.dim) });
				out.push(')'.dim);
			}
			
			if(retrn !== undefined) out.push(' return '.dim, retrn);
			
			return out;
		}
		
		else
		{
			if(args === undefined) args = '()'.dim;
			else
			{
				if(!Array.isArray(args)) args = [args];
				args = '('.dim + args.map(arg => this.inspect(arg)).join(', '.dim) + ')'.dim;
			}
			
			if(retrn !== undefined) args += ' return '.dim + this.inspect(retrn);
			return [name.dim + args];
		}
	},
	
	hr_cache: {},
	hr: function(char) {
		if(!char) char = '_';
		
		var log = this.hr_cache[char];
		
		if(!log)
		{
			log = '';
			iter = 41;
			while(iter-->0) log += char;
			log = log.dim + ' ';
			iter = 96;
			while(iter-->0) log += char;
			
			if(isInspected) log = color.parse(log).browserConsoleArguments;
			this.hr_cache[char] = log;
		}
		
		if(Array.isArray(log)) console.log(...log);
		else console.log(log);
	},
	
	inspect: function(v) { return util.inspect(v, { depth: null, colors: true }) }
};

console.header = methods.header.bind(methods);
console.method = methods.method.bind(methods);
console.hr = methods.hr.bind(methods);
console.inspect = methods.inspect.bind(methods);

module['exports'] = methods;
