function Pong() {

	var canvas = document.getElementById('gameCanvas');
	var ctx = canvas.getContext('2d');

	this.start = function() {
		console.log('started', ctx);
		ctx.fillStyle = "green";
		ctx.fillRect(10, 10, 10, 40);

		console.log(canvas.width);

		ctx.fillRect(canvas.width - 20, 10, 10, 40);
	};

};

var pong = new Pong();
pong.start();
