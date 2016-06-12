$(function(){ 
// start on dom ready
var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/")
var RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
var RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#")
var OWL = $rdf.Namespace("http://www.w3.org/2002/07/owl#")
var DC = $rdf.Namespace("http://purl.org/dc/elements/1.1/")
var RSS = $rdf.Namespace("http://purl.org/rss/1.0/")
var XSD = $rdf.Namespace("http://www.w3.org/TR/2004/REC-xmlschema-2-20041028/#dt-")
var PROHOW = $rdf.Namespace("http://w3id.org/prohow#")

// LOG FUNCTIONS
var log = function(text){
	logc(text,"log_default");
}
var logc = function(text,type){
	$("#debuglog").append("<tr class=\"logtable\"><td class=\"logtable\">"+(new Date().toISOString())+"</td><td class=\"logtable\, "+type+"\">"+text+"</td></tr>");
}
if(typeof initp.printlog !== 'undefined' && initp.printlog){
	var pre="INITIAL PARAM ";
	var post=": ";
	for (var property in initp) {
		if (initp.hasOwnProperty(property) && typeof initp[property] !== 'undefined') {
			logc(pre+property+post+initp[property],"log_misc");
		}
	}
}
//////

// DATA FETCHING

// tries to load the data directly. 
// If it fails, for example because of access control restrictions, and if a proxy url is specified, it will try loading the resource from 'proxy'+'url'
var fetch_data = function(url, fetcher,callback){
	log("Fetching data from "+url+".");
	var success = false;
	try {
		fetcher.nowOrWhenFetched(url, function(ok, body, xhr) {
			if (!ok) {
				logc("Fetching data from "+url+" FAILED ("+xhr.status+").","log_error");
			} else {
				logc("Fetching data from "+url+" SUCCEEDED ("+xhr.status+").","log_success");
				callback();
			}
		});
	}
	catch(err){
		logc("Fetching data from "+url+" FAILED.","log_error");
	}

	
	
	//if(typeof initp.proxy !== 'undefined'){
	//	log("Fetching data from "+initp.proxy+url+".");
		//fetcher.nowOrWhenFetched(initp.proxy+url, undefined, function(ok, body, xhr) {
		//	logc("ok","log_success");
	//		logc("body","log_success");
	//		logc("xhr","log_success");
	//		try {
	//				if (!ok) {
		//				logc("Fetching data from "+url+" FAILED.","log_error");
		//				return false;
		//			} else {
		//				logc("Fetching data from "+url+" SUCCEEDED through proxy "+initp.proxy+".","log_success");
		//				callback();
		//				return true;
		//			}
		//	}
		//	catch(err){
		//	logc("Fetching data from "+url+" FAILED.","log_error");
	//		}
	//	});
//} 
};
//////


//////////////////
var test = function(){
	//var res = kb.any(PROHOW('has_step'), RDFS('label'), undefined);
	//alert(res);
	$rdf.fetcher = null;
	kb.fetcher = null;
	var results = "";
	var q = $rdf.SPARQLToQuery("SELECT ?a ?b ?c WHERE { ?a ?b ?c . } LIMIT 5 ", false, kb);
	var result = kb.query(q, function(result,results) {
		results += "AAAAA"+ result['?b'].uri ? result['?b'].uri : result['?b'].toString();
        results += " -->"+(result['?c']) ? result['?c'].value : '?';
		log(results);
    });
	log(results);
}
///////////////

// INITIALISATION
var load_seed_uris = function(){
	if(typeof initp.seed_urls !== 'undefined'){
		logc("Loading seed data","log_misc");
		for (var i = 0; i < initp.seed_urls.length; i++) {
			fetch_data(initp.seed_urls[i],fetch,test);
		}
	}
}



// MAIN CODE

var kb = $rdf.graph();
if(typeof initp.proxy !== 'undefined') {
	if(initp.proxy.indexOf("{uri}") > 0) {
		$rdf.Fetcher.crossSiteProxyTemplate = initp.proxy;
		logc("Loaded proxy: "+initp.proxy,"log_success");
	}
	else {
		$rdf.Fetcher.crossSiteProxyTemplate = initp.proxy+"{uri}";
		logc("Proxy "+initp.proxy+" does not have the required URI placeholder \"{uri}\", please add it in the config/config.js file. It has now been interpreted as "+initp.proxy+"{uri}" ,"log_warning");
	}
}
var fetch = $rdf.fetcher(kb,initp.timeout);
//$rdf.Fetcher.crossSiteProxy(initp.proxy);
load_seed_uris();

// end on dom ready
});