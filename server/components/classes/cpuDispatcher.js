var os  = require('os');
var BaseDispatcher = require('./baseDispatcher.js');

CpuDispatcher.prototype = new BaseDispatcher();
CpuDispatcher.prototype.constructor=CpuDispatcher;
function CpuDispatcher(io, mongoose){
	this.frequency = '1 second';
	this.saveFrequency = '10 minutes';
	this.previousTimes = new Object;
	this.socketMessage = 'cpuNews';
	this.io = io;
	var cpus = os.cpus();
	for(var cpuId in cpus){	
		this.previousTimes[cpuId] = new Object;
		this.previousTimes[cpuId]['user'] = cpus[cpuId]['times']['user'];
		this.previousTimes[cpuId]['sys'] = cpus[cpuId]['times']['sys'];
		this.previousTimes[cpuId]['idle'] = cpus[cpuId]['times']['idle'];
	}
	
	var Schema = mongoose.Schema;
	var CpuSchema = new Schema({
		cpus: [{id: Number, usage: Number}],
		date: {type: Date, default: Date.now, expires: 3600*24*7*2}}, { safe: true });
	this.model = mongoose.model('Cpus', CpuSchema);
	setTimeout(function(thisObj){thisObj.emitter.emit('saveNewData', thisObj)}, this.decodeFrequency(this.saveFrequency), this);
}

CpuDispatcher.prototype.getStatistics = function(){
	var cpus = os.cpus();
	var currentTimes = new Object;
	var statistics = new Object;
	for(var cpuId in cpus){
		currentTimes[cpuId] = new Object;
		currentTimes[cpuId]['user'] = cpus[cpuId]['times']['user'];
		currentTimes[cpuId]['sys'] = cpus[cpuId]['times']['sys'];
		currentTimes[cpuId]['idle'] = cpus[cpuId]['times']['idle'];
		statistics[cpuId] = currentTimes[cpuId]['user']+currentTimes[cpuId]['sys']+currentTimes[cpuId]['idle'];
		statistics[cpuId] -= (this.previousTimes[cpuId]['user']+this.previousTimes[cpuId]['sys']+this.previousTimes[cpuId]['idle']);
		statistics[cpuId] = 1-((currentTimes[cpuId]['idle']-this.previousTimes[cpuId]['idle']) / statistics[cpuId]);
	}

	this.previousTimes = currentTimes;
	this.data = statistics;
	this.emitter.emit('newDataAvailable', this);
};

CpuDispatcher.prototype.saveData = function(){
	var thisData = this.data;		//Avoid race conditions
	var data = new Array;
	for(var cpuId in thisData){
		data.push({id: cpuId, usage: thisData[cpuId]});	
	}
	var document = new this.model({cpus: data});
	console.log(document);
	document.save(function (err) {
		if (err) console.log(err);	
	});
};
module.exports = CpuDispatcher;
