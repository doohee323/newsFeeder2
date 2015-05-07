'use strict';

/**
 * Module dependencies.
 */
var logger = require('../app.js').winston;
var config = require('../app.js').config;
var utils = require('../app.js').utils;
var commonDao = require("../helpers/common_dao.js");

var input = {
	conn: config.mysql.adminsDB,
	tableNm: 'AT_ACCESS_LOG',
	dataset: 'log',
	keycolnm: 'id',
	datecolnm: 'created_at,updated_at'
};

/**
 * Crudl log
 */
exports.list = function(req, res) {
	
	input.crud = 'L';
	
	if(req.params.id) {
		input.params = JSON.parse(req.params.id);
		utils.removeElem(input.params, 'id');
	} else if(req.params.csv) {
		input.params = JSON.parse(req.params.csv);
		input.searchColnm = req.params.searchColnm;
		var file = input.params.csv;
		utils.removeElem(input.params, 'csv');
	} else {
		input.params = req.params;
		input.searchColnm = input.params.searchColnm;
	}
	
	input.sql = 'SELECT *, CONCAT(IFNULL(B.first_name, ""), IFNULL(B.last_name, "")) AS curator_nm \n';
	input.sql += 'FROM CURATOR_CONTENT A, USER B WHERE A.curator_id = B.user_id \n';
	if(input.params.create_start) {
		var create_start = new Date(input.params.create_start);
		var create_end = new Date(input.params.create_end);
		input.sql += ' AND A.created_at BETWEEN date_format("' + create_start.format('YYYYMMDD')
		+ '", "%Y-%m-%d") AND date_format("' + create_end.format('YYYYMMDD') + '", "%Y-%m-%d") \n';
	}
	if(input.params.location) {
		input.sql += ' AND A.location LIKE "%' + input.params.location + '%" \n';
	}
	if(input.params.user_id) {
		input.sql += ' AND A.user_id = "%' + input.params.user_id + '%" \n';
	}
	logger.info('[' + input.conn + '] : ' + input.sql);
	input.arg = [];	
	
    commonDao.crudl(input, function(rslt){
    	utils.removeElem(input.params, 'searchColnm');
    	if(req.params.csv) {
	    	utils.exportCvs(res, rslt.log, file);
    	} else {
		    return res.json(rslt);
		}
    });
}
exports.get = function(req, res) {
	
	input.crud = 'R';
	input.params = req.params;
    commonDao.crudl(input, function(rslt){
	    return res.json(rslt);
    });
}
exports.create = function(input) {
	input.crud = 'C';
    commonDao.crudl(input, function(rslt){
	    return res.json(rslt);
    });
};
