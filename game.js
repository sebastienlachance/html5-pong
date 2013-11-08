function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var key = {
	up: 38,
	down: 40,
	w: 87,
	s: 83,
}

function Ball(x, y, ctx, game) {
	this.startingX = x;
	this.startingY = y;
	this.startingSpeed = 4;
	this.x = x;
	this.y = y;
	this.vx = 1;
	this.vy = 1;
	this.speed = 4;
	this.ctx = ctx;
	this.game = game;

	this.reset = function() {
		this.x = this.startingX;
		this.y = this.startingY;

		this.vx = getRandomInt(1, 2) == 1 ? 1 : -1;
		this.vy = getRandomInt(1, 2) == 1 ? 1 : -1; 

		this.speed = this.startingSpeed;
		
	}.bind(this);

	this.reverse = function() {
		this.vx = -this.vx;
		this.vy = -this.vy;
		this.speed += 0.5;	
	}.bind(this);

	this.render = function() {
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, 5,0,2*Math.PI);
		this.ctx.closePath();
		this.ctx.fill();
	}.bind(this);

	this.update = function() {
		this.x += this.vx * this.speed;
		this.y += this.vy * this.speed;	

		if (this.x > this.game.width) {
			this.vx = -1;
		}

		if (this.y > this.game.height) {
			this.vy = -1;
		}

		if (this.x <= 0) {
			this.vx = 1;
		}

		if (this.y <= 0) {
			this.vy = 1;
		}

	}.bind(this);
}

function Paddle(x, y, ctx, aiControlled, game) {

	this.game = game;
	this.ctx = ctx;
	this.x = x;
	this.y = y;
	this.speed = 5;
	this.score = 0;
	this.aiControlled = aiControlled;
	this.height = 70;

	this.render = function() {
		this.ctx.fillStyle = "green";
		this.ctx.fillRect(this.x, this.y, 5, this.height);
	}.bind(this);

	if (this.aiControlled) {
		this.update = function(keys, ball) {
			if (ball.y >= this.y) {
				this.y+=this.speed;
			}

			if (ball.y <= this.y) {
				this.y-=this.speed;
			}
		}.bind(this);
	} else {
		this.update = function(keys, ball) {
			if (keys[key.up] || keys[key.w]) {
				if (this.y >= 0)
					this.y-= this.speed;
			}

			if (keys[key.down] || keys[key.s]) {
				if (this.y + this.height <= game.height)
				this.y+= this.speed;
			}
		}.bind(this);
	}

};

function Pong() {

	this.canvas = document.getElementById('gameCanvas');
	this.ctx = this.canvas.getContext('2d');
	this.keys = [];
	this.width = this.canvas.width;
	this.height = this.canvas.height;

	var game = this;

	this.start = function() {

		window.addEventListener("keydown", function (e) {
  			this.keys[e.keyCode] = true;
		}.bind(this));

		window.addEventListener("keyup", function (e) {
  			this.keys[e.keyCode] = false;
		}.bind(this));	
		
		var leftBar = new Paddle(10, 10, this.ctx, false, game)
		var rightBar = new Paddle(this.canvas.width - 20, 10, this.ctx, true, game);

		var ball = new Ball(game.width / 2, game.height / 2, this.ctx, game);
		


		(function animloop(time){
			requestAnimationFrame(animloop);
			game.clearCanvas();

			game.ctx.fillRect(game.canvas.width/2, 0, 2, game.canvas.height);

			leftBar.render();
			rightBar.render();	
			ball.render();

			leftBar.update(game.keys, ball);
			rightBar.update(game.keys, ball);

			if (leftBar.x <= ball.x - 5 && leftBar.x + 10 >= ball.x - 5) {
				if (leftBar.y <= ball.y + 5 && leftBar.y + 50 >= ball.y + 5) {
					ball.reverse();	
				}
			}

			if (rightBar.x <= ball.x + 5 && rightBar.x + 10 >= ball.x + 5) {
				if (rightBar.y <= ball.y + 5 && rightBar.y + 50 >= ball.y + 5) {
					ball.reverse();	
				}
			}

			ball.update();	

			if (ball.x <= 0) {
				rightBar.score++;
				ball.reset();
			}

			if (ball.x >= game.width) {
				leftBar.score++;
				ball.reset();
			}

			
			game.ctx.font='30px "Lucida Console", Monaco, monospace';
			var scoreX = (game.width / 2) - 30;
			if (leftBar.score > 9) {
				scoreX -= 10;
			}

			game.ctx.fillText(leftBar.score, scoreX, 40);
			game.ctx.fillText(rightBar.score, (game.width / 2) + 15, 40);

		})();
		
	};

	this.clearCanvas = function() {
		this.ctx.save();

		// Use the identity matrix while clearing the canvas
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Restore the transform
		this.ctx.restore();
	}.bind(this)

};



var pong = new Pong();
pong.start();
