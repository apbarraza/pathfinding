function a_starPath(w, getHDistance, properties) { 
	var closedSet = [];
	var openSet = [w.start_tile];
	var parentN = {};
	
	var gScore = {};
	var gScore = (gScore == undefined)? Infinity: gScore; //Infinity as default value
	gScore[w.start_tile] = 0;
	
	var fScore = {};
	var fScore = (fScore == undefined)? Infinity: fScore; //Infinity as default value
	fScore[w.start_tile] = getHDistance(w.start_tile, w.end_tile);

	while(openSet.length>0){
		current = getLowestFScore(openSet, fScore);
				
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
			
			var tentative_gScore = gScore[current] + w.neighbors.cost(current, n);
			if(!(openSet.indexOf(n)>-1)){				
				openSet.push(n);
			}else if(tentative_gScore >= gScore[n]){
				continue;
			}
			
			parentN[n] = current;
            gScore[n] = tentative_gScore;
            fScore[n] = gScore[n] + getHDistance(n, w.end_tile);
			
		}
	}
	
	return [];
}


function getLowestFScore(openSet, fScore){
	var minValue = Infinity;
	var minNode = null;
	for (var key in openSet){
		if(fScore [openSet[key]]<minValue){
			minValue = fScore [openSet[key]];
			minNode = openSet[key];
		}
	}
		return minNode;	
}


function reconstruct_path(parentN, last){
	path = [last];
	while(last in parentN){
		last = parentN[last];
		path.push(last);
	}
	return path;
}
