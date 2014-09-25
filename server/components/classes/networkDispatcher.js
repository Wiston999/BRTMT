var exec  = require('child_process').exec;
var os = require('os');
var BaseDispatcher = require('./baseDispatcher.js');

NetworkDispatcher.prototype = new BaseDispatcher();
NetworkDispatcher.prototype.constructor=NetworkDispatcher;
function NetworkDispatcher(io, mongoose){
	this.frequency = '30 second';
	this.saveFrequency = '10 seconds';
	this.socketMessage = 'networkNews';
	this.io = io;
	
	var Schema = mongoose.Schema;
	var NetworkSchema = new Schema({
		connections: [{
			v6: Boolean,
			protocol: String,
			input: {address: String, port: String},
			output: {address: String, port: String},
			status: String,
			process: String
			}],
		count: [{
			interface: String,
			Rx: {
				ok: Number,
				error: Number,
				drp: Number,
				ovr: Number
			},
			Tx: {
				ok: Number,
				error: Number,
				drp: Number,
				ovr: Number
			}
		}],
		date: {type: Date, default: Date.now, expires: 3600*24*7*2}}, { safe: true });
	this.model = mongoose.model('Network', NetworkSchema);
	setTimeout(function(thisObj){thisObj.emitter.emit('saveNewData', thisObj)}, this.decodeFrequency(this.saveFrequency), this);
}

NetworkDispatcher.prototype.getStatistics = function(){
	var statistics = new Object;
	statistics['connections'] = new Array;
	statistics['count'] = new Array;
	var thisObj = this;
	exec('netstat -putan; echo "----------------"; netstat -i', function(error, stdout, stderr){
		if(error !== null){
			console.log("Error in networkDispatcher: "+error);
		}else{
			var data = stdout;
			var blocks = data.split(/----------------/);	//First element is entire text
			var connections = blocks[0];
			var summary = blocks[1];
			var lines = connections.split(/\r?\n/g).slice(2, -1);
			
			for(var lineIndex in lines){
				var line = lines[lineIndex];
				var fields = line.match(/(\w+)\s+(\d+)\s+(\d+)\s+([\w+\.:]+)\s+([\w+\.:\*]+)\s+(\w+)?\s+(.+)/);
				if(fields){
					var isV6 = fields[1][fields[1].length-1] == '6';
					var protocol = fields[1];
					var inputAddress = new String;
					var inputPort = new String;
					var outputAddress = new String;
					var outputPort = new String;
					var status = fields[6];
					var process = fields[7].replace(/\s+$/, '');
					if(!isV6){
						inputAddress = fields[4].split(':')[0];
						inputPort = fields[4].split(':')[1];
						outputAddress = fields[5].split(':')[0];
						outputPort = fields[5].split(':')[1];
					}else{
						protocol = protocol.slice(0, -1);
						inputAddress = fields[4].match(/([\w:]+):.+/)[1];
						inputPort = fields[4].match(/[\w:]+:(.+)/)[1];
						inputAddress = fields[5].match(/([\w:]+):.+/)[1];
						inputPort = fields[5].match(/[\w:]+:(.+)/)[1];
					}
					statistics['connections'].push({
						v6: isV6,
						protocol: protocol,
						input: {address: inputAddress, port: inputPort},
						output: {address: outputAddress, port: outputPort},
						status: status,
						process: process});
				}
			}
			
			lines = summary.split(/\r?\n/g).slice(3, -1);
			for(var lineIndex in lines){
				var line = lines[lineIndex];
				var fields = line.match(/(\w+)\s+\d+\s+\d+\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+).*/).slice(1);
				statistics['count'][fields[0]] = {
					Rx:{
						ok: fields[1],
						error: fields[2],
						drp: fields[3],
						ovr: fields[4]
					},
					Tx:{
						ok: fields[5],
						error: fields[6],
						drp: fields[7],
						ovr: fields[8]
					}
				};
			}
			thisObj.data = statistics;
			thisObj.emitter.emit('newDataAvailable', thisObj);
		}
	});
};
NetworkDispatcher.prototype.saveData = function(){
	var thisData = this.data;		//Avoid race conditions
	var countData = new Array;
	
	for(var iface in thisData.count){
		countData.push({
			interface: iface, 
			Rx: thisData.count[iface].Rx, 
			Tx: thisData.count[iface].Tx});	
	}
	thisData.count = countData;
	var document = new this.model(thisData);
	document.save(function (err) {
		if (err) console.log(err);	
	});
};
module.exports = NetworkDispatcher;
