
//----------------------------
// World Object
//----------------------------
var grid = {
		x_tiles: 25,
		y_tiles: 10,
		size_tile: 25, //px
		is_wall: {}, // t_id: true/false. t_id => tile id. Types of tiles: walkable and wall
		getTileId: function (posX, posY){return "t_id_"+posX+"_"+posY;}
}

var w = { 
	grid: grid,
	player : {
		type: "player",
		t_id: grid.getTileId(0,0),
		t_id_default: grid.getTileId(0,0)
	},
	target : {
		type: "target",
		t_id: grid.getTileId((grid.x_tiles-1),(grid.y_tiles-1)),
		t_id_default:grid.getTileId((grid.x_tiles-1),(grid.y_tiles-1))
	},
	moving_object:{
		type: null //player, target, null
	},
	path_drawn: []
};

//----------------------------
// Initialize
//----------------------------

function initWorld(){
	var w_node = $('#world');
	
	initGrid(w_node);
	initMovableObject(w.player, w_node);
	initMovableObject(w.target, w_node);		
};

function initMovableObject(mobj, w_node){
	var mobj_tile= $("#"+mobj.t_id); //Tile to place movable object
	
	//Deactivate the tile
	mobj_tile.off('click'); 
	w.grid.is_wall[mobj.t_id] = true;
	
	//Create and locate movable object
	var mobj_node = $("<div/>",{
			"class": mobj.type,
			"id": mobj.type+"_"+mobj.t_id,
			"css" :{
				width: w.grid.size_tile,
				height: w.grid.size_tile,
				left: mobj_tile.css("left"),
				top: mobj_tile.css("top")
			},
			"click" :onToggleSelected
		});
	
	w_node.append(mobj_node);
};

function initGrid(w_node){
	//Set dimensions of World
	w_node.width(w.grid.x_tiles*w.grid.size_tile);
	w_node.height(w.grid.y_tiles*w.grid.size_tile);
	
	//Create and locate tiles
	for (var i =0; i<w.grid.x_tiles; i++){
		for (var j =0; j<w.grid.y_tiles; j++){
			
			//Create tile
			var t_id = w.grid.getTileId(i,j);
			var tile_node = $("<div/>",{
				"class": "walkable",
				"id": t_id,
				"css" :{
					width: w.grid.size_tile,
					height: w.grid.size_tile,
					left: i*(w.grid.size_tile),
					top: j*(w.grid.size_tile)
				},
				"click":onTile,
				"mousemove":onTileMove
			});
			w_node.append(tile_node); //Add tile to world
			
			//Update the Grid information
			w.grid.is_wall[t_id] = false;
		}
	}
};


//----------------------------
// Event Listeners
//----------------------------


function onToggleSelected(){
	//Remove any previous drawn path
	worldClearPath();
	
	//Selected Node
	var s_node = $( this ); 
	//Selected Object Type
	var s_type = s_node.attr("class"); 
	
	//If moving_object type is the same as selected object type ...
	if(s_type.includes(w.moving_object.type)){
		//Un-select moving_object
		w.moving_object.type = null;
		s_node.removeClass("selected");
	
	}else if(!w.moving_object.type){ //If there isn't a selected moving_object ...
		//Set the current selected object as the moving object
		w.moving_object.type = s_type;
		s_node.addClass("selected");
	}
	
}

function onTileMove(e){
	if(e.which == 1 && enableHandler){
		enableHandler=false;
        drawWall(this);
     }
}

timer = window.setInterval(function(){
    enableHandler = true;
}, 600);


function onTile(){
	if(enableHandler){
		enableHandler=false;
		drawWall(this);
	}
};

function drawWall(node){
	//Remove any previous drawn path
	worldClearPath();
	
	var ct_node = $( node ); //Clicked Tile node
	var ct_id = ct_node.attr("id"); //Clicked tile id
	
	//If there is a moving_object selected
	if(w.moving_object.type){
		//Move the selected moving_object
		moveObject(w.moving_object.type, ct_id);
		w.moving_object.type = null;
	}else{
		//Toggle between wall and walkable tile
		if(ct_node.attr('class')=="walkable"){
			ct_node.attr('class', 'wall');
			w.grid.is_wall[ct_id] = true;
		}else{
			ct_node.attr('class', 'walkable');
			w.grid.is_wall[ct_id] = false;
		}
	}
}


function moveObject(object_type, t_id_new){
	 var t_node_new = $( "#"+t_id_new );

	 //Check if object can be moved to the new tile position
		if(!w.grid.is_wall[t_id_new]){
			
			var mobj = {};
			//Moving_object data
			mobj.data = w[object_type];
			//Moving_object node 
			mobj.node = $("#"+mobj.data.type+"_"+mobj.data.t_id); 
			
			//Update position of moving_object node to new tile
			mobj.node.css({
				"left":t_node_new.css("left"),
				"top":t_node_new.css("top"),
			});
			//Update the moving_object id in node to reflect the new position
			mobj.node.attr('id', mobj.data.type+"_"+t_id_new);

			//Update style moving_object to reflect it is unselected
			mobj.node.removeClass("selected");
			
			//Activate tile where moving_object was
			var t_id_old = mobj.data.t_id; //Old tile id
			var ot_node = $("#"+t_id_old); //Old tile node
			ot_node.click(onTile);
			w.grid.is_wall[t_id_old] = false;

			//Deactivate new tile position - new tile
			t_node_new.off('click');
			w.grid.is_wall[t_id_new] = true;
			
			//Update world object
			mobj.data.t_id = t_id_new;
		}
	
}


//----------------------------
// Actions
//----------------------------

function resetWorld(){
		resetGrid(); //Must be the first thing to reset
		moveObject(w.player.type, w.player.t_id_default);
		moveObject(w.target.type, w.target.t_id_default);
		w.moving_object.type = null;
		worldClearPath();
};

function resetGrid(){
	for(var key in w.grid.is_wall){
		if (!w.grid.is_wall.hasOwnProperty(key)) continue;
		
		var t_node = $("#"+key);
		t_node.attr("class", "walkable");
		w.grid.is_wall[key] = false;
	}
};

function worldStartAlgorithm(algorithm, heuristic){
		//Remove any previous drawn path
		worldClearPath();
		
		var world = {};
		world.grid = {};
		var cleanerId = function (str){
			str = str.replace(/t_id_/g, '');
			str = str.replace(/_/g, ',');
			return str;
		}

		//Add is_wall information, but tile ids are now x,y format
		var str_is_wall = JSON.stringify(w.grid.is_wall);
		str_is_wall = cleanerId (str_is_wall);
		//str_is_wall = str_is_wall.replace(/t_id_/g, '');
		//str_is_wall = str_is_wall.replace(/_/g, ',');
		world.grid.is_wall = JSON.parse(str_is_wall);
		
		
		world.grid.x_tiles = w.grid.x_tiles; 
		world.grid.y_tiles = w.grid.y_tiles;
		world.start_tile = cleanerId(w.player.t_id);
		world.end_tile = cleanerId(w.target.t_id);
		
		world.grid.is_wall[world.start_tile] = false; 
		world.grid.is_wall[world.end_tile] = false;

			
		var response = modelStartAlgorithm(algorithm,heuristic, world);
		
		var animation  = response.animation;

		var i = 0;
		var id = setInterval(frame, 150);

		function frame() {
			
			if (i>=animation.length) {
				
				drawPath(response.path);
				
				clearInterval(id);
			} else {
				
				drawAnimation(animation[i].openSet, "openSet walkable");
				drawAnimation(animation[i].closedSet, "closedSet walkable");
				
				i++;
			}
		}
		
};


function drawPath(path){
	var path_t_id = [];
	for (var i = 0; i <path.length; i++){
			split = path[i].split(",");
			var t_id = w.grid.getTileId(split[0], split [1]);
			var node = $("#"+t_id);
			node.attr("class", "path walkable");
			path_t_id.push(t_id);
	}
	w.path_drawn = path_t_id;
}


function worldClearPath(){
	
	for(var t_id in w.grid.is_wall){
		var node = $("#"+t_id);
		
		if(t_id == w.player.t_id || t_id == w.target.t_id){
				node.attr("class","walkable");
		}else 	
		
		
		if(w.grid.is_wall[t_id]){
			node.attr("class","wall");
		}else{
			node.attr("class","walkable");
		}
	}
}

function drawAnimation(path, type){
	var path_t_id = [];
	for (var i = 0; i <path.length; i++){
			split = path[i].split(",");
			var t_id = w.grid.getTileId(split[0], split [1]);
			var node = $("#"+t_id);
			node.attr("class", type);
			path_t_id.push(t_id);
	}
	w.path_drawn = path_t_id;
}



