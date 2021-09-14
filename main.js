let cols, rows;
let size = 40;
let grid = [];
let current;
let stack = [];
let queue = [];
let bfs = false;
let q = [];
let backtrack = false;

function centerCanvas()
{
	let x = (windowWidth - width) / 2;
  	let y = (windowHeight - height) / 2;
  	cnv.position(x, y);
}


function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}

function setup()
{
	cnv = createCanvas(400,800);
	centerCanvas();
	cols = width/size;
	rows = height/size;
	frameRate(60);

	for (var y = 0; y < rows; y++)
	{
		for (var x = 0; x < cols; x++)
		{
			var cell = new Cell(x,y);
			grid.push(cell);
		}
	}

	current = grid[0];
}

function draw()
{
	background(1);
	
	for (var i = 0; i < grid.length; i++)
	{
		grid[i].show();
	}

	if (bfs == false)
	{
		current.setvisted(true);
		current.highlight();
		let next = current.checkNeighbor();
		if (next)
		{
			queue = [];
			next.setvisted(true);
			stack.push(current);
			removeWalls(current,next);
			current.stacked();
			current = next;
		}else if (stack.length > 0)
		{
			current = stack.pop();
			queue.push(current);
			for (var i = 0; i < queue.length; i++)
			{
				queue[i].highlights();
			}
		}
	}
	

	if (current == grid[0] && bfs == false)
	{
		bfs = true;
		current = grid[0];
		q.push(current);
	}

	if (bfs == true)
	{
		breadthfirstsearch(current, grid[getIndex(cols-1,rows-1)]);
	}
	
	if (backtrack == true)
	{
		if (current.previous)
		{
			current.trace = true;
			current = current.previous;
		}
		if (current == grid[0])
		{
			current.trace = true;
		}
	}
	
}

function getIndex(x,y)
{
	if (x < 0 || y < 0 || x > cols -1 || y > rows -1)
	{
		return -1;
	}
	return x + y * cols;
}

class Cell
{
	walls = [true, true, true ,true];
	x;
	y;
	visited = false;
	tracked = false;
	previous;
	trace = false;

	constructor(x,y)
	{
		this.x = x;
		this.y = y;
	}

	stacked()
	{
		var drawx = this.x*size;
		var drawy = this.y*size;

		noStroke();
		fill(255,0,0,100);
		rect(drawx,drawy,size,size);
	}

	show()
	{
		var drawx = this.x*size;
		var drawy = this.y*size;
		stroke(0);
	
		if (this.walls[0] == true)
		{
			// top
			line(drawx, drawy, drawx+size, drawy); 
		}
		if (this.walls[1] == true)
		{
			// right
			line(drawx+size, drawy, drawx+size, drawy+size);
		}
		if (this.walls[2] == true)
		{
			// bottom
			line(drawx, drawy+size, drawx+size, drawy+size);
		}
		if (this.walls[3] == true)
		{
			// left
			line(drawx, drawy, drawx, drawy+size);
		}
		
		if (this.visited == true)
		{
			noStroke();
			fill(128,128,128);
			rect(drawx,drawy,size,size);
		}

		if (this.tracked == true)
		{
			noStroke();
			fill(128,255,128);
			rect(drawx,drawy,size,size);
		}

		if (this.trace == true)
		{
			noStroke();
			fill(0,64,128);
			rect(drawx,drawy,size,size);
		}

	}

	setvisted(flag)
	{
		this.visited = flag;
	}

	checkWalls()
	{
		let neighbour = [];
		let top = grid[getIndex(this.x,this.y-1)];
		let right = grid[getIndex(this.x+1,this.y)];
		let bottom = grid[getIndex(this.x,this.y+1)];
		let left = grid[getIndex(this.x-1,this.y)];

		if (this.walls[0] == false && top.tracked == false) 
		{
			neighbour.push(top);
		}
		if (this.walls[1] == false && right.tracked == false) 
		{
			neighbour.push(right);
		}
		if (this.walls[2] == false && bottom.tracked == false)
		{
			neighbour.push(bottom);
		}
		if (this.walls[3] == false && left.tracked == false)
		{
			neighbour.push(left);
		}
		return neighbour;
	}


	checkNeighbor(boolean)
	{
		let neighbour = [];
		let top = grid[getIndex(this.x,this.y-1)];
		let right = grid[getIndex(this.x+1,this.y)];
		let bottom = grid[getIndex(this.x,this.y+1)];
		let left = grid[getIndex(this.x-1,this.y)];

		// checks if variables are undefined and unvisited
		if (top && !top.visited) 
		{
			neighbour.push(top);
		}
		if (right && !right.visited) 
		{
			neighbour.push(right);
		}
		if (bottom && !bottom.visited)
		{
			neighbour.push(bottom);
		}
		if (left && !left.visited)
		{
			neighbour.push(left);
		}

		
		// returns a random neighbour
		if (neighbour.length > 0)
		{
			let rand = floor(random(0,neighbour.length));
			return neighbour[rand];
		}else
		{
			return undefined;
		}

		
		
	}

	highlights()
	{
		var drawx = this.x*size;
		var drawy = this.y*size;

		noStroke();
		fill(0,0,0,100);
		rect(drawx,drawy,size,size);
	}


	highlight()
	{
		var drawx = this.x*size;
		var drawy = this.y*size;

		noStroke();
		fill(255,0,255,100);
		rect(drawx,drawy,size,size);
	}
}

function removeWalls(current, next)
{
	let dx = current.x - next.x;
	let dy = current.y - next.y;

	if (dx == -1)
	{
		current.walls[1] = false;
		next.walls[3] = false;
	}else if (dx == 1)
	{
		current.walls[3] = false;
		next.walls[1] = false;
	}

	if (dy == -1)
	{
		current.walls[2] = false;
		next.walls[0] = false;
	}else if (dy == 1)
	{
		current.walls[0] = false;
		next.walls[2] = false;
	}
}

function breadthfirstsearch(start, finish)
{
	if (q.length > 0)
	{
		current = q.shift();
		current.tracked = true;
		if (current == finish)
		{
			console.log(current);
			backtrack = true;
			q = [];
			return;
		}
		nextdoor = current.checkWalls();

		for (var i=0; i<nextdoor.length;i++)
		{
			if (nextdoor[i].tracked == false)
			{
				nextdoor[i].tracked = true;
				nextdoor[i].previous = current;
				q.push(nextdoor[i]);
			}
		}
		for (var j=0; j<q.length;j++)
		{
			q[j].highlights();
		}
	}
}