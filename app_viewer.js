
var app_viewer = function() {
		refresh_main_body(
'<div style="text-align:center;">'+
'<h3>Viewer</h3><p>Load instructions from a URI or URL:</p>'+
'<input type="text" id="viewer_search_input" name="viewer_search_input" class="largetextarea" placeholder="Enter URI / URL here" value="http://paolopareti.uk/dataset/simple/sample_instructions.htm" required></input><br>'+
'</br><input id="viewer_load_b" type="button" value="Search" onclick="search_and_display();" /></br>'+
'</div>'+
'<div id="main_instructions_found_area" class="hidden_at_start"><h4>Retrieved instructions:</h4><ol id="main_instructions_found_list"></ol></div>'+
'<span style="font-size: 20%;"><div id="loading">loading</div><div id="infobox">infobox </div></span>'+
'<span id="view_area"></span>'
	);
};

var json_root;

var getJsonByID = function(id){
	return getJsonByIDn(id,json_root);
}

var getJsonByIDn = function(id,node){
	if(node.id == id) return node;
	for (var i=0; i<node.children.length;i++) {
		var jsnfound = getJsonByIDn(id,node.children[i]);
		if(jsnfound && jsnfound.id == id) return jsnfound;
	}
	return null;
}

var populate_main_instructions_found_list = function(uri_list){
	if(uri_list.length>0){
		$("#main_instructions_found_area").show();
		$("#main_instructions_found_list").html("");
		for(var i = 0; i<uri_list.length; i++){
			var uri = uri_list[i].uri;
			var label = rdf_get_label_always(uri);
			$("#main_instructions_found_list").append('<li><input id="viewer_load_'+uri+'" type="button" class="link_button" value="'+label+'" onclick="choose_and_display(\''+uri+'\');" /></li>');
		}
	}
}

var choose_and_display = function(uri){
	display_uri(uri);
}

var search_and_display = function(){
	uri = $("#viewer_search_input").val();
	if(rdf_uri_exists(uri)) display_uri(uri);
	else {
		fetch_data(uri, fetch, function(){
			populate_main_instructions_found_list(select_distinct(kb.each(undefined, RDF("type"), PROHOW("instruction_set"))));
		});
	}
}
var incremental_id = 0;

var add_json_children = function(json_obj){
	json_obj.children = [];
	var methods = rdf_get_methods(json_obj.uri);
	for (var i=0; i<methods.length;i++) {
		json_obj.children.push(create_json_representation(methods[i],'method'));
	}
	var steps = rdf_get_steps(json_obj.uri);
	for (var i=0; i<steps.length;i++) {
		json_obj.children.push(create_json_representation(steps[i],'process'));
	}
	var requirements = rdf_get_requirements(json_obj.uri);
	for (var i=0; i<requirements.length;i++) {
		json_obj.children.push(create_json_representation(requirements[i],'requirement'));
	}
}

var create_json_representation= function(uri){
	return create_json_representation(uri,'process');
}
	
var create_json_representation= function(uri,type){
	incremental_id++;
	return {
			id:incremental_id+"_"+type,
			uri:uri,
			name:rdf_get_label_always(uri),
			annotation:type,
			image:'',
			dbpedia:'',
			children:[],
	};
}
	
var display_uri = function(uri){
	$("#view_area").html('<div id="graph" style="width:100%;height:100%;">'+ 
	'<div id="infovis" style="width:100%;height:100%;"></div>'+
	'</div>');
	json_root = create_json_representation(uri);
	add_json_children(json_root);
	start_visualisation();
};
		


function increase_brightness(hex, percent){
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}
function increase_darkness(hex, percent){
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}	
var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};

$jit.ST.Plot.NodeTypes.implement({
        'nodeline': {
          'render': function(node, canvas, animating) {
                if(animating === 'expand' || animating === 'contract') {
                  var pos = node.pos.getc(true), nconfig = this.node, data = node.data;
                  var width  = nconfig.width, height = nconfig.height;
                  var algnPos = this.getAlignedPos(pos, width, height);
                  var ctx = canvas.getCtx(), ort = this.config.orientation;
                  ctx.beginPath();
                  if(ort == 'left' || ort == 'right') {
                      ctx.moveTo(algnPos.x, algnPos.y + height / 2);
                      ctx.lineTo(algnPos.x + width, algnPos.y + height / 2);
                  } else {
                      ctx.moveTo(algnPos.x + width / 2, algnPos.y);
                      ctx.lineTo(algnPos.x + width / 2, algnPos.y + height);
                  }
                  ctx.stroke();
              } 
          }
        }
          
    });

var lastnode = "";
var expand_node = function(level,onComplete,st){
	return; //TODO !
	if(lastnode.length > 0){
		var nodeParam = getJsonByID(lastnode);
		if(nodeParam.children.length <= 0) {
			add_json_children(nodeParam);
			var lastnode_local = lastnode;
			lastnode = "";
			st.select(lastnode_local);
		}
	}			
}		
	
var start_visualisation = function(){
	document.getElementById('graph').style.height=(window.innerHeight-125)+'px';
	document.getElementById('graph').style.width=($(window).width())+'px';
		
		
	document.getElementById('infovis').style.height=(window.innerHeight-125)+'px';
	document.getElementById('infovis').style.width=($(window).width())+'px';

    //Implement a node rendering function called 'nodeline' that plots a straight line
    //when contracting or expanding a subtree.
    
	
	var label_width=400;
	var label_height=120;
	var loading=false;
	
	
    var st = new $jit.ST({
        injectInto: 'infovis',
        duration: 800,
        transition: $jit.Trans.Quart.easeInOut,
        levelDistance: 100,
        levelsToShow: 2,
        Navigation: {
			  enable:true,
			  panning:true
			},
        Node: {
				height: label_height,
				width: label_width,
				type: 'rectangle',
				color: '#aaa',
				overridable: true
			},
			
			Edge: {
				type: 'bezier',
				color: '#646464',
				lineWidth: 3,
				overridable: true
			},
        
        //Add a request method for requesting on-demand json trees. 
        //This method gets called when a node
        //is clicked and its subtree has a smaller depth
        //than the one specified by the levelsToShow parameter.
        //In that case a subtree is requested and is added to the dataset.
        //This method is asynchronous, so you can make an Ajax request for that
        //subtree and then handle it to the onComplete callback.
        //Here we just use a client-side tree generator (the getTree function).
        request: function(nodeId, level, onComplete) {
				lastnode = nodeId;
				if(loading==true) return;
				loading=true;
				document.getElementById("infobox").style.visibility='hidden';
				document.getElementById("loading").style.visibility='visible';
				var i=0;
				var nodeParam = getJsonByID(nodeId);
				fetch_data(nodeParam.uri, fetch,function(){onComplete.onComplete(nodeId, ans);});
				add_json_children(nodeParam);
				var node = st.graph.getNode(nodeId);
				
				var node_link=nodeParam.uri;
				node_link='<a href="'+node_link+'">'+node_link+'</a>';
				var dbpedia_link='<a href="'+nodeParam.dbpedia+'">'+nodeParam.dbpedia+'</a>';
				var text='<b><u>Info box</b></u></br></br>'
					+'URI: '+node_link+'</br></br>';
				if(nodeParam.dbpedia!=''&&nodeParam.dbpedia!='undefined') {
					text+='DBpedia: '+dbpedia_link;
				}
				
				document.getElementById("infobox").innerHTML=text;
				document.getElementById("loading").style.visibility='hidden';

						loading=false;
						try {
							var subtree = getJsonByID(nodeId);/*eval('(' + JSON.stringify(json_root).replace(/id:\"([a-zA-Z0-9]+)\"/g, 
							function(all, match) {
								return "id:\"" + match + "_" + i + "\""  
							}) + ')');*/
							$jit.json.prune(subtree, level); i++;
							var ans = {
								'id': nodeId,
								'children': subtree.children
							};
							onComplete.onComplete(nodeId, ans);
							
							document.getElementById("loading").style.visibility='hidden';
						}
						catch(err) {
							alert(err);
							alert(JSON.stringify(json_root));
						}
						lastnode = nodeId;
						setTimeout(function(){expand_node(level,onComplete,st);},5000);
			},
        
        onBeforeCompute: function(node){
        },
        
        onAfterCompute: function(){
        },
        
        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: function(label, node){
				label.id = node.id;
				label.annotation = node.annotation;
				//image search
				var font_size=20;
				if(node.name.length>100) 
					font_size=15;
				if(node.name.length>200) {
					font_size=15;
					node.name=node.name.substr(0,200)+"[...]";
				}
				if(typeof node.image === "undefined" || node.image=='') {
					label.innerHTML = "<div style=\"width:"+(label_width-20)+"px;height:"+(label_height-20)+"px;float:left;margin-top:10px;margin-left:10px;font-size:"+font_size+"px;\">"+node.name+"</div>";
				}
				else {
					label.innerHTML = "<div style=\"width:"+(label_width-label_height-20)+"px;height:"+(label_height-20)+"px;float:left;margin-top:10px;margin-left:10px;font-size:"+font_size+"px;\">"+node.name+"</div><div style=\"width:"+(label_height-20)+"px;height:"+(label_height-20)+"px;float:right;margin-top:10px;margin-right:10px;\"><img src=\""+node.image+"\" width=\""+(label_height-20)+"\" height=\""+(label_height-20)+"\"></div>";
				}
				label.onclick = function(){
				  st.onClick(node.id);
				};
				//set label styles
				var style = label.style;
				style.width = label_width + 'px';
				style.height = label_height + 'px';            
				style.cursor = 'pointer';
				style.color = 'white';
				style.fontSize = '12px';
				style.textAlign= 'left';
			},
        
        //This method is called right before plotting
        //a node. It's useful for changing an individual node
        //style properties before plotting it.
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        onBeforePlotNode: function(node){
				//add some color to the nodes in the path between the
				//root node and the selected node.
				var type = node.id.substring(node.id.indexOf("_")+1);
				switch(type) {
					default:
					case 'process': 
						node.data.$color = "#265e00"; break;
					case 'method': 
						node.data.$color = "#781b86"; break;
					case 'supplier': 
						node.data.$color = "#a31021"; break;
					case 'supplied': 
						node.data.$color = "#025e9f"; break;
					case 'supplied_extension':
						node.data.$color = "#025e9f"; break;
					case 'step':
					case 'step_process':
						node.data.$color = "#ed7d31"; break;
					case 'requirement': 
						node.data.$color = "#ed7d31"; break;
					case 'input': 
						node.data.$color = "#a9ce98"; break;
					case 'output': 
						node.data.$color = "#00cee1"; break;
				}  
				if (node.selected) {
					node.data.$color=increase_darkness(node.data.$color,35);
				}
			},
        
        //This method is called right before plotting
        //an edge. It's useful for changing an individual edge
        //style properties before plotting it.
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        onBeforePlotLine: function(adj){
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = "#eed";
                adj.data.$lineWidth = 4;
            }
            else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        }
    });
    
	//load json data
    st.loadJSON(eval(json_root));
    //compute node positions and layout
    st.compute();
    //emulate a click on the root node.
    st.onClick(st.root);
    //end
}