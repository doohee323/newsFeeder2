'use strict';

/**
* @function 		: control enable disable for object (buttons)
*/
var objControl = function () {
};

/**
* @function	: check for collection type
* @param 	: obj(Object)  	
* @return 	: true(collection yes) / false (collection no )
*/
objControl.prototype.isCollection = function ( obj ) {
	if ( gf_IsNull( obj.length ) ) {
		return false;
	} else {
		return true;
	}
}

/**
* @function : control object's enable property
* @param 	: obj(Object) or collection
*/
objControl.prototype.enableObj = function ( obj ) {
	if ( typeof(obj) == "string") {
		obj = document.getElementsByName(obj);
	}

	if ( this.isCollection( obj ) ) {
		for ( var j = 0; j < obj.length; j++ ) {
			obj[j].disabled = false;
		}
	} else {
		obj.disabled = false;
	}
}

/**
* @function : control object's disable property
* @param 	: obj(Object) or collection
*/
objControl.prototype.disableObj = function ( obj ) {
	if ( typeof(obj) == "string") {
		obj = document.getElementsByName(obj);
	}

	if ( this.isCollection( obj ) ) {
		for ( var j = 0; j < obj.length; j++ ) {
			obj[j].disabled = true;
		}
	}
	else {
		obj.disabled = true;
	}
}

/**
* @function : control object's enable property
* @param 	: obj(Object) or collection's name, can use multi objects with ','
*/
objControl.prototype.enable = function ( obj, enable ) {
	if ( $.type(obj) == "string" ) {
		if ( obj.indexOf(',') <= -1 ) {
			if ( enable ) {
				this.enableObj(document.getElementsByName(obj));
			}
			else {
				this.disableObj(document.getElementsByName(obj));
			}
		}
		else {
			var ob = obj.split(',');
			for (var i = 0; i < ob.length; i++ ) {
				var objNode = document.getElementsByName(ob[i]);
				if ( enable ) {
					this.enableObj(objNode);
				}
				else {
					this.disableObj(objNode);
				}
			}
		}
	}
};

var gf_Objs = new objControl();

/*----------------------------------------------------------------------------------
 * Date Prototype function
----------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------
 * @function 	: replace All
 *                ex ) var str = 'abcdeabccba';
 *                     var target = 'a';
 *                     var replaceStr = '*';
 *                     str = str.replaceAll('cd', replaceStr);
 *                     => str, "*bcde*bccb*"
 * @param 		: str required
 *                target required
 *                replaceStr required
 * @return		: replaced String.
----------------------------------------------------------------------------------*/
String.prototype.replaceAll = function(target, replaceStr) {
	var v_ret = null;
	var v_regExp = new RegExp(target, "g");
	v_ret = this.replace(v_regExp, replaceStr);
	return v_ret;
}

/*----------------------------------------------------------------------------------
 * Date Prototype function
----------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------
 * @function 	: ex ) var str = 'abcde';
 *                     str = str.simpleReplace('cd', 'xx');
 *                     => str, "abxxe"
 * @param 		: oldStr required
 *                newStr required
 * @return		: replaced String.
----------------------------------------------------------------------------------*/
String.prototype.simpleReplace = function(oldStr, newStr) {
	var rStr = oldStr;
	rStr = rStr.replace(/\\/g, "\\\\");
	rStr = rStr.replace(/\^/g, "\\^");
	rStr = rStr.replace(/\$/g, "\\$");
	rStr = rStr.replace(/\*/g, "\\*");
	rStr = rStr.replace(/\+/g, "\\+");
	rStr = rStr.replace(/\?/g, "\\?");
	rStr = rStr.replace(/\./g, "\\.");
	rStr = rStr.replace(/\(/g, "\\(");
	rStr = rStr.replace(/\)/g, "\\)");
	rStr = rStr.replace(/\|/g, "\\|");
	rStr = rStr.replace(/\,/g, "\\,");
	rStr = rStr.replace(/\{/g, "\\{");
	rStr = rStr.replace(/\}/g, "\\}");
	rStr = rStr.replace(/\[/g, "\\[");
	rStr = rStr.replace(/\]/g, "\\]");
	rStr = rStr.replace(/\-/g, "\\-");
	var re = new RegExp(rStr, "g");
	return this.replace(re, newStr);
}
/*----------------------------------------------------------------------------------
 * @function : ex ) var str = '  abede    '
 *                  str = str.trim();
 *                  => str, "abcde"
 * @return	: trimed String.
----------------------------------------------------------------------------------*/
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};

String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};

String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};

/*----------------------------------------------------------------------------------
 * @function: check whether string start with param
 * @param 	: str<String>
 * @return	: true or false
----------------------------------------------------------------------------------*/
String.prototype.startsWith = function(str) {
	return this.slice(0, str.length) == str;
};
/*----------------------------------------------------------------------------------
 * @function: check whether string end with param
 * @param 	: str<String>
 * @return	: true or false
----------------------------------------------------------------------------------*/
String.prototype.endsWith = function(str) {
	return this.slice(-str.length) == str;
};

var GLB_MONTH_IN_YEAR = ["January","February","March","April","May","June",
 			"July","August","September","October","November","December"]; // Names of months for drop-down and formatting
var GLB_SHORT_MONTH_IN_YEAR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; // For formatting
var GLB_DAY_IN_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // For formatting
var GLB_SHORT_DAY_IN_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // For formatting

/*----------------------------------------------------------------------------------
 * Date Prototype function
----------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------
 * @function  : var date = new Date();
 *         		var dateStr = date.format('DDMMYYYY');
 *         		cf. : Date construction
 *            		- dateObj = new Date()
 *            		- dateObj = new Date(dateVal)
 *            		- dateObj = new Date(year, month, date[, hours[, minutes[, seconds[,ms]]]])
 *         		2014/12/5 => dateStr : "05/12/2014"
 *         		default pattern is "DDMMYYYY"
 * @param : pattern optional string pattern. (default : DDMMYYYY)
 *     # syntex
 *       YYYY : hour in am/pm (1&tilde;12)
 *       MM   : month in year(number)
 *       MON  : month in year(text)  예) 'January'
 *       mon  : short month in year(text)  예) 'Jan'
 *       DD   : day in month
 *       DAY  : day in week  예) 'Sunday'
 *       day  : short day in week  예) 'Sun'
 *       hh   : hour in am/pm (1&tilde;12)
 *       HH   : hour in day (0&tilde;23)
 *       mm   : minute in hour
 *       ss   : second in minute
 *       SS   : millisecond in second
 *       a    : am/pm  예) 'AM'
 * @return 		: Date's String.
----------------------------------------------------------------------------------*/
Date.prototype.format = function(pattern) {
	var year = this.getFullYear();
	var month = this.getMonth() + 1;
	var day = this.getDate();
	var dayInWeek = this.getDay();
	var hour24 = this.getHours();
	var ampm = (hour24 < 12) ? "AM" : "PM";
	var hour12 = (hour24 > 12) ? (hour24 - 12) : hour24;
	var min = this.getMinutes();
	var sec = this.getSeconds();
	var YYYY = "" + year;
	var YY = YYYY.substr(2);
	var MM = (("" + month).length == 1) ? "0" + month : "" + month;
	var MON = GLB_MONTH_IN_YEAR[month - 1];
	var mon = GLB_SHORT_MONTH_IN_YEAR[month - 1];
	var DD = (("" + day).length == 1) ? "0" + day : "" + day;
	var DAY = GLB_DAY_IN_WEEK[dayInWeek];
	var day = GLB_SHORT_DAY_IN_WEEK[dayInWeek];
	var HH = (("" + hour24).length == 1) ? "0" + hour24 : "" + hour24;
	var hh = (("" + hour12).length == 1) ? "0" + hour12 : "" + hour12;
	var mm = (("" + min).length == 1) ? "0" + min : "" + min;
	var ss = (("" + sec).length == 1) ? "0" + sec : "" + sec;
	var SS = "" + this.getMilliseconds();
	var dateStr;
	var index = -1;
	if (typeof (pattern) == "undefined") {
		dateStr = "DDMMYYYY";
	} else {
		dateStr = pattern;
	}
	dateStr = dateStr.replace(/YYYY/g, YYYY);
	dateStr = dateStr.replace(/YY/g, YY);
	dateStr = dateStr.replace(/MM/g, MM);
	dateStr = dateStr.replace(/MON/g, MON);
	dateStr = dateStr.replace(/mon/g, mon);
	dateStr = dateStr.replace(/DD/g, DD);
	dateStr = dateStr.replace(/DAY/g, DAY);
	dateStr = dateStr.replace(/day/g, day);
	dateStr = dateStr.replace(/hh/g, hh);
	dateStr = dateStr.replace(/HH/g, HH);
	dateStr = dateStr.replace(/mm/g, mm);
	dateStr = dateStr.replace(/ss/g, ss);
	dateStr = dateStr.replace(/SS/g, SS);
	dateStr = dateStr.replace(/(\s+)a/g, "$1" + ampm);
	return dateStr;
};

/*----------------------------------------------------------------------------------
 * @function : ater certain days
 * 				var date = new Date();
 *              var oneDayAfter = date.after(0, 0, 1);
 * @param 	: years optional after years
 *                months optional after months
 *                dates optional after days
 *                hours optional after hours
 *                minutes optional after minutes
 *                seconds optional after seconds
 *                mss optional after miliseconds
 * @return	: after Date object
----------------------------------------------------------------------------------*/
Date.prototype.after = function(years, months, dates, hours, miniutes, seconds, mss) {
	if (years == null)
		years = 0;
	if (months == null)
		months = 0;
	if (dates == null)
		dates = 0;
	if (hours == null)
		hours = 0;
	if (miniutes == null)
		miniutes = 0;
	if (seconds == null)
		seconds = 0;
	if (mss == null)
		mss = 0;
	if (years != 0)
		this.addYear(years);
	if (months != 0)
		this.addMonth(months);
	if (dates != 0)
		this.addDate(dates);
	if (hours != 0)
		this.addHours(hours);
	if (miniutes != 0)
		this.addMinutes(miniutes);
	if (seconds != 0)
		this.addSeconds(seconds);
	if (mss != 0)
		this.addMilliseconds(mss);
	return this;
};

/*----------------------------------------------------------------------------------
 * @function : ater certain days
 * 				var date = new Date();
 *              var oneDayBefore = date.defore(0, 0, 1);
 * @param 	: years optional defore years
 *                months optional defore months
 *                dates optional defore days
 *                hours optional defore hours
 *                minutes optional defore minutes
 *                seconds optional defore seconds
 *                mss optional defore miliseconds
 * @return	: defore Date object
----------------------------------------------------------------------------------*/
Date.prototype.before = function(years, months, dates, hours, miniutes, seconds, mss) {
	if (years == null)
		years = 0;
	if (months == null)
		months = 0;
	if (dates == null)
		dates = 0;
	if (hours == null)
		hours = 0;
	if (miniutes == null)
		miniutes = 0;
	if (seconds == null)
		seconds = 0;
	if (mss == null)
		mss = 0;
	if (years != 0)
		this.addYear(years * -1);
	if (months != 0)
		this.addMonth(months * -1);
	if (dates != 0)
		this.addDate(dates * -1);
	if (hours != 0)
		this.addHours(hours * -1);
	if (miniutes != 0)
		this.addMinutes(miniutes * -1);
	if (seconds != 0)
		this.addSeconds(seconds * -1);
	if (mss != 0)
		this.addMilliseconds(mss * -1);
	return this;
};

Date.prototype.addYear = function(val) {
	  this.setFullYear(this.getFullYear() + val);
};

Date.prototype.addMonth = function(val) {
	  this.setMonth(this.getMonth() + val);
};

Date.prototype.addDate = function(val) {
	  this.setDate(this.getDate() + val);
};

Date.prototype.addHours = function(val) {
	  this.setHours(this.getHours() + val);
};

Date.prototype.addMinutes = function(val) {
	  this.setMinutes(this.getMinutes() + val);
};

Date.prototype.addSeconds = function(val) {
	  this.setSeconds(this.getSeconds() + val);
};

Date.prototype.addMilliseconds = function(val) {
	  this.setMilliseconds(this.getMilliseconds() + val);
};

/**
 * @function : period
 * @param 	: type : date type, toDate : compare date
*/
Date.prototype.period = function(type, toDate){
	if(typeof(type) != "string" ){
		toDate = type;
		type = "year";
	}
	
	var fromYear = this.getYear();
	var toYear = toDate.getYear();
	var fromMonth = this.getMonth() + 1;
	var toMonth = toDate.getMonth() + 1;
	var fromTime = this.getTime();
	var toTime = toDate.getTime();
	
	if(type == "year"){
		return toYear - fromYear;
	}else if(type == "month"){
		return ((toYear - fromYear)*12) + (toMonth - fromMonth);
	}else if(type == "date"){
		return Math.floor((toTime - fromTime)/1000/60/60/24);
	}else if(type == "hour"){
		return Math.floor((toTime - fromTime)/1000/60/60);
	}else if(type == "minute"){
		return Math.floor((toTime - fromTime)/1000/60);
	}else if(type == "second"){
		return Math.floor((toTime - fromTime)/1000);
	}
}

/**
 * @desc 		: convert time with time gap
 * @param 		: v_data : input date
 *				  v_gap : gap hour between base timezone and user's timezone
 * @return		: date 
**/
Date.prototype.getLocalDate = function(v_gap) {
 	if(v_gap < 0) {
 		v_gap = v_gap * -1;
		this.before(null, null, null, v_gap, null, null, null);
 	} else {
		this.after(null, null, null, v_gap, null, null, null);
 	}
	return this;
}

/**
* @function 	check out whether Array has element or not
*/
Array.prototype.contains = function(elem) {
   for (var i in this) {
       if (this[i] == elem) return true;
   }
   return false;
}

/**
* @function 	alert( "3".padstring("0", 3) ); //shows "003"
* 				alert( "hi".padstring(" ", 3) ); //shows " hi"
* 				alert( "hi".padstring(" ", 3, true) ); //shows "hi "
*/
String.prototype.padstring = function(pad_char, pad_length, pad_right) {
   var result = this;
   if( (typeof pad_char === 'string') && (pad_char.length === 1) && (pad_length > this.length) ) {
      var padding = new Array(pad_length - this.length + 1).join(pad_char); 
      result = (pad_right ? result + padding : padding + result);
   }
   return result;
}