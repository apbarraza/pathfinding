function addNeighborsUtils(world){
	world.neighbors = setNeighborsWorld (world.grid.x_tiles, world.grid.y_tiles, world.grid.is_wall);
	world.neighbors.get = function (x){
		if(m.properties.allows_diagonal){
			return world.neighbors[x]["all"];
		}else{
			return world.neighbors[x].orthogonal;
		}
	}
	world.neighbors.is_diagonal = function (a_tile, b_tile){
		//TODO - probably faster to check if one of the 4 possible diagonal?
		return (world.neighbors[a_tile].diagonal.indexOf(b_tile) > -1);	
	};
	
	world.neighbors.cost = function (a_tile, b_tile){
		if(m.properties.allows_diagonal & world.neighbors.is_diagonal(a_tile, b_tile)){
			return m.properties.diagonal_cost;
		}
		
		return m.properties.orthogonal_cost;
	};
}

function setNeighborsWorld(x_tiles, y_tiles, is_wall){
	var neighborsDict = {};

	for (var x = 0; x<x_tiles; x++){
		for (var y = 0; y<y_tiles; y++){
			
			var neighbors_all = [];
			var neighbors_orthogonal = [];
			var neighbors_diagonal = [];
						
				for(var  x_shift = -1; x_shift<=1; x_shift++){
					var x_n = x+x_shift; //x neighbor

					//Check if in boundary
					if(x_n<0 || x_n>=x_tiles){
						continue;
					}
					for(var y_shift = -1; y_shift<=1; y_shift++){
						var y_n = y + y_shift;//y neighbor
						
						//Check if within boundary
						if(y_n<0 || y_n>=y_tiles){
							continue;
						}
						
						//Check if not self
						if(x_n==x && y_n==y){
							continue;
						}
						
						//if neighbor is not wall add to neighbors
						if(!is_wall[x_n+","+y_n]){
							neighbors_all.push(x_n+","+y_n);
							if(x_n == x || y_n == y){
								neighbors_orthogonal.push(x_n+","+y_n);
							}else{
								neighbors_diagonal.push(x_n+","+y_n);
							}
						}
						
					}
				}
			
			neighborsDict[x+","+y] = {
				"all": neighbors_all,
				orthogonal: neighbors_orthogonal,
				diagonal: neighbors_diagonal
			};
		}
	}
	
	return neighborsDict;
	
}


function getPosition(str_id){
	var str_split = str_id.split(",");
	return {
		x:parseInt(str_split[0]),
		y:parseInt(str_split[1])
	}
}