var httpProxy = require('http-proxy');
var express = require('express');
var cors = require('cors');

var config = require('./config');

var options = {
	target: config.get('target'),
};

var proxy = httpProxy.createProxyServer(options);

var app = express();
app.use(errorHandler);
app.use(cors({
	origin: config.get('cors-origin'),
}));
app.use(proxyMiddleware);

app.listen(config.get('port'), function () {
	console.info('Proxy to ' + config.get('target') + ' started on port ' + config.get('port'));
});

function proxyMiddleware(req, res) {
	proxy.web(req, res);
}

function errorHandler(err, req, res, next) {
	res.writeHead(500, {
		'Content-Type': 'text/plain',
	});
	res.end('An error occurred while forwarding your request.');
}
