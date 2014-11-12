var exec  = require('child_process').exec;
var BaseDispatcher = require('./baseDispatcher.js');

UsersDispatcher.prototype = new BaseDispatcher();
UsersDispatcher.prototype.constructor=UsersDispatcher;
function UsersDispatcher(io, mongoose){
	this.frequency = '1 minute';
	this.saveFrequency = '10 minutes';
	this.previousTimes = new Object;
	this.socketMessage = 'usersNews';
	this.io = io;
	
	var Schema = mongoose.Schema;
	var UsersSchema = new Schema({
		users: [String],
		date: {type: Date, default: Date.now, expires: 3600*24*7*2}}, { safe: true });
	this.model = mongoose.model('Users', UsersSchema);
	setTimeout(function(thisObj){thisObj.emitter.emit('saveNewData', thisObj)}, this.decodeFrequency(this.saveFrequency), this);
}

UsersDispatcher.prototype.getStatistics = function(){
	var statistics = new Object;
	var thisObj = this;
	
	exec('users', function(error, stdout, stderr){
		if(error !== null){
			console.log("Error in usersDispatcher: "+error);
		}else{
			var data = stdout;
			statistics['users'] = data.replace(/\s+$/g, '').split(/\s+/);
			thisObj.data = statistics;
			thisObj.emitter.emit('newDataAvailable', thisObj);
		}
	});
};

module.exports = UsersDispatcher;
