const isInspected = process.execArgv.some(arg => arg.startsWith('--inspect'));
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
		if(isInspected)
		{
			let output = [heading].concat(args);
			console.log(...output.map(d => (typeof d === 'string')? color.parse(d).spans.reduce((str, p) => str + p.text, '') : d));
			// console.log(color.parse(output).spans.reduce((str, p) => str + p.text, '')); // console.log(...color.parse(output).browserConsoleArguments);
		}
		
		else
		{
			let output = [heading].concat(args.map(arg => typeof arg === 'string'? arg : this.inspect(arg))).join(' ');
			console.log(output);
		}
	},
	
	method: function(heading, name, args, retrn) {
		let datetime = '[' + (new Date().toJSON()) + ']';
		heading = datetime.dim + this.toHeader(heading);
		if(isInspected)
		{
			let output = [heading].concat(this.toMethod(name, args, retrn));
			console.log(...output.map(d => (typeof d === 'string')? color.parse(d).spans.reduce((str, p) => str + p.text, '') : d));
			// color.parse(output).spans.reduce((str, p) => str + p.text, '')); // console.log(...color.parse(output).browserConsoleArguments);
		}
		
		else
		{
			let output = [heading].concat(this.toMethod(name, args, retrn)).join(' ');
			console.log(output);
		}
	},
	
	toMethod: function(name, args, retrn) {
		if(isInspected)
		{
			let out = [name];
			if(args === undefined) out.push('()');
			else
			{
				out.push('(');
				if(!Array.isArray(args)) out.push(args);
				else args.forEach((arg, i, a) => {
					// out.push(util.inspect(arg, { depth: null, colors: false }));
					out.push(arg);
					if(i < a.length-1) out.push(',');
				});
				out.push(')');
			}
			
			if(retrn !== undefined) out.push('return', retrn); // util.inspect(retrn, { depth: null, colors: false }));
			
			return out;
		}
		
		else
		{
			if(args === undefined) args = '()'.dim;
			else
			{
				if(!Array.isArray(args)) args = [args];
				args = '('.dim + args.map(arg => util.inspect(arg, { depth: null, colors: true })).join(', '.dim) + ')'.dim;
			}
			
			if(retrn !== undefined) args += ' return '.dim + util.inspect(retrn, { depth: null, colors: true });
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
			iter = isInspected? 32 : 96;
			while(iter-->0) log += char;
			
			if(isInspected) log = color.parse(log).spans.reduce((str, p) => str + p.text, ''); // color.parse(log).browserConsoleArguments;
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
