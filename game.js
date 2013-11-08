var key = {
	up: 38,
	down: 40,
	w: 87,
	s: 83,
}

function Ball(x, y, ctx, game) {
	this.x = x;
	this.y = y;
	this.vx = 1;
	this.vy = 1;
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

		if (this.x > this.game.width) {
			this.vx = -1;
		}

		if (this.y > this.game.height) {
			this.vy = -1;
		}

		if (this.x == 0) {
			this.vx = 1;
		}

		if (this.y == 0) {
			this.vy = 1;
		}

	}.bind(this);
}

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
		
		var leftBar = new Paddle(10, 10, this.ctx)
		var rightBar = new Paddle(this.canvas.width - 20, 10, this.ctx);

		var ball = new Ball(game.width / 2, game.height / 2, this.ctx, game);
		


		(function animloop(time){
			requestAnimationFrame(animloop);
			game.clearCanvas();

			  game.ctx.fillRect(game.canvas.width/2, 0, 2, game.canvas.height);

			leftBar.update(game.keys);
			ball.update();	
			leftBar.render();
			rightBar.render();	
			ball.render();
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
