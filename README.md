# console-extended

The goal is to extend the `console` object in Node.js for better readability/usability to logging in terminals.
It adds methods to the `console` and uses and works well in combination with the `colors` module.

For example:

![](https://github.com/Martin-Pitt/console-extended/blob/master/example.png)



## Usage

Install the module
```bash
npm install console-extended
```

Then require it in your Node.js code:
```bash
require('console-extended');
```
This will extend your `console` object with additional methods/properties.

Thus you can start using it:
```javascript
console.header('foobar', 'Hello World!');
```



## Methods

### `console.header(header, log...)`
Currently it exports `header` method, which styles and pads the first argument as a "header". This is to help you signify from which sub-system a log was made from at a glance. Instead you could use it to log the date and time as well.
```javascript
console.header('DNS', ipaddress, 'requested the DNS for', 'example.martin.dev');
console.header('App', 'The user uploaded a', 'photo');
console.header('Backup', 'I made a backup of the server at', '12am');
console.header('App', 'The user updated their profile');
```

The `header` takes the first argument, styles it and combines it with the other arguments in a call to `console.log`, but if you prefer, you can call the styling function on its' own:
```javascript
var profilerHeader = console.ext.toHeader('Profiler');
```

This might be useful if you wish to use it for other `console.*` methods, such as time/timeEnd:
```javascript
console.time(console.ext.toHeader('Backup') + ' for 12am');
// ...
console.timeEnd(console.ext.toHeader('Backup') + ' for 12am');
```



## Examples

Here are some real-world examples I took from my localhost master server, as depicted with the example picture above:
```javascript
console.header('DNS', 'Nameserver listening on', this.address());
console.header('DNS', 'Request of ', name,' by', request.address);
// ...
http.createServer(callback).listen(80, () => console.header('Web', 'Koa bound to ' + '*:80'.cyan));
https.createServer(options, callback).listen(443, () => console.header('Web', 'Koa bound to ' + '*:443'.red));
// ...
console.timeEnd(console.ext.toHeader('Profiler') + ' Configurations');
// ...
console.header('Web', 'Loading ' + servers.length.toString().bold.green + ' servers for ' + ('*.' + tld).blue + ' from ' + (root + '**').green);
// ...
console.log(
	console.ext.pad('‹' + Object.keys(config).filter((str) => str.length && !/(root)/.test(str)).join('·').replace('file', 'koa') + '›', 'right', 40).gray,
	(console.ext.pad(subdomain.bold, 'right', 40)).blue
	+  '.⎋'.blue + ' ⏤ '.dim + '⏣ '.green +
	console.ext.pad(config.root.replace(root, '/'), 'left', 30).green
);
```
