var exec  = require('child_process').exec;
var os = require('os');
var BaseDispatcher = require('./baseDispatcher.js');

ProcessesDispatcher.prototype = new BaseDispatcher();
ProcessesDispatcher.prototype.constructor=ProcessesDispatcher;
function ProcessesDispatcher(io, mongoose){
	this.frequency = '1 second';
	this.saveFrequency = '10 minutes';
	this.socketMessage = 'processesNews';
	this.io = io;
	
	var Schema = mongoose.Schema;
	var ProcessSchema = new Schema({
		processes: Number, 
		threads: Number, 
		date: {type: Date, default: Date.now, expires: 3600*24*7*2}}, { safe: true });
	this.model = mongoose.model('Process', ProcessSchema);
	setTimeout(function(thisObj){thisObj.emitter.emit('saveNewData', thisObj)}, this.decodeFrequency(this.saveFrequency), this);
}

ProcessesDispatcher.prototype.getStatistics = function(){
	var statistics = new Object;
	statistics['summary'] = {
		'processes': 0,
		'threads': 0
	}
	statistics['procs'] = {};
	var thisObj = this;
	exec('ps axo pid,tid,user,etime,command | tail -n +2', function(error, stdout, stderr){
		if(error !== null){
			console.log("Error in processesDispatcher: "+error);
		}else{
			var data = stdout;
			var lines = data.match(/[^\n]+/g).slice(1);	//First element is entire text
			for(var lineIndex in lines){
				var line = lines[lineIndex];
				var result = line.match(/(\d+)\s+(\d+)\s+([\w-]+)\s+([\d\:\-]+)\s+(.+)/i);
				if(result[1] == result[2]){
					statistics['summary']['processes']+=1;
					statistics['procs'][result[1]] = {
						pid: parseInt(result[1]),
						user: result[3],
						command: result[5],
						etime: thisObj.parseETime(result[4])
					};
				}else{
					statistics['summary']['threads']+=1;
				}
				
			}
			thisObj.data = statistics;
			thisObj.emitter.emit('newDataAvailable', thisObj);
		}
	});
};

ProcessesDispatcher.prototype.parseETime = function(eTimeString){
	var timeRegexp = new RegExp(/^(?:(\d+)\-)?(?:(\d+):)?(?:(\d+):)(\d+)$/);
	var elapsedMilis = 0;
	var eTimeCaptured = eTimeString.match(timeRegexp);
	eTimeCaptured = eTimeCaptured.slice(1);
	
	if(eTimeCaptured[0]){	//Days
		elapsedMilis += eTimeCaptured[0]*24*3600*1000;
	}
	eTimeCaptured = eTimeCaptured.slice(1);
	
	if(eTimeCaptured[0]){	//Hours
		elapsedMilis += eTimeCaptured[0]*3600*1000;
	}
	eTimeCaptured = eTimeCaptured.slice(1);
	
	if(eTimeCaptured[0]){	//Minutes
		elapsedMilis += eTimeCaptured[0]*60*1000;
	}
	eTimeCaptured = eTimeCaptured.slice(1);
	
	if(eTimeCaptured[0]){	//Seconds
		elapsedMilis += eTimeCaptured[0]*1000;
	}
	eTimeCaptured = eTimeCaptured.slice(1);
	
	return elapsedMilis;
};
module.exports = ProcessesDispatcher;