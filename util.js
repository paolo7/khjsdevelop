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
	return window.location+"?i="+uri_mint_count+"&c="+generate_unique_code(text);
}