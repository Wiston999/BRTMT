var exec  = require('child_process').exec;
var BaseDispatcher = require('./baseDispatcher.js');

MemoryDispatcher.prototype = new BaseDispatcher();
MemoryDispatcher.prototype.constructor=MemoryDispatcher;
function MemoryDispatcher(io, mongoose){
	this.frequency = '1 second';
	this.saveFrequency = '10 minutes';
	this.previousTimes = new Object;
	this.socketMessage = 'memoryNews';
	this.io = io;
	
	var Schema = mongoose.Schema;
	var MemorySchema = new Schema({
		ram: {
			total: Number,
			free: Number,
			shared: Number,
			buffered: Number,
			cached: Number
		},
		swap: {
			total: Number,
			free: Number
		},
		date: {type: Date, default: Date.now, expires: 3600*24*7*2}}, { safe: true });
	this.model = mongoose.model('Memory', MemorySchema);
	setTimeout(function(thisObj){thisObj.emitter.emit('saveNewData', thisObj)}, this.decodeFrequency(this.saveFrequency), this);
}

MemoryDispatcher.prototype.getStatistics = function(){
	var statistics = new Object;
	var thisObj = this;
	exec('free -k', function(error, stdout, stderr){
		if(error !== null){
			console.log("Error in memoryDispatcher: "+error);
		}else{
			data = stdout;
			var resultRam = data.match(/mem:\s+(\d+)\s+\d+\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);
			var resultSwap = data.match(/swap:\s+(\d+)\s+\d+\s+(\d+)/i);
		
			statistics['ram'] = new Object;
			statistics['swap'] = new Object;
			statistics['ram']['total'] = resultRam[1];
			statistics['ram']['free'] = resultRam[2];
			statistics['ram']['shared'] = resultRam[3];
			statistics['ram']['buffered'] = resultRam[4];
			statistics['ram']['cached'] = resultRam[5];
			statistics['swap']['total'] = resultSwap[1];
			statistics['swap']['free'] = resultSwap[2];
			thisObj.data = statistics;
			thisObj.emitter.emit('newDataAvailable', thisObj);
		}
	});
};

module.exports = MemoryDispatcher;
