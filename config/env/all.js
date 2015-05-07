'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT_POP || 3000, // 
	db: process.env.MONGOHQ_URL,

	// front-end application directory
	app_dir: './app',

	// upload directory
	upload_dir: './upload',
	
	// logs directory
	logs_dir: './logs',
	
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'MEAN',
	
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions'
}


