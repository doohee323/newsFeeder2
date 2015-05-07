'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
  	hbs = require('handlebars'),
    config = require('./config');
    
var winston = require('winston');
var expressWinston = require('express-winston');
var path = require('path');

module.exports = function(app) {
    app.set('showStackError', true);

    // Prettify HTML
    app.locals.pretty = true;

    // Should be placed before express.static
    // To ensure that all assets and data are compressed (utilize bandwidth)
    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));

    // Enable jsonp
    app.enable("jsonp callback");

    app.configure(function() {
        // The cookieParser should be above session
        app.use(express.cookieParser());

        // Request body parsing middleware should be above methodOverride
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(express.multipart());
        app.use(express.methodOverride());
        
				//CORS 
				var allowCrossDomain = function(req, res, next) {
					//res.header('Access-Control-Allow-Credentials', true);
					var oneof = false;
			    if(req.headers.origin) {
			        res.header('Access-Control-Allow-Origin', req.headers.origin);
			        oneof = true;
			    }
			    if(req.headers['access-control-request-method']) {
			        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
			        oneof = true;
			    }
			    if(req.headers['access-control-request-headers']) {
			        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
			        oneof = true;
			    }
			    if(oneof) {
			        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
			    }
			    // intercept OPTIONS method
			    if (oneof && req.method == 'OPTIONS') {
			        res.send(200);
			    } else {
			        next();
			    }	    
				}        
        app.use(allowCrossDomain);
	
        // Express/Mongo session storage
        app.use(express.session({
            secret: config.sessionSecret
        }));
        
        // Connect flash for flash messages
        app.use(flash());

        // Dynamic helpers
        app.use(helpers(config.app.name));
        
	    // access log
	    if (process.env.NODE_ENV === 'development') {
			app.use(expressWinston.logger({
			      transports: [
			        new winston.transports.DailyRotateFile({
					  json: true,
					  filename: config.logs_dir + '/access-',
					  datePattern: 'yyyy-MM-dd.log'
					})
			      ]
			    }));
	    } else if (process.env.NODE_ENV === 'production') {
			app.use(expressWinston.logger({
			      transports: [
			        new winston.transports.DailyRotateFile({
					  json: true,
					  filename: config.logs_dir + '/access-',
					  datePattern: 'yyyy-MM-dd.log'
					})
			      ]
			    }));
	    }        

        // Routes should be at the last
        app.use(app.router);
        
	    // access log for error
	    if (process.env.NODE_ENV === 'development') {
			app.use(expressWinston.errorLogger({
			      transports: [
			        new winston.transports.Console({
			          json: true,
			          colorize: true
			        }),
			        new winston.transports.DailyRotateFile({
					  json: true,
					  filename: config.logs_dir + '/access-',
					  datePattern: 'yyyy-MM-dd.log'
					})
			      ]
			    }));
	    } else if (process.env.NODE_ENV === 'production') {
			app.use(expressWinston.errorLogger({
			      transports: [
			        new winston.transports.Console({
			          json: true,
			          colorize: true
			        }),
			        new winston.transports.DailyRotateFile({
					  json: true,
					  filename: config.logs_dir + '/access-',
					  datePattern: 'yyyy-MM-dd.log'
					})
			      ]
			    }));
	    }           
        
        app.use(express.static(path.join(__dirname, '../dist')));
				app.use(express.bodyParser());                          // pull information from html in POST
    		app.use(express.methodOverride());                      // simulate DELETE and PUT
        app.use(express.favicon());

        // Assume "not found" in the error msgs is a 404. this is somewhat
        // silly, but valid, you can do whatever you like, set properties,
        // use instanceof etc.
        app.use(function(err, req, res, next) {
            // Treat as 404
            if (~err.message.indexOf('not found')) return next();

            // Log it
            console.error(err.stack);

            // Error page
            res.status(500).render('500', {
                error: err.stack
            });
        });

        // Assume 404 since no middleware responded
        app.use(function(req, res, next) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });
        
		console.log('config.app_dir : ' + path.join(__dirname, '../app'));
		app.engine('.html', require('ejs').__express);
		app.set('views', path.join(__dirname, '../dist')); //config.app_dir
		app.set('view engine', 'ejs');
		
    });
};
