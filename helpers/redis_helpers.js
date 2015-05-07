
var logger = require('../app.js').winston;

var redis = require("redis");
var config = require('../app.js').config;
var client;
var tail = require("terminus").tail,
sprintf = require("sprintf-js").sprintf,
f = {};
	
f.format = {};
f.format.start = "locket:session:v1:";
f.format.kind = f.format.start + "%s:*";

var getConnection = function () {
	console.log('-----------------');
	client = redis.createClient(config.redis.port, config.redis.host);
	client.on("error", function (err) {
	  console.log("REDIS Error " + err);
	});
}

module.exports.keys = function () {
  return f.already;
};

module.exports.store = function(key, val, ex, update){
  if(!update){
    key = f.format.start + key;
  }
  getConnection();
  client.set(key, val);
  if(ex !== null && ex !== void 0 && ex > 0){
    client.EXPIRE(key, ex);
  }
  client.quit();
  return({key: key, data: val, expires: ex});
};

module.exports.set = function(key, val, ex){
  getConnection();
  client.set(key, val);
  if(ex !== null && ex !== void 0 && ex > 0){
    client.EXPIRE(key, ex);
  }
  client.quit();
  return({key: key, data: val, expires: ex});
};

module.exports.remove = function(key) {
  getConnection();
  client.del(key);
  client.quit();
  return true;
};

module.exports.fetchAll = function (cb) {
  var str = "";
  f.already = [];
  str = f.format.start + "*";
  getConnection();
  client.keys(str, function(err, replies){
    client.quit();
    if(err){
      cb(err);
    }
    f.already = replies;
    cb(null);
  });

};

module.exports.getKeys = function(kind, cb, limit) {
  var str = sprintf(f.format.kind, kind);
  getConnection();
  client.keys(str, function(err, replies){
    client.quit();
    if(err){
      cb(err);
    }
    if(limit !== void 0){
      replies = replies.slice(0, 1000);
    }
    cb(null, replies);
  });
};

module.exports.get = function(key, cb, prepend){
  if(prepend === true){
    key = f.format.start + key;
  }
  getConnection();
  client.get(key, function(err, result) {
    client.quit();
  	if(result == null) {
	    cb(-1, null);
      return;
  	}
		try {
	    result = JSON.parse(result);
    } catch (e) {
    }
    result.key = key;
    if(err === null){
      cb(null, result);
      return;
    }
    cb(err, result);
  });
};

function subCallback(channel) {
	var client = redis.createClient(config.redis.port, config.redis.host);
	
	if(channel == 'updateLogs_1') {
		getConnection();
	    client.hgetall(channel, function(err, reply) {
		    client.quit();
	    	console.log("========hgetall2");
			if(reply) {
				Object.keys(reply).forEach(function(key) {
					console.log(key + ": " + reply[key]);
	        	});
			}
	    	client.end();
	    });	
	}

}

exports.subCallback = subCallback;
