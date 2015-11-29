# console-extended

The goal is to extend the `console` object in Node.js for better readability/usability to logging in terminals.
It adds methods to the `console` and uses and works well in combination with the `colors` module.

For example:
![](https://github.com/Martin-Pitt/console-extended/blob/master/example.png)

Was done with the following lines of code: (each abstracted from the script)
```
console.header('DNS', 'Request of ', name,' by', request.address);
```
```
http.createServer(callback).listen(80, () => console.header('Web', 'Koa bound to ' + '*:80'.cyan));
https.createServer(options, callback).listen(443, () => console.header('Web', 'Koa bound to ' + '*:443'.red));
```
```
console.timeEnd(console.ext.toHeader('Profiler') + ' Configurations');
console.time(console.ext.toHeader('Profiler') + ' Servers');
console.header('Web', 'Loading ' + servers.length.toString().bold.green + ' servers for ' + ('*.' + tld).blue + ' from ' + (root + '**').green);
```
```
console.log(
	console.ext.pad('‹' + Object.keys(config).filter((str) => str.length && !/(root)/.test(str)).join('·').replace('file', 'koa') + '›', 'right', 40).gray,
	(console.ext.pad(subdomain.bold, 'right', 40)).blue
	+  '.⎋'.blue + ' ⏤ '.dim + '⏣ '.green +
	console.ext.pad(config.root.replace(root, '/'), 'left', 30).green
);
```


