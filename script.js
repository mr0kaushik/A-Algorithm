var cols = 50;
var rows = 50;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var w, h;
var start, end;
var path = [];
function Spot(i, j){
	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbors = [];
	this.prev = undefined;
	this.wall = false;

	if (random(1) < 0.3) {
		this.wall = true;
	}


	this.show = function(col) {

		if(this.wall){
			fill(0);
			noStroke(0);
			ellipse(this.i*w + w/2, this.j*h + h/2, w/2, h/2);
		}

	}

	this.addNeighbors = function(grid) {
		var col = this.i;
		var row = this.j;
		if(col < cols-1){
			this.neighbors.push(grid[col+1][row]);
		}
		if(col>0){
			this.neighbors.push(grid[col-1][row]);
		}
		if(row < rows-1){
			this.neighbors.push(grid[col][row+1]);
		}
		if(row>0){
			this.neighbors.push(grid[col][row-1]);
		}
		if(col > 0 && row> 0){
			this.neighbors.push(grid[col-1][row-1]);
		}
		if(col < cols-1 && row> 0){
			this.neighbors.push(grid[col+1][row-1]);
		}
		if(col > 0 && row < rows -1){
			this.neighbors.push(grid[col-1][row+1]);
		}
		if(col < cols-1 && row < rows-1){
			this.neighbors.push(grid[col+1][row+1]);
		}
	}
}

function removeFromArray(arr, element){
	for(var i=arr.length-1;i>=0;i--){
		if(arr[i]==element){
			arr.splice(i, 1);
		}
	}
}

function heuristic(a,b){
	var d = dist(a.i, a.j, b.i, b.j);
	return d;
}


function setup(){
	createCanvas(400, 400);
	w = width/cols;
	h = height/rows;
	console.log('A*');
	for (var i=0; i<cols;i++){
		grid[i] = new Array(rows);
	}

	for(var i=0;i<cols;i++){
		for(var j=0;j<rows;j++){
			grid[i][j] = new Spot(i, j);
		}
	}

	for(var i=0;i<cols;i++){
		for(var j=0;j<rows;j++){
			grid[i][j].addNeighbors(grid);
		}
	}

	start = grid[0][0];
	end = grid[cols-1][rows-1];
	openSet.push(start);
	start.wall = false;
	end.wall = false;
	console.log(grid);
}

function draw(){
	if(openSet.length > 0){
		var lowIndex = 0;
		for(var cell = 0 ; cell < openSet.length ; cell++){
			if(openSet[cell].f < openSet[lowIndex].f){
				lowIndex = cell;
			}
		}
		var current = openSet[lowIndex];
		if(current === end){

			console.log("Done");
			alert("DONE!!");
			noLoop();
		}
		//openSet.remove(cuurrent);
		removeFromArray(openSet, current);
		closedSet.push(current);

		var current_neighbors_array = current.neighbors;
		var len = current_neighbors_array.length;
		for(var i=0;i<len; i++){
			var neighbor = current_neighbors_array[i];
			if( !closedSet.includes(neighbor) && !neighbor.wall) {
				var newPath = false;
				var temp_g = current.g + 1;
				if(openSet.includes(neighbor)){
					if(temp_g < neighbor.g){
						neighbor.g = temp_g;
						newPath = true;
					}
				}
				else {
					neighbor.g = temp_g;
					openSet.push(neighbor);
					newPath = true;
					neighbor.prev = current;
				}
				if (newPath) {

					neighbor.h = heuristic(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.prev = current;

				}
			}
		}
	}else{

		console.log("NO SOLUTION!!");
		alert("NO SOLUTION!!");
		noLoop();
		return;
	}

	background(255);
	for(var i=0;i<cols;i++){
		for(var j=0;j<cols;j++){
			grid[i][j].show(color(255));
		}
	}

	for (var cell = 0;cell<closedSet.length;cell++) {
		closedSet[cell].show(color(255, 0, 0));
	}

	for (var cell = 0;cell<openSet.length;cell++) {
		openSet[cell].show(color(0,255 ,0));
	}
	path = [];
	var temp = current;
	path.push(temp);
	while(temp.prev) {
		path.push(temp.prev);
		temp = temp.prev;
	}

	noFill();
	stroke(0,255,0);
	strokeWeight(w/2);
	beginShape();
	for (var cell = 0;cell<path.length;cell++) {
		vertex(path[cell].i*w + w/2 , path[cell].j*h + h/2);
	}
	endShape();
}
