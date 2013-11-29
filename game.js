<<<<<<< HEAD
=======
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

>>>>>>> origin/gh-pages
var key = {
	up: 38,
	down: 40,
	w: 87,
	s: 83,
}
<<<<<<< HEAD

function Ball(x, y, ctx, game) {
=======
var hue = 120;

function Particle( x, y, particles ) {
	this.particles = particles;
	this.x = x;
	this.y = y;
	// track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 5;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	// set a random angle in all possible directions, in radians
	this.angle = getRandomInt( 0, Math.PI * 2 );
	this.speed = getRandomInt( 1, 10 );
	// friction will slow the particle down
	this.friction = 0.95;
	// gravity will be applied and pull the particle down
	this.gravity = 1;
	// set the hue to a random number +-20 of the overall hue variable
	this.hue = getRandomInt( hue - 20, hue + 20 );
	this.brightness = getRandomInt( 50, 80 );
	this.alpha = 1;
	// set how fast the particle fades out
	this.decay = getRandomInt( 0.015, 0.03 );

	this.render = function(ctx) {
		ctx.beginPath();
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
		ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
		ctx.lineTo( this.x, this.y );
		ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
		ctx.stroke();
	}.bind(this);

	this.update = function( index ) {
	// remove last item in coordinates array
		this.coordinates.pop();
	// add current coordinates to the start of the array
		this.coordinates.unshift( [ this.x, this.y ] );
	// slow down the particle
		this.speed *= this.friction;
	// apply velocity
		this.x += Math.cos( this.angle ) * this.speed;
		this.y += Math.sin( this.angle ) * this.speed + this.gravity;
	// fade out the particle
		this.alpha -= this.decay;
	
	// remove the particle once the alpha is low enough, based on the passed in index
		if( this.alpha <= this.decay ) {
			this.particles.splice( index, 1 );
		}
	}.bind(this);

}

function Ball(x, y, ctx, game) {
	this.startingX = x;
	this.startingY = y;
	this.startingSpeed = 5;
>>>>>>> origin/gh-pages
	this.x = x;
	this.y = y;
	this.vx = 1;
	this.vy = 1;
<<<<<<< HEAD
	this.ctx = ctx;
	this.game = game;

	this.render = function() {
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, 5,0,2*Math.PI);
		this.ctx.closePath();
		this.ctx.fill();
	}.bind(this);

	this.update = function() {
		this.x += this.vx;
		this.y += this.vy;	
=======
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
>>>>>>> origin/gh-pages

		if (this.x > this.game.width) {
			this.vx = -1;
		}

		if (this.y > this.game.height) {
			this.vy = -1;
		}

<<<<<<< HEAD
		if (this.x == 0) {
			this.vx = 1;
		}

		if (this.y == 0) {
=======
		if (this.x <= 0) {
			this.vx = 1;
		}

		if (this.y <= 0) {
>>>>>>> origin/gh-pages
			this.vy = 1;
		}

	}.bind(this);
}

<<<<<<< HEAD
function Paddle(x, y, ctx) {

	this.ctx = ctx;
	this.x = x;
	this.y = y;

	this.render = function() {
		this.ctx.fillStyle = "green";
		this.ctx.fillRect(this.x, this.y, 5, 40);
	}.bind(this);

	this.update = function(keys) {
		if (keys[key.up] || keys[key.w]) {
			this.y--;
		}

		if (keys[key.down] || keys[key.s]) {
			this.y++;
		}
	}.bind(this);

};

=======
function Paddle(x, y, ctx, aiControlled, game) {

	this.game = game;
	this.ctx = ctx;
	this.x = x;
	this.y = y;
	this.speed = 5;
	this.score = 0;
	this.aiControlled = aiControlled;
	this.height = 90;
	this.width = 8;

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



>>>>>>> origin/gh-pages
function Pong() {

	this.canvas = document.getElementById('gameCanvas');
	this.ctx = this.canvas.getContext('2d');
	this.keys = [];
	this.width = this.canvas.width;
	this.height = this.canvas.height;

	var game = this;

<<<<<<< HEAD
	this.start = function() {
=======
	this.particles = [];
	this.createParticles = function(x, y ) {
		
		var particleCount = 30;
		while( particleCount-- ) {
			game.particles.push( new Particle( x, y, game.particles) );
		}
	}

	this.start = function() {
		var background = new Audio("Hot_Heat.mp3"); // buffers automatically when created
		background.play();
>>>>>>> origin/gh-pages

		window.addEventListener("keydown", function (e) {
  			this.keys[e.keyCode] = true;
		}.bind(this));

		window.addEventListener("keyup", function (e) {
  			this.keys[e.keyCode] = false;
		}.bind(this));	
		
<<<<<<< HEAD
		var leftBar = new Paddle(10, 10, this.ctx)
		var rightBar = new Paddle(this.canvas.width - 20, 10, this.ctx);
=======
		var leftBar = new Paddle(30, 10, this.ctx, false, game)
		var rightBar = new Paddle(this.canvas.width - 50, 10, this.ctx, true, game);
>>>>>>> origin/gh-pages

		var ball = new Ball(game.width / 2, game.height / 2, this.ctx, game);
		

<<<<<<< HEAD

		(function animloop(time){
			requestAnimationFrame(animloop);
			game.clearCanvas();

			  game.ctx.fillRect(game.canvas.width/2, 0, 2, game.canvas.height);

			leftBar.update(game.keys);
			ball.update();	
			leftBar.render();
			rightBar.render();	
			ball.render();
=======
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
            			ball.reverse();
            			ball.x = rightBar.x - ball.width;
		                ball.y = Math.floor(ball.y - (ball.vy * ball.speed) + (ball.vy * ball.speed)*k);

		                game.createParticles(ball.x, ball.y)

		                var snd = new Audio("scifi002.wav"); // buffers automatically when created
						snd.play();

            		}
        		}
    		} else {
        		if (leftBar.x + leftBar.width >= ball.x) {
            		var collisionDiff = leftBar.x + leftBar.width / 2 - ball.x;
            		var k = collisionDiff/-(ball.vx * ball.speed);
            		var y = (ball.vy * ball.speed) * k + (ball.y - (ball.vy * ball.speed));
            		if (y >= leftBar.y && y + ball.height <= leftBar.y + leftBar.height) {
                		ball.reverse();
                		ball.x = leftBar.x + leftBar.width;
                		ball.y = Math.floor(ball.y - (ball.vy * ball.speed) + (ball.vy * ball.speed)*k);

                		game.createParticles(ball.x, ball.y);
                		   var snd = new Audio("scifi002.wav"); // buffers automatically when created
						snd.play();
            		}
        		}
    		}

			var i = game.particles.length;
			while( i-- ) {
				game.particles[i].render(game.ctx);
				game.particles[i].update(i);
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

>>>>>>> origin/gh-pages
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
