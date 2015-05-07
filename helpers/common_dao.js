'use strict';

var logger = require('../app.js').winston;
var config = require('../app.js').config;
var mysql = require('../app.js').mysql;
var pool = require('../app.js').pool;
var Q = require('q');

var poolUseYn = config.mysql.poolUseYn;

function getConnection(db, req) {
	if(req && req.session && req.session.mysql) {
		db = req.session.mysql;
	}

    var deferred = Q.defer();
    
	if(!poolUseYn) {
		var mysqlConfig = {
		  host: config.mysql.dbHost,
		  port: config.mysql.port,
		  user: config.mysql.dbUsername,
		  password: config.mysql.dbPassword,
		}
		mysqlConfig.database = db;
console.log('----' + mysqlConfig.database);
		var conn = mysql.createConnection(mysqlConfig);
        deferred.resolve(conn);
	} else {
	    pool.getConnection(function (error, conn) {
	        if (error) {
	            deferred.reject(error);
	        }
	        conn.config.database = db;
	        conn.query('use ' + db, function(error) {
	            if(error) {
	                deferred.reject(error);
	            }
	            deferred.resolve(conn);
	        });
	    });
	
	}
	
    return deferred.promise.catch(function(error) {
        console.error('Failed to get conn from pool', error);
    });
}

function closeConnection(conn) {
	if(!poolUseYn) {
		conn.destroy();
	} else {
		conn.release();
	}
}

function crudl(input, next) {
	var _tableNm = input.tableNm;
	var _keycolnm = input.keycolnm;
	var _subKeycolnm = input.subKeycolnm;
	var _searchColnm = input.searchColnm;
	var _orderSql = input.orderSql;
	var _limitSql = 'limit 100';
	
	var _crud = input.crud;
	var _conn = input.conn;
	var _params = input.params;
	var _sql = input.sql;
	var _arg = input.arg;

    getConnection(_conn).then(function (conn) {
		var rslt = {};
		var query;
	    if(_crud == 'L') {
		    var id = _params[_keycolnm];
		    if(!id) {
		    	id = _params[Object.keys(_params)[0]];
		    	if(!id) {
			    	id = '';
		    	}
		    }
		    id = '%' + id + '%';
		    
		    var arg;
		    if(_arg) {
		    	arg = _arg;
		    }
		    var sql;
		    if(_sql) {
		    	sql = _sql;
		    } else {
			    sql = 'SELECT * FROM ?? WHERE ?? LIKE ?';
			    if(!_searchColnm) {
			    	sql = 'SELECT * FROM ??';
			    	arg = _tableNm;
			    } else {
				    if(_searchColnm.indexOf('CONCAT') > -1) {  // simple query condition extention
				    	sql = 'SELECT * FROM ?? WHERE ' + _searchColnm + ' LIKE ?';
				    	arg = [_tableNm, id];
				    } else {
				    	sql = 'SELECT * FROM ?? WHERE ?? LIKE ?';
				    	arg = [_tableNm, _searchColnm, id];
				    }
			    }
		    }
		    if(_orderSql) {
		    	sql += ' ' + _orderSql;
		    }
		    if(_limitSql) {
		    	sql += ' ' + _limitSql;
		    }
		    
			query = conn.query(sql, arg, function(err, result) {
				if (err) { 
					logger.error(err.code);
		            rslt.code = err.code;
		            rslt.message = err.message;
				} else {
					if(result && result[0]) {
			            rslt.code = 0;
			            rslt.message = 'success!';
				        rslt[input.dataset] = result;
					} else {
			            rslt.code = -2;
			            rslt.message = 'retrieve error!';
						logger.error(rslt);
					}
				}
				closeConnection(conn);
				return next(rslt);
		    });
		} else if(_crud == 'R') {
		    var id;
		    var searchColnm;
		    if(_searchColnm) {
		    	searchColnm = _searchColnm;
		    } else {
		    	searchColnm = _keycolnm;
		    }
		    id = _params[searchColnm];
			query = conn.query('SELECT * FROM ?? WHERE ?? = ?', [_tableNm, searchColnm, id], function(err, result) {
				if (err) { 
					logger.error(err.code);
		            rslt.code = err.code;
		            rslt.message = err.message;
				} else {
					if(result[0]) {
			            rslt.code = 0;
			            rslt.message = 'success!';
				        rslt[input.dataset] = result[0];
					} else {
			            rslt.code = -2;
			            rslt.message = 'retrieve error!';
						logger.error(rslt);
					}
				}
				closeConnection(conn);
				return next(rslt);
		    });
		} else if(_crud == 'C') {
		    var dataset  = _params;
			var bcrypt = input.bcrypt;
			if(bcrypt && dataset.password) {
				var salt = bcrypt.genSaltSync(10);
			    var hash = bcrypt.hashSync(escape(dataset.password), salt);
			    dataset.password = hash;
		    }
        	if(input.datecolnm) {
        		var tmp = input.datecolnm.split(',');
        		dataset[tmp[0]] = new Date();
        		if(tmp[1]) dataset[tmp[1]] = new Date();
        	}
			query = conn.query('INSERT INTO ?? SET ?', [_tableNm, dataset], function(err, result) {
				if (err) {
					logger.error(err.code);
		            rslt.code = err.code;
		            rslt.message = err.message;
					closeConnection(conn);
					return next(rslt);
				} else {
			        rslt[input.dataset] = dataset;
			        if(result) {
			            rslt.code = 0;
			            rslt.message = 'success!';
			            rslt.changedRows = result.changedRows;
					    var sql, arg, query2, subKeycolnm, subKeyval = '';
			            if(typeof _subKeycolnm != 'string') {
			            	subKeycolnm = 'CONCAT(';
			            	for(var i=0;i<_subKeycolnm.length;i++) {
			            		subKeycolnm += _subKeycolnm[i] + ',';
			            		subKeyval += dataset[_subKeycolnm[i]];
			            	}
			            	subKeycolnm = subKeycolnm.substring(0, subKeycolnm.length - 1) + ')';
			            	sql = 'SELECT * FROM ?? WHERE ' + subKeycolnm + ' = ?';
			            	arg = [_tableNm, subKeyval];
			            } else {
			            	subKeycolnm = _subKeycolnm;
			            	subKeyval = dataset[_subKeycolnm];
			            	sql = 'SELECT * FROM ?? WHERE ?? = ?';
			            	arg = [_tableNm, subKeycolnm, subKeyval];
			            }
			            query2 = conn.query(sql, arg, function(err, result2) {
							if (err) { logger.error(err.code); throw err; }
							if(result2[0]) {
					            rslt.code = 0;
					            rslt.message = 'insert success!';
						        rslt[input.dataset][_keycolnm] = result2[0][_keycolnm];
							} else {
					            rslt.code = -2;
					            rslt.message = 'insert error!';
								logger.error(rslt);
							}
							closeConnection(conn);
							return next(rslt);
					    });
					    logger.info(query2.sql);
			        } else {
			            rslt.code = -2;
			            rslt.message = 'insert error!';
						logger.error(rslt);
						closeConnection(conn);
						return next(rslt);
			        }				
				}
			});
	    } else if(_crud == 'U') {
		    var dataset  = _params;
			var bcrypt = input.bcrypt;
			if(bcrypt && dataset.password) {
				var salt = bcrypt.genSaltSync(10);
			    var hash = bcrypt.hashSync(escape(dataset.password), salt);
			    dataset.password = hash;
		    }
        	if(input.datecolnm) {
        		var tmp = input.datecolnm.split(',');
        		if(tmp[1]) dataset[tmp[1]] = new Date();
        	}
		    var keyvalue = dataset[_keycolnm];
		    delete dataset[_keycolnm]; 
			query = conn.query('UPDATE ?? SET ? WHERE ?? = ?', [_tableNm, dataset, _keycolnm, keyvalue], function(err, result) {
				if (err) {
					logger.error(err.code);
		            rslt.code = err.code;
		            rslt.message = err.message;
				} else {
			        if(result && result.changedRows > 0) {
			            rslt.code = 0;
			            rslt.message = 'success!';
			            rslt.changedRows = result.changedRows;
			        } else {
			            rslt.code = -2;
			            rslt.message = 'update error!';
						logger.error(rslt);
			        }
			        dataset[_keycolnm] = keyvalue;
			        rslt[input.dataset] = dataset;
				}
		        closeConnection(conn);
				return next(rslt);
			});
	    } else if(_crud == 'D') {
		    var id = _params[_keycolnm];
			query = conn.query('DELETE FROM ?? WHERE ?? = ?', [_tableNm, _keycolnm, id], function(err, result) {
				if (err) {
					logger.error(err.code);
		            rslt.code = err.code;
		            rslt.message = err.message;
				} else {
			        if(result && result.affectedRows > 0) {
			            rslt.code = 0;
			            rslt.message = 'success!';
			            rslt.affectedRows = result.changedRows;
			        } else {
			            rslt.code = -2;
			            rslt.message = 'delete error!';
						logger.error(rslt);
			        }
				}
		        closeConnection(conn);
				return next(rslt);
			});
	    }
	    logger.info('[' + conn.config.database + '] : ' + query.sql);
	});
}

exports.crudl = crudl;
exports.getConnection = getConnection;
exports.closeConnection = closeConnection;

