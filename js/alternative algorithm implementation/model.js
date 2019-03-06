var m = { 
	algorithm : {
		types: {
			a_star:{
				findPath: a_starPath
			},
			breadth_first:{
				findPath: breadth_firstPath
			},
			depth_first:{
				findPath: depth_firstPath
			},
			best_first:{
				findPath: best_firstPath
			},
			dijkstra:{
				findPath: dijkstraPath
			}
		}
	},
	
	heuristic: {
		types: {
			Manhattan:{
				getDistance: manhattanDistance
			},
			Euclidean:{
				getDistance: euclideanDistance
			},
			Octile:{
				getDistance: octileDistance
			},
			Chebyshev:{
				getDistance: chebyshevDistance
			}
		}
	},
	
	properties:{
		allows_diagonal: true,
		orthogonal_cost: 10, //Cost of an orthogonal step
		diagonal_cost: 10 * Math.sqrt(2) //Cost of a diagonal step. Math.sqrt(2) == diagonal in square dim 1
	}
};

function setAllowsDiagonalChange(value){
	m.properties.allows_diagonal = value;
}
	

function modelStartAlgorithm(algorithm, heuristic, world){	
	addNeighborsUtils(world);
	
	if(heuristic){
		return m.algorithm.types[algorithm].findPath(world, m.heuristic.types[heuristic].getDistance);
	}else{
		return m.algorithm.types[algorithm].findPath(world);
	}
	
};


function best_firstPath(world, getHDistance, properties){
	var tempCost_o = m.properties.orthogonal_cost;
	var tempCost_d = m.properties.diagonal_cost;
	m.properties.orthogonal_cost = 0;
	m.properties.diagonal_cost = 0;
	path = a_starPath(world, getHDistance, properties);
	m.properties.orthogonal_cost = tempCost_o;
	m.properties.diagonal_cost = tempCost_d;
	return path;
};
function dijkstraPath(world, properties){ 
	//Dijkstra is a special case of Astar when the h = 0
	var getHDistance = function (a,b){
		return 0;
	};
	
	return a_starPath(world, getHDistance, properties);
};

function depth_firstPath(w, properties){
		
	var closedSet = [];
	var openSet = [w.start_tile];
	var parentN = {};
	

	while(openSet.length>0){
		current = openSet.pop();
				
		if(current == w.end_tile){
			return reconstruct_path(parentN, current);
		}
		
		//Remove current from openSet
		var idxOpenSet = openSet.indexOf(current);
		if(idxOpenSet > -1){
			openSet.splice(idxOpenSet,1);
		}
		//Add to closedSet
		closedSet.push(current);
		
		//neighbors
		neighbors = w.neighbors.get(current);
		
		for (var i=0; i<neighbors.length; i ++){
			var n = neighbors[i];
			//if n in closedSet
			if(closedSet.indexOf(n)>-1){
				continue;
			}
			
			if(!(openSet.indexOf(n)>-1)){				
				openSet.push(n);
			}
			
			parentN[n] = current;			
		}
	}
	
	return [];	

};


function breadth_firstPath (w, properties){ 
		
	var closedSet = [];
	var openSet = [w.start_tile];
	var parentN = {};
	
	while(openSet.length>0){
		var current = openSet.shift();		
		if(current == w.end_tile){
			return reconstruct_path(parentN, current);
		}
		
		//Remove current from openSet
		var idxOpenSet = openSet.indexOf(current);
		if(idxOpenSet > -1){
			openSet.splice(idxOpenSet,1);
		}
		//Add to closedSet
		closedSet.push(current);
		
		//neighbors
		neighbors = w.neighbors.get(current);
		
		for (var i=0; i<neighbors.length; i ++){
			var n = neighbors[i];
			//if n in closedSet
			if(closedSet.indexOf(n)>-1){
				continue;
			}
			
			if(!(openSet.indexOf(n)>-1)){
				openSet.push(n);
			}
			
			parentN[n] = current;			
		}
	}
	
	return [];	
};










