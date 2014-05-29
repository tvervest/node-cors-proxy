var httpProxy = require('http-proxy');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var restreamer = require('connect-restreamer');

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
app.use(bodyParser);
app.use(restreamer());
app.use(proxyMiddleware);

app.listen(config.get('port'), function () {
	console.info('Proxy to ' + config.get('target') + ' started on port ' + config.get('port'));
});

function proxyMiddleware(req, res) {
	// Add the client's IP address
	var context = JSON.parse(req.body.hs_context);
	context.ipAddress = req.connection.remoteAddress;
	req.body.hs_context = JSON.stringify(context);

	// Pass it along to HubSpot
	proxy.web(req, res);
}

function errorHandler(err, req, res, next) {
	console.err(err);
	res.writeHead(500, {
		'Content-Type': 'text/plain',
	});
	res.end('An error occurred while forwarding your request.');
}
