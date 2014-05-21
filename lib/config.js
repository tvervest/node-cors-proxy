var nconf = module.exports = require('nconf');

nconf.argv().env().defaults({
	'port': 8000,
	'cors-origin': 'http://localhost',
});