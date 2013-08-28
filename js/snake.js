$(function(){

	// get window dimentions
	var winWidth = $(window).width();
	var winHeight = $(window).height();


	// Set page elements dimentions
	$('.gameContainer').width(winWidth * 0.85); // gamecontainer
	$('.gameContainer').height(winWidth * 0.85); // gamecontainer

	// set canvas dimentions
	if (winWidth >= winHeight) {
		var canvasWidth = winHeight * 0.85;
	}else {
		var canvasWidth = winWidth * 0.85;
	}
	

	$('#snakeGrid').attr('width', canvasWidth); // width
	$('#snakeGrid').attr('height', canvasWidth); // height


	// canvas context
	var canvas = document.getElementById('snakeGrid');
	var ctx = canvas.getContext('2d');

	// Set variables
	var cellWidth = canvasWidth / 30; // cell size
	var level = 1;                    // by Default. 1 slower; 10 faster
	var background = 'white';         // background color
	var border = ' black';            // border color
	var snakeColor = 'black';         // snake color
	var snake;                        // snake
	var d;                            // direction
	var food;                         // food
	var score;                        // Score
	
	/**
		init function
		start the game
	*/
	function init(){

		d = "right"; // default direction
		createSnake();
		createFood();
		score = 0; 
		level = 1;

		if(typeof gameLoop != "undefined"){
			clearInterval(gameLoop);
		}
		gameLoop = setInterval(paintSnake, (1000 / level));
	} // end init function

	init();

	/**
		createSnake function
		Create snake
	*/

	function createSnake(){

		var length = 5; // default size
		snake = [];

		for(var i = length -1; i >= 0; i--){
			snake.push({ x: i, y: 0 });
		}
	}

	/**
		createFood function
		create food
	*/

	function createFood(){
		food = {
			x: Math.round(Math.random() * (canvasWidth - cellWidth) / cellWidth),
			y: Math.round(Math.random() * (canvasWidth - cellWidth) / cellWidth)
		};
	}

	/**
		paintSnake function
		Drawing the snake
	*/
	function paintSnake(){

		ctx.fillStyle = background;
		ctx.fillRect(0, 0, canvasWidth, canvasWidth);
		ctx.strokeStyle = border;
		ctx.strokeRect(0,0, canvasWidth, canvasWidth);

		var nx = snake[0].x;
		var ny = snake[0].y;

		if(d == "right"){
			nx++;
		} else if( d == "left") {
			nx--;
		} else if( d == "up"){
			ny--;
		} else if( d == "down") {
			ny++;
		}

		// if lose
		if(nx == -1 || nx == Math.round(canvasWidth / cellWidth) || ny == -1 || ny == Math.round(canvasWidth / cellWidth) || collision(nx, ny, snake)){
			alert("You lose :(");
			init();
			return;
		}

		// if eat
		if(nx == food.x && ny == food.y) {
			var tail = {
				x: nx, 
				y: ny
			};

			score = 10 * level;

			if (score >= 10 * level){
				level++;
				clearInterval(gameLoop);
				gameLoop = setInterval(paintSnake, (1000 / level));
			}

			createFood();

		}else {
			var tail = snake.pop();

			tail.x = nx;
			tail.y = ny;
			
		}

		snake.unshift(tail);

		for(var i =0; i < snake.length; i++){
			
			var c = snake[i]

			paintCell(c.x, c.y);
		}

		paintCell(food.x, food.y);

		$('#score').text(score);
		$('#level').text(level)
	}

	/**
		paintCell function
		paint a cell

		param x: the x coordenate
		param y: the y coordanate
	*/
	function paintCell(x, y){
		ctx.fillStyle = snakeColor;
		ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
		ctx.strokeStyle = background;
		ctx.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	}

	/**
		collision function
		Check for collisions

		param x: x coordenate
		param y: y coordenate
		param array: array (snake)

		return: (boolean) true if collision
	*/
	function collision(x, y , array){
		
		for(var i = 0; i < array.length; i++){
			
			if(array[i].x == x && array[i].y == y){
				return true;
			}

			
		}
		return false;
	}	


	// capture the arrow key for move the snake
	$(document).on('keydown', function(e){

		var key = e.which;

		if (key == "37" && d != "right"){
			d = "left";
		} else if (key == "38" && d != "down") {
			d = "up";
		} else if (key == "39" && d != "left") {
			d = "right";
		} else if (key == "40" && d != "up"){
			d = "down";
		}
	});

	$('#l').on('click', function(){
		if(d != "right"){
			d = "left";
		}
	});
	$('#u').on('click', function(){
		if(d != "down"){
			d = "up";
		}
	});
	$('#r').on('click', function(){
		if(d != "left"){
			d = "right";
		}
	});
	$('#d').on('click', function(){
		if(d != "up"){
			d = "down";
		}
	});
});