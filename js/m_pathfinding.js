//OpenSetDataStructure prototype
function OpenSetDataStructure (fScore){
	this.values = []; 
	this.add =  function (x){
		this.values.push(x);
	};
	this.remove =  function (idxOpenSet){
		this.values.splice(idxOpenSet,1);
	};
	this.size = function() {
		return this.values.length;
	};
	this.next = function (fScore){
		return this.values.pop();
	};
	this.indexOf =  function(value){
		return this.values.indexOf(value);
	}
};

function a_starPath(w, getHDistance) { 
	var openSet = new OpenSetDataStructure();
	openSet.next = function (fScore){
		return getLowestFScore(this.values, fScore);
	}	
	return findPath(w, getHDistance, 1,1,openSet);
}

function best_firstPath(w, getHDistance){
	var openSet = new OpenSetDataStructure();
	openSet.next = function (fScore){
		return getLowestFScore(this.values, fScore);
	}
	return findPath(w, getHDistance, 0,1,openSet);
};


function dijkstraPath(w){ 
	var openSet = new OpenSetDataStructure();
	openSet.next = function (fScore){
		return getLowestFScore(this.values, fScore);
	}
	return findPath(w, noDistance, 1,0,openSet);
};

function depth_firstPath(w){
	var openSet = new OpenSetDataStructure();
	openSet.next = function (fScore){
		return this.values.pop();
	}
	return findPath(w, noDistance, 0,0,openSet);
};


function breadth_firstPath (w){ 
	var openSet = new OpenSetDataStructure();
	openSet.next = function (fScore){
		return this.values.shift();
	}
	return findPath(w, noDistance, 0,0,openSet);
	
};


/**
w -> world
getH -> getHeuristicValue
openSet.next -> getNext value from openSet
**/
function findPath(w, getH, weightG, weightH, openSet) { 
	var closedSet = [];
	openSet.add(w.start_tile);
	
	var parentN = {};
	
	var gScore = {};
	var gScore = (gScore == undefined)? Infinity: gScore; //Infinity as default value
	gScore[w.start_tile] = 0;
	
	var fScore = {};
	var fScore = (fScore == undefined)? Infinity: fScore; //Infinity as default value
	fScore[w.start_tile] = getH(w.start_tile, w.end_tile);
	
	//For animation
	var animation = [];
	var iteration = 0;
	
	
	while(openSet.size()>0){
		current = openSet.next(fScore);
		
		//If target is found
		if(current == w.end_tile){
			return {
				path: reconstruct_path(parentN, current),
				animation:animation
			}
		}
		
		//Remove current from openSet
		var idxOpenSet = openSet.indexOf(current);
		if(idxOpenSet > -1){
			openSet.remove(idxOpenSet);
		}
		//Add to closedSet
		closedSet.push(current);
		

		//Get neighbors
		neighbors = w.neighbors.get(current);
		
		for (var i=0; i<neighbors.length; i ++){
			var n = neighbors[i];
			//if neighbor n in closedSet
			if(closedSet.indexOf(n)>-1){
				continue;
			}
			
			var tentative_gScore = gScore[current] + w.neighbors.cost(current, n);
			if(!(openSet.indexOf(n)>-1)){				
				openSet.add(n);
			}else if(tentative_gScore >= gScore[n]){
				continue;
			}
			
			parentN[n] = current;
            gScore[n] = tentative_gScore;
			
            fScore[n] = weightG*gScore[n] + weightH*getH(n, w.end_tile);
			
		}
		
		animation[iteration] = {
			closedSet: closedSet.slice(0),
			openSet: openSet.values.slice(0)
		};
		
		iteration++;
	}
	
	return {
		path:[],
		animation: animation
	};
}


//TODO: Should change to a min priority queue
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
