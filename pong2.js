//Initial variables.
var x
var minx
var maxx
var y
var x2
var y2
var canvas
var canvaswidth
var canvasheight
var rightdown
var leftdown
var xbar
var barheight
var barwidth
var id
var shield
var blocks
var rows
var columns
var blockwidth
var blockheight
var score

//Colors
var ballsize = 10;
var rowcolors = ["#ff0000", "#ffffff", "#FFA600", "#004dff", "#f2ff00", "#1aff00", "#fb00ff", "#553300", "#ff0000" ]
var paddlecolor = "#000000"
var ballcolor = "#000000"
var backcolor = "#00ddff"

//Starts a new game.  Initial function called.
function newgame() 
{
	//Re-declare canvas variables to draw out a new game.
	x = 250
	minx = 5
	maxx = 5
	y = 250
	x2 = 3.0
	y2 = -4
	canvas = document.getElementById("canvas").getContext("2d")
	canvaswidth = document.getElementById("canvas").width
	canvasheight = document.getElementById("canvas").height
	rightdown = false
	leftdown = false
	xbar = canvaswidth / 2
	barheight = 10
	barwidth = 150
	id = 0
	shield = 1
	rows = document.getElementById("rows").value
	columns = document.getElementById("columns").value
	blockheight = 15
	score = 0
	document.getElementById("score").value = score

	//Creates blocks.
	newgameblocks()
	blockwidth = (canvaswidth/columns) - 1

	//Determines how much space is to the left of the canvas to get minx.
	minx = document.getElementById("canvas").offsetLeft
	maxx = minx + canvaswidth
	id = setInterval(draw, document.getElementById("speed").value)
	return id
}

//Draws the blocks.
function block(a,b,c,d) 
{
	canvas.beginPath()
	canvas.rect(a, b, c, d)
	canvas.closePath()
	canvas.fill()
}

//Clears blocks.
function clear() 
{
	canvas.clearRect(0, 0, canvaswidth, canvasheight)
	block(0, 0, canvaswidth, canvasheight)
}

//Draws the ball
function ball(x, y, ballsize) 
{
	canvas.beginPath()
	canvas.arc(x, y, ballsize, 0, Math.PI*2, true)
	canvas.closePath()
	canvas.fill()
}

//Set the values to true when key is pressed.
function onrightdown(press) 
{
	//39 is the keycode for the right arrow.
	if (press.keyCode == 39) 
	{
		rightdown = true
	}
  	else 
	{
		//37 is the keycode for the left arrow.
		if (press.keyCode == 37) 
		{
			leftdown = true
		}
	}
}

//Set the values to false when a key is released.
function onleftdown(press) 
{
	if (press.keyCode == 39)
	{
		rightdown = false
	}
	else
	{
		if (press.keyCode == 37) 
		{			
			leftdown = false
		}
	}
}

//Move the bar when the mouse moves left and right.
function onMouseMove(move) 
{
	//pageX gives the mouse position and compares it to the canvas dimensions. The bar is then redrawn based on how much the mouse is moved and the canvas size.
	if (move.pageX > minx && move.pageX < maxx)
	{
		xbar = Math.max(move.pageX - minx - (barwidth / 2), 0)
		xbar = Math.min(canvaswidth - barwidth, xbar)
	}
}

//Uses arrays to create the blocks.
function newgameblocks() 
{
	blocks = new Array(rows)

	for (i=0; i < rows; i++) 
	{
		blocks[i] = new Array(columns)

		for (j=0; j < columns; j++) 
		{
			blocks[i][j] = 1
		}
	}
}

//Draws the blocks from the array.
function drawblocks() 
{
	for (i=0; i < rows; i++) 
	{
		canvas.fillStyle = rowcolors[i]

		for (j=0; j < columns; j++) 
		{
			if (blocks[i][j] == 1) 
			{
				block((j * (blockwidth + shield)) + shield, (i * (blockheight + shield)) + shield, blockwidth, blockheight);
			}
		}
	}
}


//Main fuction that runs while the game is playing and is called repeatedly through a newgame.
function draw() 
{
	canvas.fillStyle = backcolor
	clear()
	canvas.fillStyle = ballcolor
	ball(x, y, ballsize)

	if (rightdown) 
	{
		xbar += 5
	}
	else 
	{
		if (leftdown) 
		{
			xbar -= 5
		}
	}
	canvas.fillStyle = paddlecolor
	block(xbar, canvasheight-barheight, barwidth, barheight)

	drawblocks()

	rowcanvasheight = blockheight + shield
	colcanvaswidth = blockwidth + shield
	row = Math.floor(y / rowcanvasheight)
	col = Math.floor(x / colcanvaswidth)

	//when you hit make the ball go opposite way and add to the score.
	if (y < rows * rowcanvasheight && row >= 0 && col >= 0 && blocks[row][col] == 1) 
	{
		score = score + 5
		document.getElementById("score").value = score
		y2 = -y2
		blocks[row][col] = 0
	}
 
	if (x + x2 + ballsize > canvaswidth || x + x2 - ballsize < 0)
	{
		x2 = -x2
	}
		
	if (y + y2 - ballsize < 0)
	{
		y2 = -y2
	}
  		
	else
	{
		if (y + y2 + ballsize > canvasheight - barheight) 
		{
			//the ball changes directions based on where it touches the bar.
			if (x > xbar && x < xbar + barwidth) 
			{
				x2 = 8 * ((x - (xbar + barwidth / 2)) / barwidth)
				y2 = -y2
			}
			else 
			{
				if (y + y2 + ballsize > canvasheight)
				{
					clearInterval(id)
  				}
 			}
		}
	}

  	x += x2
	y += y2
								
}
//Declare event handlers.
document.onrightdown = onrightdown
document.onleftdown = onleftdown
document.onmousemove = onMouseMove
