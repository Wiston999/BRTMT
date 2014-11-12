var EventEmitter = require('events').EventEmitter;

var BaseDispatcher = function(){
	this.frequency = undefined;
	this.saveFrequency = undefined;
	this.model = undefined;
	this.running = true;
	this.data = new Object();
	this.emitter = new EventEmitter();
	this.emitter.on('newDataAvailable', function(thisObj){
		if(thisObj.io){
			thisObj.io.sockets.emit(thisObj.socketMessage, thisObj.data);
		}
		if(thisObj.frequency !== undefined){
			setTimeout(function(thisObj){thisObj.run()}, thisObj.decodeFrequency(thisObj.frequency), thisObj);		
		}
	});
	
	this.emitter.on('saveNewData', function(thisObj){
		if(thisObj.model){	//If model is defined
			thisObj.saveData();
		}
		if(thisObj.saveFrequency !== undefined){
			setTimeout(function(thisObj){thisObj.emitter.emit('saveNewData', thisObj)}, thisObj.decodeFrequency(thisObj.saveFrequency), thisObj);
		}
	});
};

BaseDispatcher.prototype.run = function(){
	if(this.running){
		this.getStatistics();
	}
	return this;
};
BaseDispatcher.prototype.stop = function(){
	this.running = false;
	console.log('Parando');
	return this;
};
BaseDispatcher.prototype.start  = function(){
	this.running = true;
	console.log('Reanudando');
	return this;
};
BaseDispatcher.prototype.decodeFrequency = function(frequencyString){
	var result = frequencyString.match(/(\d+)\s+(\w+?)s?$/i);
	var timeoutSeconds = parseInt(result[1]);
			
	switch(result[2]){
		case 'second':
			timeoutSeconds *= 1000;
		break;
		case 'minute':
			timeoutSeconds *= 60000;
		break;
		case 'hour':
			timeoutSeconds *= 3600000;
		break;
		case 'day':
		default:
			timeoutSeconds *= 3600*24000;
		break;
	}
	return timeoutSeconds;
};
BaseDispatcher.prototype.fetchData = function(req, res){
	this.model.find().sort({'date': -1}).limit(100).exec(function(err, docs){
		if(err){
			res.send(404);
		}
		res.send(docs);
	});
};
BaseDispatcher.prototype.saveData = function(){
	var document = new this.model(this.data);
	document.save(function (err) {
		if (err) console.log(err);	
	});
};
module.exports = BaseDispatcher;
