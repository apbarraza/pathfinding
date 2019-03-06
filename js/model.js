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










