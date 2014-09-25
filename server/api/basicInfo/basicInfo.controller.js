/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var os = require('os');

// Get list of things
exports.index = function(req, res) {
	var response = {};
	response['hostname'] = os.hostname();
	response['uptime'] = os.uptime();
	response['os'] = {
		type: os.type(),
		release: os.release(),
		architecture: os.arch()
	};
	res.json(200, response);
};

// Get a single thing
exports.show = function(req, res) {
	var response = {};
	switch(req.params.mode){
		case 'hostname':
			response['hostname'] = os.hostname();
		break;
		case 'uptime':
			response['uptime'] = os.uptime();
		break;
		case 'os':
			response['os'] = {
				type: os.type(),
				release: os.release(),
				architecture: os.arch()
			};
		break;
		default:
			return res.send(404);
		break;
	}
	return res.send(200, response);
};

function handleError(res, err) {
  return res.send(500, err);
}