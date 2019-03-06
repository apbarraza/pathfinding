
//----------------------------
// Parameter Box Object
//----------------------------

var pb = { 
	algorithm : {
		types: {
			a_star:{
				id: "a_star",
				name: "A*",
				uses_heuristic: true
			},
			depth_first:{
				id: "depth_first",
				name:"Depth First Search",
				uses_heuristic: false
			},
			breadth_first:{
				id: "breadth_first",
				name:"Breadth First Search",
				uses_heuristic: false
			},
			best_first:{
				id: "best_first",
				name: "Best First Search",
				uses_heuristic: true
			},
			dijkstra:{
				id: "dijkstra",
				name: "Dijkstra",
				uses_heuristic: false
			}
		}
	},
	heuristic: {
		types: ["Manhattan","Euclidean", "Octile", "Chebyshev"],
		selected: "Manhattan"
	},
	buttons: {
		start: {
			name: "Start",
			click: onStart
		},
		"reset": { 
			name: "Reset",
			click: onReset
		},
		instructions:{
			name:"Instructions",
			click: onInstructions
		}
	},
	
	properties: {
		/*x_tiles: {
			name:"Width in Tiles:",
			value: 15,
			onChange: onWidthTilesChange
		},
		y_tiles: {
			name: "Height in Tiles:",
			value: 15,
			onChange: onHeightTilesChange
		},*/
		allows_diagonal:{
			name: "Allows Diagonal Movement:",
			value: true,
			onChange: onAllowsDiagonalChange
		}
	}
}
pb.algorithm["selected"]= pb.algorithm.types.a_star;


//------------------------------------------------------
// Initialize
//----------------------------


function initParameterBox(){
	setupAlgorithms();
	setupHeuristics();
	setupButtons();
	setupGeneralProperties();
}

//----------------------------
// Algorithms
//----------------------------

function setupAlgorithms(){
	var selector  = $('<select id ="select_algorithms"></select>');
	$.each(pb.algorithm.types, function (i, item) {
		selector.append($('<option>', { 
			value: i,
			text : item.name 
		}));
	});
	selector.change(function() {
		//Update parameter box
		pb.algorithm.selected = pb.algorithm.types[this.value];
		//Check if heuristics selector is to be displayed
		if(pb.algorithm.selected.uses_heuristic){
			$('#heuristics').show();
		}else{
			$('#heuristics').hide();
		}
	});
	$('#algorithms').append(selector);
};


//----------------------------
// Heuristics
//----------------------------

function setupHeuristics(){
	var selector  = $('<select id ="select_heuristics"></select>');
	$.each(pb.heuristic.types, function (i, item) {
		selector.append($('<option>', { 
			value: item,
			text : item 
		}));
	});
	selector.change(function(e) {
		//Update parameter box
		pb.heuristic.selected= this.value;
	});
	
	$('#heuristics').append(selector);
};


//----------------------------
// Buttons
//----------------------------

function setupButtons(){
	$.each(pb.buttons, function (i, item) {
		$('#buttons').append($('<button/>', { 
			text: item.name,
			id: 'btn_'+item.name,
			click: item.click 
		}));
	});
};

function onStart(){
	var algorithm = pb.algorithm.selected.id;
	var heuristic = (pb.algorithm.selected.uses_heuristic? pb.heuristic.selected: null);
	worldStartAlgorithm(algorithm, heuristic);
};

function onReset(){
	resetWorld();
};

function onInstructions(){
	var instructions = 
	"INSTRUCTIONS\n" + 
	"\n\nSTART AND END POSITIONS: The start indicator is represented by the circle and the end indicator by the square.\n"+
	"To move the start/end indicator click to select the item and then click towards the new destination position.\n"+
	"\n\nCREATING WALLS: Click on any tile and it will toggle between wall/walkable tile. You can \"paint\" walls by keeping the mouse pressed and moving towards the positions you want walls (tip: don't be too slow or fast)."+
	"\n\nPATH: The found path will be drawn in Yellow. The light green nodes are nodes that where explored. The dark green nodes are nodes that were set to be explored in a later iteration."+
	"\n\nNOTE: Please allow animation to finish before starting a new one or interacting with the world.";
	
	alert(instructions);
}

//----------------------------
// General Properties
//----------------------------
function setupGeneralProperties(){
	$.each(pb.properties, function (i, item) {
		var type = (typeof(item.value) === "boolean")?"checkbox":"text";
		
		var node = $('<div />');
		node.append("<p>"+item.name+"</p>");
		
		var nodeContent = $('<input/>', { 
				type: type,
				id: 'input_'+item.name,
				value: item.value,
			}); 
			
		if(type == "checkbox"){
			nodeContent.attr("checked", item.value);
		}else{
		}
		
		nodeContent.bind("change input", item.onChange);

		
		node.append(nodeContent);
		$('#general_properties').append(node);
	});
};
/*
function onWidthTilesChange(){
	console.log("test width change");
};
function onHeightTilesChange(){
	console.log("testHeight change");
};*/
function onAllowsDiagonalChange(){
	pb.properties.allows_diagonal.value = !pb.properties.allows_diagonal.value;
	setAllowsDiagonalChange(pb.properties.allows_diagonal.value);
};
