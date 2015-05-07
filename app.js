'use strict';

/**
 * Module dependencies.
 */
var express = require('express')
	, http = require('http')
	, path = require('path')
	, fs = require('fs')
	, mysql = require('mysql')
	, prototype = require('./app/scripts/common/prototype')
	, bcrypt = require('bcrypt')
	, squel = require('squel')
	, winston = require('winston')
	, http = require('http')
	, path = require('path')
	, utils = require('./helpers/utils')
	;

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initializing system variables
var config = require('./config/config');

// Bootstrap db connection
var mysqlConfig = {
  host: config.mysql.dbHost,
  port: config.mysql.port,
  user: config.mysql.dbUsername,
  password: config.mysql.dbPassword,
  database: config.mysql.adminsDB
}

if(config.nodetime.useYn) {
	require('nodetime').profile({
	    accountKey: '83fc29ca18f6fb2f51f0a103175fd7b92b9c2677', 
	    appName: 'concordchurch.me'
	  });
}
  
// for admin's db
var pool  = mysql.createPool(mysqlConfig);
var pool  = mysql.createPool({
    host: config.mysql.dbHost,
    port: config.mysql.port,
    user: config.mysql.dbUsername,
    password: config.mysql.dbPassword
});
var conn = mysql.createConnection(mysqlConfig);

// for common user's db
mysqlConfig.database = config.mysql.usersDB;
var poolUser  = mysql.createPool(mysqlConfig);
var connUser = mysql.createConnection(mysqlConfig);

// for developer's db
mysqlConfig.database = config.mysql.developersDB;
var poolDev  = mysql.createPool(mysqlConfig);
var connDev = mysql.createConnection(mysqlConfig);

console.log('----' + mysqlConfig.host);
console.log('----' + mysqlConfig.port);
console.log('----' + mysqlConfig.user);
console.log('----' + mysqlConfig.password);
console.log('----' + mysqlConfig.database);

// timezone
var timezone = {};
var query = conn.query('SELECT tz_cd, tz_nm, tz_gap FROM AT_TIMEZONE', [], function(err, results, fields) {
    if(results && results.length > 0) {
        timezone = results;
    } else {
		console.log('timezone error!');
    }
});
console.log(query.sql);

// server crash block
process.on('uncaughtException', function (err) {
 console.log('Caught exception: ' + err);
});

fs.exists(config.logs_dir, function (exists) {
	if(!exists) {
		fs.mkdir(config.logs_dir);
	}
});
fs.exists(config.upload_dir, function (exists) {
	if(!exists) {
		fs.mkdir(config.upload_dir);
	}
});

var app = express();

// Intercept bots and respond with metainfo site instead
//require('./metainfo')(app);

winston.add( winston.transports.DailyRotateFile, {
  level: 'debug',
  json: false,
  filename: config.logs_dir + '/debug-',
  datePattern: 'yyyy-MM-dd.log'
});

// all environments
var appExports = module.exports = {};
appExports.mysql = mysql;
appExports.pool = pool;
appExports.conn = conn;
appExports.poolUser = poolUser;
appExports.connUser = connUser;
appExports.poolDev = poolDev;
appExports.connDev = connDev;

appExports.config = config;
appExports.utils = utils;
appExports.bcrypt = bcrypt;
appExports.timezone = timezone;
appExports.squel = squel;
appExports.winston = winston;

// Express settings
require('./config/express')(app);

// Bootstrap routes
require('./config/routes')(app);

// Start the app by listening on <port>
process.argv.forEach(function (val, index, array) {
  //console.log(index + ': ' + val);
  if(index == 2 && val.indexOf('=') > -1) {
  	config.app.instance_no = val.split('=')[1];
  }
});
console.log('process.env.PORT_POP:' + process.env.PORT_POP + ' / config.app.instance_no:' + config.app.instance_no);
process.env.PORT_POP = parseInt(process.env.PORT_POP) + parseInt(config.app.instance_no);
console.log('process.env.PORT_POP:' + process.env.PORT_POP);
app.listen(process.env.PORT_POP);
app.set('port', process.env.PORT_POP);

// redis subscribe
/*
var redis = require("redis");
var redis_helpers = require('./helpers/redis_helpers.js');
var subClient = redis.createClient(config.redis.port, config.redis.host);
subClient.on("subscribe", function (channel, count) {
	console.log('subscribe: ' + channel);
	//debugger;
});
subClient.on("message", function(channel, message) {
	redis_helpers(message);
    //subClient.unsubscribe();
    //subClient.end();
});
subClient.subscribe("pubChannel");
*/

// Expose app
exports = module.exports = app;

console.log('started!!!!' + config.redis.port + ' / ' + config.redis.host);
