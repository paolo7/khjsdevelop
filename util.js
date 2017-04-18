var uri_mint_count = 1 + Math.floor(Math.random() * 900);

var encode_url_fragment = function(text){
	if(typeof text !== "undefined" && text.length > 0)	return btoa(text).replace(/\W/g, '');
	else return "";
}
var generate_unique_code = function(text){
	return ""+new Date().getTime()+encode_url_fragment(text);
}
var generate_unique_uri = function(text){
	uri_mint_count++;
	return "#i="+uri_mint_count+"&c="+generate_unique_code(text);
}
var generate_unique_uri_static = function(text){
	uri_mint_count++;
	return window.location+"#i="+uri_mint_count+"&c="+generate_unique_code(text);
}

var rdf_uri_exists = function(uri){
	var triple = kb.any($rdf.sym(uri), undefined, undefined);
	if(typeof triple === "undefined") return false;
	return true;
}

var rdf_get_label_always = function(uri){
	var label = rdf_get_label(uri);
	if(typeof label === "undefined") label = "...";
	return label;
}
var rdf_get_label = function(uri){
	var label = kb.any($rdf.sym(uri), RDFS("label"));
	if(typeof label === "undefined") label = kb.any($rdf.sym(uri), $rdf.sym("rdfs:label"));
	return label;
}
var rdf_get_steps = function(uri){
	return rdf_get_prohow_rel(uri,"has_step");
}
var rdf_get_requirements = function(uri){
	return rdf_get_prohow_rel(uri,"requires");
}
var rdf_get_methods = function(uri){
	return rdf_get_prohow_rel(uri,"has_method");
}
	
var rdf_get_prohow_rel = function(uri,prohow_rel){
	var uri_list = [];
	var list = select_distinct(kb.each($rdf.sym(uri), PROHOW(prohow_rel)));
	for (var i=0; i<list.length;i++) {
		uri_list.push(list[i].uri);
	}
	return uri_list;
}

var select_distinct = function (list){
	if(list.length < 2) return list;
	var new_list = [];
	for(var i = 0; i<list.length; i++){
		var found = false;
		for(var j = 0; j<new_list.length; j++){
			if(JSON.stringify(list[i]) == JSON.stringify(new_list[j])){
				found = true;
				j = new_list.length;
			}
		}
		if(!found){
			new_list.push(list[i]);
		}
	}
	return new_list;
}

