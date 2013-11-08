var key = {
	up: 38,
	down: 40,
	w: 87,
	s: 83,
}

function Paddle(x, y, ctx) {

	this.ctx = ctx;
	this.x = x;
	this.y = y;

	this.render = function() {
		this.ctx.fillStyle = "green";
		this.ctx.fillRect(this.x, this.y, 10, 40);
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
		
		leftBar.render();
		rightBar.render();	

		(function animloop(time){
			requestAnimationFrame(animloop);
			game.clearCanvas();
			leftBar.update(game.keys);
			leftBar.render();
			rightBar.render();	
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
