//Heuristic that always returns zero value
function noDistance (a,b){
		return 0;
};


function manhattanDistance(start_pos, end_pos){	
	var d = get_delta_x_y(start_pos, end_pos);
    return m.properties.orthogonal_cost * (d.dx + d.dy);
};


//REFERENCE: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
function octileDistance(start_pos, end_pos){
	var d = get_delta_x_y(start_pos, end_pos);
	var cost_o = m.properties.orthogonal_cost; // 1
	var cost_d = m.properties.diagonal_cost; // Math.sqrt(2)
    return cost_o * (d.dx + d.dy) + (cost_d - 2 * cost_o) * Math.min(d.dx, d.dy)
};

//REFERENCE: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
function chebyshevDistance(start_pos, end_pos){
	var d = get_delta_x_y(start_pos, end_pos);
	//Both diagonal and orthogonal costs equal
	var cost = m.properties.orthogonal_cost;
    //return cost * (d.dx + d.dy) + (cost - 2 * cost) * Math.min(d.dx, d.dy);
	return cost * Math.max(d.dx, d.dy);
};

function euclideanDistance(start_pos, end_pos){
	var d = get_delta_x_y(start_pos, end_pos);
    return m.properties.orthogonal_cost * Math.sqrt(d.dx * d.dx + d.dy * d.dy)
};


function get_delta_x_y(start_pos, end_pos){
	start_pos = getPosition(start_pos);
	end_pos = getPosition(end_pos);
	
	return {
		dx: Math.abs(start_pos.x - end_pos.x),
		dy: Math.abs(start_pos.y - end_pos.y)
	}
}
