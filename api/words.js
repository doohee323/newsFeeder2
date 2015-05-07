'use strict';

var logger = require('../app.js').winston;
var config = require('../app.js').config;
var commonDao = require("../helpers/common_dao.js");
var log = require("./log.js");
var redis_helpers = require('../helpers/redis_helpers');
var utils = require('../app.js').utils;
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var url = require("url");
var http = require('http');
var xpath = require('xpath');
var DOMParser = require('xmldom').DOMParser;

var urlInfo;

/**
 * Url bbs
 */
exports.bbs = function(req, res) {
	try {
		var input = utils.req(req);
		var rUrl = 'http://ckbch.org/_chboard/bbs/board.php?bo_table=m2_' + input.id;
		
		var mrslt = {};
		var key = 'concordchurch:' + input.id;
		redis_helpers.get(key, function(err, data){
      if(err || !data) {
				mrslt.rows = new Array();
			  getContent(rUrl, 0, 'main', function(data){
			    if(!data.row){
			    	data.rows.forEach(function(v, i, array){
						  getContent(v.link, i, 'video', function(data){
						  	v.video = data.rows.video;
						  	v.desc = data.rows.desc;
						  	mrslt.rows[mrslt.rows.length] = v;
						    if(data.code != -1 && data.row == (array.length - 1)){
									redis_helpers.store(key, JSON.stringify(mrslt), 3600, true);
						    	res.json(mrslt);
						    } else if(data.code === -1) {
									res.json({'code': -1});
						    }
						  });
			    	});
			    } else {
						res.json({'code': -1});
			    }
			  });
      } else {
      	mrslt.rows = data.rows;
	    	res.json(mrslt);
      }
    });
	} catch (e) {
		logger.error(e);
	}
}

var getContent = function(rUrl, row, parser, cb) {
	var rslt = {};
  rslt.message = 'success!';
	rslt.code = 200;
	var port = 80;
	urlInfo = url.parse(rUrl, true);
	
	if(urlInfo.port) {
		port = parseInt(urlInfo.host);
	}
	urlInfo.port = port;
	
	var headers = {
    'Content-Type': 'application/text'
	}
	
	var options = {
	  host: urlInfo.host,
	  port: port,
	  path: urlInfo.path,
	  headers: headers,
	  agent : false
	};
	
	http.globalAgent.maxSockets = 100000;
	http.get(options, function(resp){
		var body = '';
		resp.on('data', function(chunk) {
			body += chunk;
		});
		resp.on('end', function() {
			rslt = parseHtml(body, parser);
			rslt.row = row;
	    if(cb) return cb(rslt);
		});
	}).on("error", function(e){
  	logger.error("Got error: " + e.message);
    rslt.message = 'fail!';
    rslt.code = -1;
    if(cb) return cb(rslt);
	});	
};

/**
 * parseHtml
 */
var parseHtml = function(body, parser) {
		var rslt = {};
		var pHtml;
		//fs.writeFileSync('/Users/mac/git/concordchurch/app/views/test0.html', body);
		if(parser == 'main') {
			pHtml = body.substring(body.indexOf('<table width="97%" align=center cellpadding=0 cellspacing=0>'), body.indexOf('function all_checked(sw)'));
			pHtml = pHtml = pHtml.substring(0, pHtml.lastIndexOf('</table>')) + '</table>';
		} else if(parser == 'video') {
			pHtml = body.substring(body.indexOf('<body') + '<body'.length + 1, body.indexOf('</body'));
		}
		pHtml = sanitizeHtml(pHtml, {
		    allowedTags: [ 'img', 'table', 'tr', 'td', 'a', 'div', 'video', 'source'],
		    allowedAttributes: {'a': [ 'href', 'onclick' ],
		    					'img': [ 'src' ],
		    					'source': [ 'src' ]},
		    allowedSchemes: [ 'data', 'http' ]
		  });
		//fs.writeFileSync('/Users/mac/git/concordchurch/app/views/test.html', pHtml);
		
		var xmlDoc = new DOMParser().parseFromString(pHtml);
		var nodes = xpath.select("//title", xmlDoc);
		  
		if(parser == 'main') {
			var size = xpath.select("/table/tr/td/table", xmlDoc).length;
			var rows = [];  
			for(var i=1;i<size;i++) {
				try {
		  		var tags = "/table/tr/td/table["+i+"]/tr/td/table/tr/td/table/tr/td/table/tr";
				  var img = xpath.select(tags + "/td/table/tr/td/img", xmlDoc)[0].attributes[0].value;
				  var link = xpath.select(tags + "/td/table/tr/td/a", xmlDoc)[1].attributes[0].value;
				  var title = xpath.select(tags + "/td/table/tr/td/a/text()", xmlDoc)[0].data.trim();
				  var content = xpath.select(tags + "/td[8]/text()", xmlDoc)[0].data.trim();
				  var speaker = xpath.select(tags + "/td[13]/text()", xmlDoc)[0].data.trim();
				  var date = xpath.select(tags + "/td[15]/text()", xmlDoc)[0].data.trim();
				  var bible = xpath.select(tags + "/td[18]/div/text()", xmlDoc)[0].data.trim();
				  link = link.substring(link.indexOf('(') + 2, link.indexOf('\','));
				  var row = {'img':img, 'link':link, 'title':title, 'content':content, 'speaker':speaker, 'date':date, 'bible':bible};
				  rows[i - 1] = row;
		  	} catch (e) {
			  	logger.error("Got error: " + e.message);
		  	}
		  }
		  rslt.rows = rows;
		} else if(parser == 'video') {
			var video = xpath.select("/div/div/video/source", xmlDoc)[0].attributes[0].value;
			var desc = xpath.select("/div[2]/div[4]/text()", xmlDoc)[0].nodeValue;
		  var row = {'video':video, 'desc':desc};
		  rslt.rows = row;
		}
	  return rslt;
}

/**
 * invite
 */
exports.invite = function(req, res) {
	try {
		var input = req.url;
		logger.debug("req.url: " + req.url);
		input = input.substring('/invite/'.length, input.length);
		
		var b = new Buffer(input, 'base64');
	  var code = b.toString();
		var sql = 'SELECT * FROM BUNCH_ADJUST_CAMPAIGN WHERE code = ?';
    commonDao.getConnection(config.mysql.usersDB).then(function (conn) {
			var query = conn.query(sql, [code], function(err, results, fields) {
				commonDao.closeConnection(conn);
        if(results && results.length > 0) {
					var rUrl = results[0].url;
					res.writeHead(200, {'Content-Type': 'text/html'});
					var str = "";
					str += "<html>\n";
					str += "<script>\n";
					str += "var tar = 'https://app.adjust.io/" + rUrl + "';\n";
					str += "document.location.href = tar;\n";
					str += "</script>\n";
					str += "</html>\n";
			    res.write(str);
			    res.end();		
        } else {
			  	res.sendfile('./app/404.html');
        }
			});
			logger.info('[' + conn.config.database + '] : ' + query.sql);	
		});	
	} catch (e) {
		logger.error(e);
	}
}

/**
 * get test
 */
exports.test = function(req, res) {
		var input = utils.req(req);
		logger.debug("req.url: " + req.url);
		
		var rslt = {};
		if(input.id == 'NewYork') {
			res.json({'temperature': '91'});
		} else if(input.id == 'Washington') {
			res.json({'temperature': '92'});
		} else if(input.id == 'London') {
			res.json({'temperature': '93'});
		}
}

exports.loggingFromClient = function(req, res) {
	utils.loggingFromClient(req);
};