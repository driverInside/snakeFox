/*************************************************************************
 app.js
 SnakeFox
 V. 1.2
 	Hiram E. Pérez
 	@driverInside

 	Copyright (C) 2013  Hiram E. Pérez

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
  ************************************************************************/

$(function(){

	$('small').text("Snake v1.3 | @driverInside"); // :P
	
	// canvas dimentions
	var canvasWidth = 250;
	var canvasHeight = 250;

	// set canvas dimentions, only for this version the dimentions will be static
	$('canvas').attr('width', canvasWidth);
	$('canvas').attr('height', canvasHeight);

	// canvas context
	var canvas = document.getElementById('snakefox');
	var ctx = canvas.getContext('2d');

	// Set variables
	var cellWidth = canvasWidth / 25; // cell size
	var level = 1;                    // by Default. 1 slower; 10 faster
	var background = 'white';         // background color
	var border = '#E66000';           // border color
	var borderCell ="red";            // border Cell color
	var snakeColor = '#00539F';       // snake color (Firefox Blue)
	var snake;                        // snake
	var d;                            // direction
	var food;                         // food
	var foodColor ="#FF9500";         // food color
	var score;                        // Score

	var totalSize = 25 * 25; // canvas Size!!

	/**
		init function
		start the game
	*/
	function init(){

		$('small').text("Snake v1.3 | @driverInside"); // lol

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

		// set the canvas
		ctx.fillStyle = background;
		ctx.fillRect(0, 0, canvasWidth, canvasWidth);
		ctx.strokeStyle = border;
		ctx.strokeRect(0,0, canvasWidth, canvasWidth);

		// new cell
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
			
			if(snake.length >= Math.round(totalSize *0.70)){
				alert("You win!! :)");
				init();
				return;
			}

			score = score + (10 * level);

			switch(snake.length){
				case 6:
					level = 2;
					clearInterval(gameLoop);
					gameLoop = setInterval(paintSnake, (1000 / level));
					break;
				case 8:
					level = 3;
					clearInterval(gameLoop);
					gameLoop = setInterval(paintSnake, (1000 / level));
					break;
				case 11:
					level = 4;
					clearInterval(gameLoop);
					gameLoop = setInterval(paintSnake, (1000 / level));
					break;
				case 15:
					level = 5;
					clearInterval(gameLoop);
					gameLoop = setInterval(paintSnake, (1000 / level));
					break;
				case 25:
					level = 6;
					clearInterval(gameLoop);
					gameLoop = setInterval(paintSnake, (1000 / level));
					break;
				case 50:
					level = 7;
					clearInterval(gameLoop);
					gameLoop = setInterval(paintSnake, (1000 / level));
					break;
				case 100:
					level = 8;
					clearInterval(gameLoop);
					gameLoop = setInterval(paintSnake, (1000 / level));
					break;
				case 200:
					level = 9;
					clearInterval(gameLoop);
					gameLoop = setInterval(paintSnake, (1000 / level));
					break;
				case 400:
					level = 10;
					clearInterval(gameLoop);
					gameLoop = setInterval(paintSnake, (1000 / level));
					break;
			}
			/*
			if (score >= (10 * level)){
				level++;
				clearInterval(gameLoop);
				gameLoop = setInterval(paintSnake, (1000 / level));
			}*/

			createFood();

		}else {
			var tail = snake.pop();

			tail.x = nx;
			tail.y = ny;
			
		}

		snake.unshift(tail);

		// paint snake
		for(var i =0; i < snake.length; i++){
			
			var c = snake[i]

			paintCell(c.x, c.y, snakeColor);
		}
		

		// paint food
		paintCell(food.x, food.y, foodColor);

		// display score & level 
		$('#score').text(score);
		$('#level').text(level);
	}

	/**
		paintCell function
		paint a cell

		param x: object. the x coordenate
		param y: object. the y coordanate
		param color: string. the cell color
	*/
	function paintCell(x, y, color){
		
		ctx.fillStyle = color;
		ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
		if(color == foodColor){
			ctx.strokeStyle = borderCell;	
		}else {
			ctx.strokeStyle = background;
		}
		
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
	$('.l').on('click', function(){
		if(d != "right"){
			d = "left";
		}
	});
	$('.u').on('click', function(){
		if(d != "down"){
			d = "up";
		}
	});
	$('.r').on('click', function(){
		if(d != "left"){
			d = "right";
		}
	});
	$('.d').on('click', function(){
		if(d != "up"){
			d = "down";
		}
	});

	// Capture keyboard events
	// only for web
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


});
