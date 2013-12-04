var   b2Vec2 = Box2D.Common.Math.b2Vec2
    ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,	b2Body = Box2D.Dynamics.b2Body
    ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,	b2Fixture = Box2D.Dynamics.b2Fixture
    ,	b2World = Box2D.Dynamics.b2World
    ,	b2MassData = Box2D.Collision.Shapes.b2MassData
    ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ,   b2WorldManifold = Box2D.Collision.b2WorldManifold
    ;


var SCALE = 30;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var key = {
	up: 38,
	down: 40,
	w: 87,
	s: 83
};

//Borrowed from TheCodePlayer
function Particle( x, y, particles ) {
	this.destroyed = false;
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
	this.hue = getRandomInt(100, 140);
	this.brightness = getRandomInt( 50, 80 );
	this.alpha = 1;
	// set how fast the particle fades out
	this.decay = getRandomInt( 0.015, 0.03 );

	Particle.prototype.render = function(context) {
		context.beginPath();
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
		context.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
		context.lineTo( this.x, this.y );
		context.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
		context.stroke();
	};

	Particle.prototype.update = function( index ) {
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
			this.destroyed = true;
			this.particles.splice( index, 1 );
		}
	};

}

function Ball(x, y, game) {
	this.startingX = x;
	this.startingY = y;
	this.startingSpeed = 5;
	this.x = x;
	this.y = y;
	this.vx = 1;
	this.vy = 1;
	this.speed = this.startingSpeed;
	this.game = game;
	this.width = 15;
	this.height = 15;

    var fixDef = new b2FixtureDef();
    fixDef.shape = new b2CircleShape();
    fixDef.shape.SetRadius(0.2);
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = this.x / SCALE;
    bodyDef.position.y = this.y / SCALE;
    bodyDef.userData = {
        id: 'ball',
        ent: this
    }

    this.definitions = {
        fixDef: fixDef,
        bodyDef: bodyDef
    };


    Ball.prototype.reset = function() {
		this.x = this.startingX;
		this.y = this.startingY;

        this.vx = getRandomInt(1, 2) == 1 ? 1 : -1;
		this.vy = getRandomInt(1, 2) == 1 ? 1 : -1; 

		this.speed = this.startingSpeed;
        this.body.SetPosition(new b2Vec2(this.x / 30, this.y / 30));
        this.body.SetLinearVelocity(new b2Vec2(this.vx * this.speed, this.vy * this.speed));


	};

	Ball.prototype.reverse = function() {
		this.vx = -this.vx;
		this.vy = (this.vy + getRandomInt(0,2) );
		this.speed += 0.5;	
	};

	Ball.prototype.render = function(context) {
        var position = this.body.GetPosition();
        x = position.x * SCALE;
        y = position.y * SCALE;

		context.globalCompositeOperation = "lighter";

		context.beginPath();
		var gradient = context.createRadialGradient(x, y, 0, x, y, this.width);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.4, "white");
		gradient.addColorStop(0.4, "red");
		gradient.addColorStop(1, "black");
		
		context.fillStyle = gradient;
		context.arc(x, y, this.width, Math.PI*2, false);
		context.fill();
	};

	Ball.prototype.update = function() {

        var position = this.body.GetPosition();

        x = position.x * SCALE;
        y = position.y * SCALE;

        this.x = x;
        this.y = y;

		var rightPaddle = this.game.rightPaddle;
		var leftPaddle = this.game.leftPaddle;
		var ball = this;	

		//collision detection
		if (ball.vx > 0) {
        	if (rightPaddle.x <= x + ball.width / 2 && rightPaddle.x > x - (ball.vx * ball.speed) + ball.width / 2) {
            	var collisionDiff = x + ball.width / 2 - rightPaddle.x;
            	var k = collisionDiff/(ball.vx * ball.speed);
            	var y = (ball.vy * ball.speed )*k + (y - (ball.vy* ball.speed));
            	if (y >= rightPaddle.y && y + ball.height <= rightPaddle.y + rightPaddle.height) {
            		ball.reverse();
            		x = rightPaddle.x - ball.width;
		            y = Math.floor(y - (ball.vy * ball.speed) + (ball.vy * ball.speed)*k);

		            game.particles.generate(x, y);
		            
		            if (this.game.audioEnabled) {
		            	var snd = new Audio("scifi002.wav"); // buffers automatically when created
						snd.play();
					}
            	}
        	}
    	} else {
        	if (leftPaddle.x + leftPaddle.width >= x) {
        		var collisionDiff = leftPaddle.x + leftPaddle.width / 2 - x;
        		var k = collisionDiff/-(ball.vx * ball.speed);
        		var y = (ball.vy * ball.speed) * k + (y - (ball.vy * ball.speed));
        		if (y >= leftPaddle.y && y + ball.height <= leftPaddle.y + leftPaddle.height) {
            		ball.reverse();
            		x = leftPaddle.x + leftPaddle.width;
            		y = Math.floor(y - (ball.vy * ball.speed) + (ball.vy * ball.speed)*k);

            		game.particles.generate(x, y);

            		if (this.game.audioEnabled) {
            			var snd = new Audio("scifi002.wav"); // buffers automatically when created
						snd.play();
					}
        		}
        	}
    	}

    	if (x <= 0) {
			rightPaddle.score++;
			ball.reset();
		}

		if (x >= game.width) {
			leftPaddle.score++;
			ball.reset();
		}

	};
}

function Paddle(x, y, aiControlled, game, ball, keys) {

	this.game = game;

	this.x = x;
	this.y = y;
	this.speed = 10;
	this.score = 0;
	this.aiControlled = aiControlled;
	this.height = 90;
	this.width = 8;
	this.ball = ball;
	this.keys = keys;

    var fixDef = new b2FixtureDef();
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(this.width / SCALE / 2, this.height / SCALE / 2);
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_kinematicBody;
    bodyDef.position.x = this.x / SCALE;
    bodyDef.position.y = this.y / SCALE;
    bodyDef.userData = {
        id: 'paddle',
        ent: this
    }

    fixDef.density = 1.0;
    fixDef.friction = 0;
    fixDef.restitution = 1.2;

    this.definitions = {
        fixDef: fixDef,
        bodyDef: bodyDef
    };

	Paddle.prototype.render = function(context) {
		context.fillStyle = "rgb(0, 100, 100)";
		context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
	};

	if (this.aiControlled) {
		this.update = function() {
			if (this.ball.y >= this.y && (this.y + (this.height / 2) <= game.height)) {
				this.y+=this.speed;
			}

			if (this.ball.y <= this.y && (this.y - (this.height / 2) >= 0)) {
				this.y-=this.speed;
			}

            this.body.SetPosition(new b2Vec2(this.x / SCALE, this.y / SCALE))

		}.bind(this);
	} else {
		this.update = function() {

			if (keys[key.up] || keys[key.w]) {
				if (this.y - (this.height / 2) >= 0)
					this.y-= this.speed;
			}

			if (keys[key.down] || keys[key.s]) {
				if (this.y + (this.height / 2) <= game.height)
				    this.y+= this.speed;
			}

            this.body.SetPosition(new b2Vec2(this.x / SCALE, this.y / SCALE));

		}.bind(this);
	}

};

function SeparationLine(canvas) {

	this.canvas = canvas;

	SeparationLine.prototype.render = function(context) {
		context.fillStyle = "rgb(0, 100, 100)";
		context.fillRect(this.canvas.width/2, 0, 2, this.canvas.height);
	};

	SeparationLine.prototype.update = function() {
		//Nothing to update
	}
}

function Score(game) {
	this.game = game;

	Score.prototype.render = function(context) {
		context.font='30px "Lucida Console", Monaco, monospace';
		var scoreX = (this.game.width / 2) - 30;
		if (this.game.leftPaddle.score > 9) {
			scoreX -= 10;
		}

		context.fillStyle = "rgb(0, 100, 100)";
		context.fillText(this.game.leftPaddle.score, scoreX, 40);
		context.fillText(this.game.rightPaddle.score, (this.game.width / 2) + 15, 40);
	};

	Score.prototype.update = function() {
		
	}
}

function Particles() {
	this.particles = [];

	Particles.prototype.generate = function(x, y) {
		var particleCount = 30;
		while( particleCount-- ) {
			this.particles.push(new Particle( x, y, this.particles));
		}
	};

	Particles.prototype.render = function(context) {
		var i = this.particles.length;
		while( i-- ) {
			this.particles[i].render(context);
		}
	};

	Particles.prototype.update = function() {
		var i = this.particles.length;

		while( i-- ) {
			var particle = this.particles[i];
			if (particle.destroyed) {
				this.particles.splice(i, 1);
			} else {
				this.particles[i].update(i);
			}	
		}
	};
}

function Game() {
    //Create the world
    this.world = new b2World(new b2Vec2(0, 0),  true);

    this.canvas = document.getElementById('gameCanvas');
	this.context = this.canvas.getContext('2d');
	this.keys = [];
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.entities = [];
	this.backgroundMusic = new Audio("Hot_Heat.mp3"); 
	this.audioEnabled = false;
    this.debug = false;








	Game.prototype.start = function() {
		if (this.audioEnabled) {
			this.backgroundMusic.play();	
		}
		
		var game = this;

		window.addEventListener("keydown", function (e) {
  			game.keys[e.keyCode] = true;
		});

		window.addEventListener("keyup", function (e) {
  			game.keys[e.keyCode] = false;
		});	

		this.ball = new Ball(this.width / 2, this.height / 2, game);
		this.leftPaddle = new Paddle(30, this.canvas.height / 2, false, game, this.ball, this.keys)
		this.rightPaddle = new Paddle(this.canvas.width - 50, this.canvas.height / 2, true, game, this.ball, this.keys);
		this.score = new Score(game);
		this.separation = new SeparationLine(this.canvas);
		this.particles = new Particles();

		this.entities.push(this.separation);
        game.addToWorld(this.leftPaddle);
        game.addToWorld(this.rightPaddle)
        game.addToWorld(this.ball);
		this.entities.push(this.particles);
		this.entities.push(this.score);

        //Create ceiling
        //Create floor
        this.addCeiling();
        this.addFloor();

        var b2Listener = Box2D.Dynamics.b2ContactListener;

        var listener = new b2Listener();
        listener.BeginContact = function(contact) {
            var entity1 = contact.GetFixtureA().GetBody().GetUserData().id;
            var entity2 = contact.GetFixtureB().GetBody().GetUserData().id;

            if (entity1 == "paddle" && entity2 == "ball") {
                var manifold = new b2WorldManifold();
                contact.GetWorldManifold(manifold);
                
               	//Bang!
               	var position = manifold.m_points[0];

                this.particles.generate(position.x * SCALE, position.y * SCALE);
            }

        }.bind(this);

        this.world.SetContactListener(listener);

        this.ball.reset();

        if (this.debug) {
            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(this.context);
            debugDraw.SetDrawScale(SCALE);
            debugDraw.SetFillAlpha(0.3);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            this.world.SetDebugDraw(debugDraw);
        }

		var frame = 1;
		(function animloop(time){
			frame++;
			requestAnimationFrame(animloop);
			
			game.update();
			game.render();
		})();
		
	};

    Game.prototype.addToWorld = function(entity) {
        var body = this.world.CreateBody(entity.definitions.bodyDef);
        body.CreateFixture(entity.definitions.fixDef)
        entity.body = body;

        this.entities.push(entity);
    };

	Game.prototype.clearCanvas = function() {
		this.context.save();
		this.context.setTransform(1, 0, 0, 1, 0, 0);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.restore();
	};

	Game.prototype.render = function() {
		//this.clearCanvas(); //using globeCompositionOperation
        if (this.debug) {
            this.world.DrawDebugData();
            return;
        }

		this.context.globalCompositeOperation = "source-over";
		this.context.fillStyle = "rgba(0, 0, 0, 0.3)";
		this.context.fillRect(0, 0, this.width, this.height);
		 for(var i = 0; i < this.entities.length; i++) {
		   this.entities[i].render(this.context);
		}
	};

	Game.prototype.update = function() {
        this.world.Step(1 / 60,  10,  10);
        this.world.ClearForces();

        for(var i = 0; i < this.entities.length; i++) {
			this.entities[i].update();
		}
	};

	Game.prototype.toggleAudio = function() {
		this.audioEnabled = !this.audioEnabled;
		if (this.audioEnabled) {
			this.backgroundMusic.play();
		} else {
			this.backgroundMusic.pause();	
		}
	};

    Game.prototype.addCeiling = function() {
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = this.width / 2 / SCALE;
        bodyDef.position.y = 0;
        bodyDef.userData = {
            id: 'ceilling',
            ent: this
        }


        var fixDef = new b2FixtureDef();
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE / 2,  0.01);

        fixDef.density = 1.0;
        fixDef.friction = 0;
        fixDef.restitution = 1;

        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    };

    Game.prototype.addFloor = function() {
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = this.width / 2 / SCALE;
        bodyDef.position.y = this.height / SCALE;
        bodyDef.userData = {
            id: 'floor',
            ent: this
        }

        var fixDef = new b2FixtureDef();
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox(this.width / SCALE / 2, 0.01);

        fixDef.density = 1.0;
        fixDef.friction = 0;
        fixDef.restitution = 1;

        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    };
};

var game = new Game();
game.start();

document.getElementById("soundOff").onclick = function(e) {
	var event = e || window.event;
	event.preventDefault();
	
	game.toggleAudio();
}