'use strict';

angular.module('newsfeederApp')
.factory('MainService', function ($resource, config) {
	var factory = {}; 
	factory.R = {};
	try {

    	factory.R.get = function(param, callback) {
			var rslt = {};
			if(config.android) {
				var src = Android.getStoryList(JSON.stringify(param));
				rslt.rows = JSON.parse(src);
			} else {
				rslt.rows = [
				{'section':'World','subsection':'Europe','title':'In the days after Andreas Lubitz','abstract':'In the days after Andreas Lubitz flew himself and 149 others into the French Alps, investigations have exposed weaknesses by the airline industry in dealing with mental illness among pilots.','url':'http://www.nytimes.com/2015/04/19/world/europe/germanwings-plane-crash-andreas-lubitz-lufthansa-pilot-suicide.html','byline':'By NICHOLAS KULISH and NICOLA CLARK','item_type':'Article','updated_date':'2015-04-18T11:02:22-5:00','created_date':'2015-04-18T10:38:29-5:00','published_date':'2015-04-19T04:00:00-5:00','material_type_facet':'News','kicker':'','des_facet':['Aviation Accidents, Safety and Disasters','Mental Health and Disorders','Airlines and Airplanes','Regulation and Deregulation of Industry'],'org_facet':'Germanwings GmbH','per_facet':'Lubitz, Andreas','geo_facet':'',
				'multimedia': 'http://static01.nyt.com/images/2015/04/18/business/18econstage-web2/18econstage-web2-thumbStandard.jpg',
				'normal': 'http://static01.nyt.com/images/2015/04/20/us/20MILITARYjp01sub/20MILITARYjp01sub-articleInline.jpg'},
				
				{'section':'World','subsection':'Europe','title':'222','abstract':'desc2','url':'http://www.nytimes.com/2015/04/19/world/europe/germanwings-plane-crash-andreas-lubitz-lufthansa-pilot-suicide.html','byline':'By NICHOLAS KULISH and NICOLA CLARK','item_type':'Article','updated_date':'2015-04-18T11:02:22-5:00','created_date':'2015-04-18T10:38:29-5:00','published_date':'2015-04-19T04:00:00-5:00','material_type_facet':'News','kicker':'','des_facet':['Aviation Accidents, Safety and Disasters','Mental Health and Disorders','Airlines and Airplanes','Regulation and Deregulation of Industry'],'org_facet':'Germanwings GmbH','per_facet':'Lubitz, Andreas','geo_facet':'','multimedia':''},
				
				{'section':'World','subsection':'Europe','title':'333','abstract':'desc3','url':'http://www.nytimes.com/2015/04/19/world/europe/germanwings-plane-crash-andreas-lubitz-lufthansa-pilot-suicide.html','byline':'By NICHOLAS KULISH and NICOLA CLARK','item_type':'Article','updated_date':'2015-04-18T11:02:22-5:00','created_date':'2015-04-18T10:38:29-5:00','published_date':'2015-04-19T04:00:00-5:00','material_type_facet':'News','kicker':'','des_facet':['Aviation Accidents, Safety and Disasters','Mental Health and Disorders','Airlines and Airplanes','Regulation and Deregulation of Industry'],'org_facet':'Germanwings GmbH','per_facet':'Lubitz, Andreas','geo_facet':'',
				'multimedia': 'http://static01.nyt.com/images/2015/04/18/business/18econstage-web2/18econstage-web2-thumbStandard.jpg',
				'normal': 'http://static01.nyt.com/images/2015/04/20/us/20MILITARYjp01sub/20MILITARYjp01sub-articleInline.jpg'}
			    ]
			}
		
			for(var i=0;i<rslt.rows.length;i++) {
				if(!rslt.rows[i].multimedia) {
					rslt.rows[i].multimedia = 'images/ny.png';
				}
				var published_date = rslt.rows[i].published_date;
				published_date = published_date.substring(0, published_date.lastIndexOf('-'));
				rslt.rows[i].published_date = moment(published_date).format('YYYY-MM-DD');
			}
			callback(rslt);
		}
    	return factory;
	} catch (e) {
	  return null;
	}
});

