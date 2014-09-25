var exec  = require('child_process').exec;
var BaseDispatcher = require('./baseDispatcher.js');

DiskDispatcher.prototype = new BaseDispatcher();
DiskDispatcher.prototype.constructor=DiskDispatcher;
function DiskDispatcher(io, mongoose){
	this.frequency = '1 minute';
	this.saveFrequency = '10 minutes';
	this.socketMessage = 'diskNews';
	this.io = io;
	
	var Schema = mongoose.Schema;
	var DiskSchema = new Schema({
	disk: String,
	used: Number, 
	free: Number, 
	usage: Number,
	mountpoint: String,
	date: {type: Date, default: Date.now, expires: 3600*24*7*2}}, { safe: true });
	
	this.model = mongoose.model('Disk', DiskSchema);
	setTimeout(function(thisObj){thisObj.emitter.emit('saveNewData', thisObj)}, this.decodeFrequency(this.saveFrequency), this);
}

DiskDispatcher.prototype.getStatistics = function(){
	var statistics = new Object;
	var thisObj = this;
	
	exec('df -k `ls /dev/[smh]d*`', function(error, stdout, stderr){
		if(error !== null){
			console.log("Error in diskDispatcher: "+error);
		}else{
			var data = stdout;
			var lines = data.match(/[^\n]+/g).slice(1); //First line is entire text
			for(var lineIndex in lines){
				var lineData = lines[lineIndex].match(/([^\s]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)%\s+([^\s]+)/).slice(1);
				statistics[lineData[0]] = new Object();
				statistics[lineData[0]]['used'] = lineData[2];
				statistics[lineData[0]]['free'] = lineData[3];
				statistics[lineData[0]]['usage'] = lineData[4];
				statistics[lineData[0]]['mountpoint'] = lineData[5];
			}
			thisObj.data = statistics;
			thisObj.emitter.emit('newDataAvailable', thisObj);
		}
	});
};
DiskDispatcher.prototype.saveData = function(){
	var thisData = this.data;		//Avoid race conditions
	
	for(var disk in thisData){
		var document = new this.model({
			disk: disk,
			used: thisData[disk].used,
			free: thisData[disk].free,
			usage: thisData[disk].usage,
			mountpoint: thisData[disk].mountpoint
			});
		console.log(document);
		document.save(function (err) {
			if (err) console.log(err);	
		});
	}
};
module.exports = DiskDispatcher;
