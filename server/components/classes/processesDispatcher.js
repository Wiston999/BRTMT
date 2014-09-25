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
	statistics['processes'] = 0;
	statistics['threads'] = 0;
	statistics['load'] = os.loadavg();
	var thisObj = this;
	exec('ps -elfT | tail -n +2', function(error, stdout, stderr){
		if(error !== null){
			console.log("Error in processesDispatcher: "+error);
		}else{
			var data = stdout;
			var lines = data.match(/[^\n]+/g).slice(1);	//First element is entire text
			for(var lineIndex in lines){
				var line = lines[lineIndex];
				var result = line.match(/\d+\s+\w+\s+\w+\s+(\d+)\s+(\d+).*/i);
				if(result[1] == result[2]){
					statistics['processes']+=1;
				}else{
					statistics['threads']+=1;
				}
			}
			thisObj.data = statistics;
			thisObj.emitter.emit('newDataAvailable', thisObj);
		}
	});
};

module.exports = ProcessesDispatcher;