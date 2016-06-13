var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/")
var RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
var RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#")
var OWL = $rdf.Namespace("http://www.w3.org/2002/07/owl#")
var DC = $rdf.Namespace("http://purl.org/dc/elements/1.1/")
var RSS = $rdf.Namespace("http://purl.org/rss/1.0/")
var XSD = $rdf.Namespace("http://www.w3.org/TR/2004/REC-xmlschema-2-20041028/#dt-")
var PROHOW = $rdf.Namespace("http://w3id.org/prohow#")

// APPLICATIONS
var load_editor = function(){
	app_editor();
	//load_application("editor.htm");
}
//var load_application = function(application){
//	$.getScript(application);
	//$("#main_span").load(application);
//}
//

// LOG FUNCTIONS
var log = function(text){
	logc(text,"log_default");
}
var logc = function(text,type){
	$("#debuglog").append("<tr class=\"logtable\"><td class=\"logtable\">"+(new Date().toISOString())+"</td><td class=\"logtable\, "+type+"\">"+text+"</td></tr>");
}
var print_dataset = function(){
	$("#rdf_dump").html();
	$rdf.fetcher = null;
	kb.fetcher = null;
	var q = $rdf.SPARQLToQuery("SELECT ?a ?b ?c WHERE { ?a ?b ?c . } ", false, kb);
	var result = kb.query(q, function(result,results) {
		var a = printResult(result['?a']);//.uri ? result['?a'].uri : result['?a'].toString();
		var b = printResult(result['?b']);
		var c = printResult(result['?c']);
        //results += " -->"+(result['?c']) ? result['?c'].value : '?';
		if(!((isOther(result['?a'])) || (isOther(result['?b'])) || (isOther(result['?c']))))
			print_rdf(a+" "+b+" "+c+" . ");
		else print_rdf("# Non standard triple: "+a+" "+b+" "+c+" . ");
    });
}
var print_rdf = function(text){
	$("#rdf_dump").append(text+"<br>");
}

var printResult = function(result){
	if(isBlank(result)) return escapeHtml(" _:"+result.id);
	if(isLiteral(result)) return escapeHtml("\"\"\""+result.value+"\"\"\"");
	if(isURI(result)) return escapeHtml("<"+result.uri+">");
	return "ERROR";
}

var isBlank = function(object){
	if((typeof object.id !== 'undefined') && (typeof object.value !== 'undefined')) return true;
	return false;
}
var isLiteral = function(object){
	if((typeof object.id == 'undefined') && (typeof object.value !== 'undefined')) return true;
	return false;
}
var isURI = function(object){
	if((typeof object.uri !== 'undefined')) return true;
	return false;
}
var isOther = function(object){
	if(isBlank(object) || isLiteral(object) || isURI(object)) return false;
	return true;
}
var escapeHtml =  function(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
var open_log = function(){
	$("#open_log_button").hide();
	$("#close_log_button").show();
	$("#log_div").show();
}
var open_rdf_dump = function(){
	$("#open_rdf_dump_button").hide();
	$("#close_rdf_dump_button").show();
	print_dataset();
	$("#rdf_dump_wrapper").show();
}
var close_log = function(){
	$("#open_log_button").show();
	$("#close_log_button").hide();
	$("#log_div").hide();
}
var close_rdf_dump = function(){
	$("#open_rdf_dump_button").show();
	$("#close_rdf_dump_button").hide();
	$("#rdf_dump").html();
	$("#rdf_dump_wrapper").hide();
}
//////

var initialise_jquery_ui = function(){
	$("input[type=button]").button();
	$(".hidden_at_start").hide();
}
$(function(){ 
// start on dom ready
if(typeof initp.printlog !== 'undefined' && initp.printlog){
	var pre="Initialize parameter \"";
	var post="\": ";
	for (var property in initp) {
		if (initp.hasOwnProperty(property) && typeof initp[property] !== 'undefined') {
			logc(pre+property+post+initp[property],"log_misc");
		}
	}
}
initialise_jquery_ui();
// DATA FETCHING

// tries to load the data directly. 
// If it fails, for example because of access control restrictions, and if a proxy url is specified, it will try loading the resource from 'proxy'+'url'
var fetch_data = function(url, fetcher,callback){
	// Turtle and RDF/XML parsing
	log("Fetching data from "+url+".");
	var success = false;
	try {
		fetcher.nowOrWhenFetched(url, function(ok, body, xhr) {
			if (!ok) {
				logc("Fetching data from "+url+" FAILED ("+xhr.status+").","log_error");
			} else {
				logc("Fetching data from "+url+" SUCCEEDED ("+xhr.status+").","log_success");
				if(typeof callback !== 'undefined') callback();
			}
		});
	}
	catch(err){
		logc("Fetching data from "+url+" FAILED.","log_error");
	}
	// RDFa parsing
	$.get( initp.proxy+url, {} )
		.done(function( data ) {
			
			$rdf.parse(data, kb, url, 'text/html');
	});
};
//////


//////////////////
var test = function(){
	//var res = kb.any(PROHOW('has_step'), RDFS('label'), undefined);
	//alert(res);
	$rdf.fetcher = null;
	kb.fetcher = null;
	var results = "";
	var q = $rdf.SPARQLToQuery("SELECT DISTINCT ?a ?b ?c WHERE { ?a ?b ?c . } LIMIT 5 ", false, kb);
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
			fetch_data(initp.seed_urls[i],fetch);
		}
	}
}



// MAIN CODE

kb = $rdf.graph();
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
fetch = $rdf.fetcher(kb,initp.timeout);
//$rdf.Fetcher.crossSiteProxy(initp.proxy);
load_seed_uris();

// end on dom ready
});