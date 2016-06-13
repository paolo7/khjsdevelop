var display_parsed_instructions = function(){
	$("#rdfa_editor_display").show();
	$("#rdfa_editor_source").show();
	var parsed_instructions = parse_instructions();
	$("#rdfa_editor_display").html(parsed_instructions);
	$("#rdfa_editor_source_box").html(escapeHtml(parsed_instructions));
}
	
var parse_instructions = function(){
	var main_url = generate_unique_uri();
	var html_rdfa = '<span prefix="prohow: http://w3id.org/prohow# dbo: http://dbpedia.org/ontology/" typeof="prohow:task prohow:instruction_set" resource="'+main_url+'">\n<h3>';
	var title = $("#editor_instructions_title").val();
	if(title.length > 0){
		html_rdfa += "<span property=\"rdfs:label\">"+title+"</span>";
	} else {
		html_rdfa += "<span class=\"de_emph\">Instructions:</span>";
	}
	html_rdfa += "</h3>\n";
	var abstract_desc = "";
	var requirements = [];
	var steps = [];
	var methods = [];
	var lines = $('#editor_instructions_area').val().split('\n');
	var first_prop_found = false;
	for(var i = 0; i < lines.length;i++){
		var line = lines[i];
		var type = "o";
		var char_to_remove = 0;
		if(line.toLowerCase().indexOf("step") == 0) {
			char_to_remove = 4;
			type = "s";
		}
		if(line.toLowerCase().indexOf("requires") == 0) {
			char_to_remove = 8;
			type = "r";
		}
		if(line.toLowerCase().indexOf("method") == 0) {
			char_to_remove = 6;
			type = "m";
		}
		if(type != "o") first_prop_found = true;
		if(type == "o" && !first_prop_found) {
			abstract_desc += line+"\n";
		}
		var sanitised_line = sanitise_line(line.substring(char_to_remove));
		if(sanitised_line.length>0){
			if(type == "s") steps.push(sanitised_line);
			if(type == "r") requirements.push(sanitised_line);
			if(type == "m") methods.push(sanitised_line);
		}
	}
	
	if(abstract_desc.length > 0){
		html_rdfa += '<p property="dbo:abstract" class=\"dbo_abstract\">'+abstract_desc+'</p>\n';
		
	}
	if(requirements.length > 0){
		html_rdfa += "<span class=\"prohow_requirements\"><p>Requirements:<ul>\n";
		for (i = 0; i < requirements.length; i++) {
			html_rdfa += '<li property="prohow:requires" resource="'+main_url+'r'+i+'" typeof="prohow:task"><span property="rdfs:label">'+requirements[i]+'</span></li>\n';
		}
		html_rdfa += "</ul></p></span>\n";
	}
	if(steps.length > 0){
		html_rdfa += "<span class=\"prohow_steps\"><p>Steps:<ol>\n";
		for (i = 0; i < steps.length; i++) {
			html_rdfa += '<li property="prohow:has_step" resource="'+main_url+'s'+i+'" typeof="prohow:task">';
			if(i>0) html_rdfa += '<span property="prohow:requires" resource="'+main_url+'s'+(i-1)+'"></span>';
			html_rdfa += '<span property="rdfs:label">'+steps[i]+'</span></li>\n';
		}
		html_rdfa += "</ol></p></span>\n";
	}
	if(methods.length > 0){
		html_rdfa += "<span class=\"prohow_methods\"><p>Methods:<ul>\n";
		for (i = 0; i < methods.length; i++) {
			html_rdfa += '<li property="prohow:has_method" resource="'+main_url+'m'+i+'" typeof="prohow:task"><span property="rdfs:label">'+methods[i]+'</span></li>\n';
		}
		html_rdfa += "</ul></p></span>\n";
	}
	
	
	html_rdfa += "</span>";
	
	return html_rdfa;
}

var sanitise_line = function(line){
	line = line.trim();
	var index_first_colon = line.indexOf(":");
	if(index_first_colon == 0) return line.substring(1).trim();
	if(index_first_colon > 0) {
		if(/^\d+$/.test(line.substring(0,index_first_colon))) line = line.substring(index_first_colon+1);
	}
	return line.trim();
}

var app_editor = function(){
	$("#main_span").html(

'<div style="text-align:center;">'+
'<h3>Editor</h3><p>Write your instructions here:</p>'+
'<form id="editor_instructions_form" name="editor_instructions_form">'+
'<input type="text" id="editor_instructions_title" name="editor_instructions_title" class="largetextarea" placeholder="Title of your instructions..." value="Example instructions on how to do this" required></input><br>'+
'<textarea id="editor_instructions_area" name="editor_instructions_area" rows="15" cols="80" class="largetextarea" placeholder="Insert your instructions here..." required>'+
'These instructions will tell you how to do this and that\n'+
'Enjoy!\n\n'+

'Requires: 2.5 things\n'+
'Requires: The other thing\n\n'+

'Step 1: Do this\n'+
'Step 2: Do that\n'+
'Step 3: Finally do this\n\n'+

'Method: Alternatively do this whole thing altogether\n'+
'Method: Or do this instead'+

'</textarea>'+
'</form>'+
'</br><input id="editor_submit" type="button" value="Parse into RDF" onclick="display_parsed_instructions();" /></br>'+
'</div>'+
'<span id="rdfa_editor_display" class="hidden_at_start"></span>'+
'<span id="rdfa_editor_source" class="hidden_at_start"><pre id="rdfa_editor_source_box"></pre></span>'

	);
	initialise_jquery_ui();
}

