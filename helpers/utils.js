'use strict';

/**
* @function 	remove element from object
*/
function gf_RemoveElem(obj, target){
	var arry = target.split(',');
	for (var i in arry) {
    	delete obj[arry[i]];
	}
	return obj;
}

/**
 * @type : function
 * @access : public
 * @desc : export from rslt to csv response
 */
function gf_ExportCvs(res, rslt, file) {
	res.setHeader('Content-disposition', 'attachment; filename="' + file + '.csv"'); 
	res.setHeader('Content-type', 'text/csv'); 

	// header
	var body = ''; 
	if(!rslt) {
		return;
	}
    for (var j = 0; j < Object.keys(rslt[0]).length; j++) {
    	body +=  Object.keys(rslt[0])[j] + ',';
    };
	body += '\n'; 
	res.write(body); 
	
	// body
	for(var i = 0; i < rslt.length; i++) { 
		body = ''; 
	    for (var j in rslt[i]) {
	        if (!rslt[i].hasOwnProperty(j)) continue;
	        if (typeof rslt[i][j] != 'function') {
				body +=  (rslt[i][j] + '').replaceAll(',', '') + ',';
			} 
	    }
	    //console.log(body);
		body += '\n'; 
		res.write(body); 
	} 
	res.end(''); 
}

var gf_CheckUrl = function (str) {
	var regx = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
	str = str === void 0 ? '': str;
	if (str.match(regx)){
    	return true;
	}
	return false;
};

var gf_Request = function(req) {
	var config = require('../app.js').config;
	var input;
	input = req.query;
	if(!input || Object.keys(input).length == 0) {
		input = req.params;
		if(!input || Object.keys(input).length == 0) {
			input = req.body;
		}
	}
	return input;
};  

var gf_LoggingFromClient = function(req) {
	var config = require('../app.js').config;
	if(!config.logging.client) return;
	var time = '[client][' + moment().utc().toDate().format('YYYYMMDDHHmmssSS') + ']';
	var logger = require('../app.js').winston;
	logger.info(time + '[begin]========================================================================================');
	logger.info(time + ' title: ' + req.body.title);
	var arry = req.body.stack.split('\n');
	for(var i=0;i<arry.length;i++) {
		logger.info(time + '	' + arry[i]);
	}
	logger.info(time + ' user:' + req.body.user.full_name + '(' + req.body.user.user_email + ')' );
	logger.info(time + '[end]========================================================================================');
};
  
var gf_Log = function(level, rslt) {
	var config = require('../app.js').config;
	if(!config.logging[level]) return;
	var time = '[' + moment().utc().toDate().format('YYYYMMDDHHmmssSS') + ']';
	var logger = require('../app.js').winston;
	logger.info(time + JSON.stringify(rslt));
};

exports.removeElem = gf_RemoveElem;
exports.exportCvs = gf_ExportCvs;
exports.checkUrl = gf_CheckUrl;
exports.req = gf_Request;
exports.loggingFromClient = gf_LoggingFromClient;
exports.log = gf_Log;

