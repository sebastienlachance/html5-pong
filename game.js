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
	this.startingSpeed = 5;
	this.x = x;
	this.y = y;
	this.vx = 1;
	this.vy = 1;
	this.speed = this.startingSpeed;
	this.ctx = ctx;
	this.game = game;
	this.width = 15;
	this.height = 15;

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
		var gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.4, "white");
		gradient.addColorStop(0.4, "red");
		gradient.addColorStop(1, "black");
		

		this.ctx.fillStyle = gradient;
		this.ctx.arc(this.x, this.y, this.width, Math.PI*2, false);
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
	this.width = 5;

	this.render = function() {
		game.ctx.fillStyle = "rgb(0, 100, 100)";
		this.ctx.fillRect(this.x, this.y, this.width, this.height);
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
		

		var frame = 1;
		(function animloop(time){
			frame++;
			requestAnimationFrame(animloop);
			
			

			leftBar.update(game.keys, ball);
			rightBar.update(game.keys, ball);
			ball.update();	

			if (ball.vx > 0) {
			
        		if (rightBar.x <= ball.x + ball.width / 2 && rightBar.x > ball.x - (ball.vx * ball.speed) + ball.width / 2) {
        			
            		var collisionDiff = ball.x + ball.width / 2 - rightBar.x;
            		var k = collisionDiff/(ball.vx * ball.speed);
            		var y = (ball.vy * ball.speed )*k + (ball.y - (ball.vy* ball.speed));
            		if (y >= rightBar.y && y + ball.height <= rightBar.y + rightBar.height) {
                	// collides with right paddle
                		ball.reverse();
            		}
        		}
    		} else {
        		if (leftBar.x + leftBar.width >= ball.x) {
            		var collisionDiff = leftBar.x + leftBar.width / 2 - ball.x;
            		var k = collisionDiff/-(ball.vx * ball.speed);
            		var y = (ball.vy * ball.speed) * k + (ball.y - (ball.vy * ball.speed));
            		if (y >= leftBar.y && y + ball.height <= leftBar.y + leftBar.height) {
                		ball.reverse();
            		}
        		}
    		}

			

			if (ball.x <= 0) {
				rightBar.score++;
				ball.reset();
			}

			if (ball.x >= game.width) {
				leftBar.score++;
				ball.reset();
			}

			game.ctx.globalCompositeOperation = "source-over";
			//game.clearCanvas();
			game.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
			game.ctx.fillRect(0, 0, game.width, game.height);
			

			game.ctx.fillStyle = "rgb(0, 100, 100)";
			game.ctx.fillRect(game.canvas.width/2, 0, 2, game.canvas.height);
			
			leftBar.render();
			rightBar.render();	

			game.ctx.globalCompositeOperation = "lighter";
			ball.render();
			
			game.ctx.font='30px "Lucida Console", Monaco, monospace';
			var scoreX = (game.width / 2) - 30;
			if (leftBar.score > 9) {
				scoreX -= 10;
			}

			game.ctx.fillStyle = "rgb(0, 100, 100)";
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
