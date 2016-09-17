import particles from './particle.js';

export default ()=> {
	var cx = 0;
	var cy = 0;
	var context = null;
	var stopped = false;
	var canvas = null;
	var bleatles = [];
	run();

	function run(){
    canvas = document.createElement('canvas');
    canvas.id = 'canvas'
    canvas.style.zIndex = 1;
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.width = window.innerWidth-100;
    canvas.height = window.innerHeight-100;
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.appendChild(canvas);

		context = canvas.getContext("2d");
		cx = canvas.width / 2;
		cy = canvas.height / 2;

    window.onresize = function(){
      canvas.width = window.innerWidth-100;
      canvas.height = window.innerHeight-100;
    }

    configure();
    main();
	}

	function configure(){
		erase();
		for (var i = 0; i < 5; i++) {
			var beatle = new Beatle();
			beatle.create(Math.random()*canvas.width, Math.random()*canvas.width, context);
			bleatles.push(beatle);
		};
	}

	function erase(){
		canvas.width = canvas.width;
	}

	function drawbleatles(){
		if(!stopped){
			for (var i = 0; i < bleatles.length; i++) {
				bleatles[i].draw();
			};
		}

	}

	function main(){
		erase();
		drawbleatles();

		if(!stopped){
			requestAnimationFrame(main);
		}
	}

	function getRandomState(){
    var states = ["stopped", "Beatleing", "walking"];
		return states[Math.round(Math.random()*(states.length-1))];
	}

	function Beatle(){
		this.particle = null;
		this.angle = 0;
		this.size = 0;
		this.context = null;
		this.widthFactor = 0;
		this.heightFactor = 0;
		this.state = getRandomState();
		this.counter = 0;
		this.setStateTime = 2000;
		this.lastStateTime = 0;
		this.wingPos = 1;
		this.wingTime = 0;
		this.angleOrientation = 0.05;
		this.setAngleTime = 1500;
		this.lastAngleTime = 0;
		this.legsUp = false;
		this.moveLegsTime = 0;
		var c = null;

		this.create = function(x, y, context){
			this.angle = Math.random()*Math.PI * 2;
			this.size = Math.random() * 20+10;
			this.heightFactor = this.size*1.1;
			this.widthFactor = this.size/4;
			c = context;
			this.particle = particles.create(x, y, 0, this.angle);
			this.lastStateTime = new Date().getTime();
			this.wingTime = new Date().getTime();
		}

		this.draw = function(){
			c.strokeStyle = "#555555";
			this.counter++;
			if(this.counter>1000){
				this.counter = 0;
			}

			c.save();
			c.translate(this.particle.x,this.particle.y);
			c.rotate(this.angle-(Math.PI*2/4*3));

			this.drawBody();
			this.drawHead();
			this.drawWings();
			this.drawLegs();

			c.moveTo(0,0);
			c.closePath();
			c.stroke();
			c.restore();

			if(new Date().getTime() - this.lastStateTime > this.setStateTime){
				this.lastStateTime = new Date().getTime();
				this.setStateTime = Math.random()*3000 + 2000;
				this.state = getRandomState();
			}

			if(this.particle.x > canvas.width+this.size || this.particle.x < -this.size
				|| this.particle.y > canvas.height+this.size || this.particle.y < -this.size){
				var dy = cy - this.particle.y;
				var dx = cx - this.particle.x;

				var newAngle = Math.atan2(dy,dx);
				this.angle = newAngle;

			}else{
				if(this.state == "Beatleing"){
					this.angle += this.angleOrientation;
				}

				if(this.state == "walking"){
					this.angle += this.angleOrientation*0.2;
				}
			}

			if(new Date().getTime() - this.lastAngleTime > this.setAngleTime){
				this.angleOrientation = -(this.angleOrientation);
				this.lastAngleTime = new Date().getTime();
				this.setAngleTime = Math.random()*2000+1000;
			}

		}

		this.drawBody = function(){

			var upPoint = {
				x:0,
				y:-this.heightFactor
			}

			var leftDownPoint = {
				x:-this.widthFactor-5,
				y:this.heightFactor
			}

			var rightDownPoint = {
				x:this.widthFactor+5,
				y:this.heightFactor
			}

			var rightPoint = {
				x: this.widthFactor,
				y: 0
			}

			var leftPoint = {
				x: -this.widthFactor,
				y: 0
			}

			c.beginPath();
			c.moveTo(-this.widthFactor, 0);
			c.quadraticCurveTo(upPoint.x, upPoint.y, rightPoint.x, rightPoint.y);
			c.moveTo(this.widthFactor, 0);
			c.lineTo(leftPoint.x, leftPoint.y);
			c.bezierCurveTo(leftDownPoint.x, leftDownPoint.y, rightDownPoint.x, rightDownPoint.y, rightPoint.x, rightPoint.y);

		}

		this.drawHead = function(){
			var headPoint = {
				x: 0,
				y:-(this.heightFactor - this.heightFactor/4)
			}

			c.moveTo(headPoint.x + (this.size/5), headPoint.y);
			c.arc(headPoint.x, headPoint.y,this.size/4,0,Math.PI*2,false);
		}

		this.drawWings = function(){

			var initLeftWing = {
				x:0,
				y:-this.heightFactor/6
			}

			var endLeftWing = {
				x:0,
				y:this.heightFactor
			}

			var initRightWing = {
				x:0,
				y:-this.heightFactor/6
			}

			var endRightWing = {
				x:0,
				y:this.heightFactor
			}

			var leftWingControlPoint = null;

			var rightWingControlPoint = null;

			if(this.state == "stopped" || this.state == "walking" || this.state == "cleaning"){

				leftWingControlPoint = {
					x:-(this.widthFactor*3),
					y:this.heightFactor
				}

				rightWingControlPoint = {
					x:this.widthFactor*3,
					y:this.heightFactor
				}

				c.moveTo(initLeftWing.x, initLeftWing.y);
				c.quadraticCurveTo(leftWingControlPoint.x, leftWingControlPoint.y, endLeftWing.x, endLeftWing.y);
				c.lineTo(initLeftWing.x,initLeftWing.y);

				c.moveTo(initRightWing.x, initRightWing.y);
				c.quadraticCurveTo(rightWingControlPoint.x, rightWingControlPoint.y, endRightWing.x, endRightWing.y);
				c.lineTo(initRightWing.x, initRightWing.y);

			}else if(this.state = "Beatleing"){

				this.particle.setSpeed(5);
				this.particle.setHeading(this.angle);
				this.particle.update();

				if(this.wingPos == 1){
					leftWingControlPoint = {
						x:-(this.widthFactor*9),
						y:-this.heightFactor
					}

					rightWingControlPoint = {
						x:this.widthFactor*9,
						y:-this.heightFactor
					}
				}else if(this.wingPos == 2){
					leftWingControlPoint = {
						x:-(this.widthFactor*9),
						y:0
					}

					rightWingControlPoint = {
						x:this.widthFactor*9,
						y:0
					}
				}else{
					leftWingControlPoint = {
						x:-(this.widthFactor*9),
						y:this.heightFactor
					}

					rightWingControlPoint = {
						x:this.widthFactor*9,
						y:this.heightFactor
					}
				}

				if(new Date().getTime() - this.wingTime > 15){
					this.wingPos++;
					this.wingTime = new Date().getTime();
				}

				c.moveTo(initLeftWing.x, initLeftWing.y);
				c.quadraticCurveTo(leftWingControlPoint.x, leftWingControlPoint.y, endLeftWing.x, endLeftWing.y-this.heightFactor/3);
				c.lineTo(endLeftWing.x,endLeftWing.y-this.heightFactor/3);

				c.moveTo(initRightWing.x, initRightWing.y);
				c.quadraticCurveTo(rightWingControlPoint.x, rightWingControlPoint.y, endRightWing.x, endRightWing.y-this.heightFactor/3);
				c.lineTo(endRightWing.x, endRightWing.y-this.heightFactor/3);

				if(this.wingPos >=4){
					this.wingPos = 1;
				}
			}else{
				console.log("unknown state: ",this.state);
			}

		}

		this.drawLegs = function(){
			if(this.state == "stopped" || this.state == "cleaning"){
				this.particle.setSpeed(0);
				var leg1 = {
					initX: -this.widthFactor,
					initY: 0,
					p1X: -this.widthFactor-(this.widthFactor/3),
					p1Y: -this.heightFactor/4,
					p2X: -this.widthFactor-(this.widthFactor*2),
					p2Y: 0
				}

				c.moveTo(leg1.initX, leg1.initY);
				c.lineTo(leg1.p1X, leg1.p1Y);
				c.lineTo(leg1.p2X, leg1.p2Y);

				c.moveTo(-(leg1.initX), leg1.initY);
				c.lineTo(-(leg1.p1X), leg1.p1Y);
				c.lineTo(-(leg1.p2X), leg1.p2Y);

				var leg2 = {
					initX: -this.widthFactor+2,
					initY: -this.heightFactor/4,
					p1X: -this.widthFactor-(this.widthFactor/4),
					p1Y: -this.heightFactor/2,
					p2X: -this.widthFactor-(this.widthFactor*2),
					p2Y: -this.heightFactor/5
				}

				c.moveTo(leg2.initX, leg2.initY);
				c.lineTo(leg2.p1X, leg2.p1Y);
				c.lineTo(leg2.p2X, leg2.p2Y);

				c.moveTo(-(leg2.initX), leg2.initY);
				c.lineTo(-(leg2.p1X), leg2.p1Y);
				c.lineTo(-(leg2.p2X), leg2.p2Y);

				var leg3 = {
					initX: -this.widthFactor,
					initY: this.heightFactor/4,
					p1X: -this.widthFactor-(this.widthFactor/2),
					p1Y: -this.heightFactor/20,
					p2X: -this.widthFactor-(this.widthFactor*2),
					p2Y: this.heightFactor/2
				}

				c.moveTo(leg3.initX, leg3.initY);
				c.lineTo(leg3.p1X, leg3.p1Y);
				c.lineTo(leg3.p2X, leg3.p2Y);

				c.moveTo(-(leg3.initX), leg3.initY);
				c.lineTo(-(leg3.p1X), leg3.p1Y);
				c.lineTo(-(leg3.p2X), leg3.p2Y);

			}else if(this.state == "Beatleing"){
				var leg1 = {
					initX: -this.widthFactor,
					initY: 0,
					p1X: -this.widthFactor-(this.widthFactor),
					p1Y: this.heightFactor,
				}

				c.moveTo(leg1.initX, leg1.initY);
				c.lineTo(leg1.p1X, leg1.p1Y);

				c.moveTo(-(leg1.initX), leg1.initY);
				c.lineTo(-(leg1.p1X), leg1.p1Y);

				var leg2 = {
					initX: -this.widthFactor,
					initY: this.heightFactor/2,
					p1X: -this.widthFactor-(this.widthFactor/2),
					p1Y: this.heightFactor*0.9
				}

				c.moveTo(leg2.initX, leg2.initY);
				c.lineTo(leg2.p1X, leg2.p1Y);

				c.moveTo(-(leg2.initX), leg2.initY);
				c.lineTo(-(leg2.p1X), leg2.p1Y);

			}else if(this.state == "walking"){
				this.particle.setSpeed(1);
				this.particle.setHeading(this.angle);
				this.particle.update();

				if(this.legsUp){
					var leg1 = {
						initX: -this.widthFactor,
						initY: 0,
						p1X: -this.widthFactor-(this.widthFactor/3),
						p1Y: -this.heightFactor/4,
						p2X: -this.widthFactor-(this.widthFactor*2),
						p2Y: 0
					}

					c.moveTo(leg1.initX, leg1.initY);
					c.lineTo(leg1.p1X, leg1.p1Y);
					c.lineTo(leg1.p2X, leg1.p2Y);

					c.moveTo(-(leg1.initX), leg1.initY);
					c.lineTo(-(leg1.p1X), leg1.p1Y);
					c.lineTo(-(leg1.p2X), leg1.p2Y);

					var leg2 = {
						initX: -this.widthFactor+2,
						initY: -this.heightFactor/4,
						p1X: -this.widthFactor-(this.widthFactor/4),
						p1Y: -this.heightFactor/2,
						p2X: -this.widthFactor-(this.widthFactor*2),
						p2Y: -this.heightFactor/5
					}

					c.moveTo(leg2.initX, leg2.initY);
					c.lineTo(leg2.p1X, leg2.p1Y);
					c.lineTo(leg2.p2X, leg2.p2Y);

					c.moveTo(-(leg2.initX), leg2.initY);
					c.lineTo(-(leg2.p1X), leg2.p1Y);
					c.lineTo(-(leg2.p2X), leg2.p2Y);

					var leg3 = {
						initX: -this.widthFactor,
						initY: this.heightFactor/4,
						p1X: -this.widthFactor-(this.widthFactor/2),
						p1Y: -this.heightFactor/20,
						p2X: -this.widthFactor-(this.widthFactor*2),
						p2Y: this.heightFactor/2
					}

					c.moveTo(leg3.initX, leg3.initY);
					c.lineTo(leg3.p1X, leg3.p1Y);
					c.lineTo(leg3.p2X, leg3.p2Y);

					c.moveTo(-(leg3.initX), leg3.initY);
					c.lineTo(-(leg3.p1X), leg3.p1Y);
					c.lineTo(-(leg3.p2X), leg3.p2Y);
				}else{
					var leg1 = {
							initX: -this.widthFactor,
							initY: 0,
							p1X: -this.widthFactor-(this.widthFactor/3),
							p1Y: (-this.heightFactor/4)+this.heightFactor/5,
							p2X: -this.widthFactor-(this.widthFactor*2),
							p2Y: this.heightFactor/5
						}

						c.moveTo(leg1.initX, leg1.initY);
						c.lineTo(leg1.p1X, leg1.p1Y);
						c.lineTo(leg1.p2X, leg1.p2Y);

						c.moveTo(-(leg1.initX), leg1.initY);
						c.lineTo(-(leg1.p1X), leg1.p1Y);
						c.lineTo(-(leg1.p2X), leg1.p2Y);

						var leg2 = {
							initX: -this.widthFactor+2,
							initY: -this.heightFactor/4,
							p1X: -this.widthFactor-(this.widthFactor/4),
							p1Y: (-this.heightFactor/2)+this.heightFactor/5,
							p2X: -this.widthFactor-(this.widthFactor*2),
							p2Y: (-this.heightFactor/5)+this.heightFactor/5
						}

						c.moveTo(leg2.initX, leg2.initY);
						c.lineTo(leg2.p1X, leg2.p1Y);
						c.lineTo(leg2.p2X, leg2.p2Y);

						c.moveTo(-(leg2.initX), leg2.initY);
						c.lineTo(-(leg2.p1X), leg2.p1Y);
						c.lineTo(-(leg2.p2X), leg2.p2Y);

						var leg3 = {
							initX: -this.widthFactor,
							initY: this.heightFactor/4,
							p1X: -this.widthFactor-(this.widthFactor/2),
							p1Y: (-this.heightFactor/20)+this.heightFactor/5,
							p2X: -this.widthFactor-(this.widthFactor*2),
							p2Y: (this.heightFactor/2)+this.heightFactor/5
						}

						c.moveTo(leg3.initX, leg3.initY);
						c.lineTo(leg3.p1X, leg3.p1Y);
						c.lineTo(leg3.p2X, leg3.p2Y);

						c.moveTo(-(leg3.initX), leg3.initY);
						c.lineTo(-(leg3.p1X), leg3.p1Y);
						c.lineTo(-(leg3.p2X), leg3.p2Y);
				}

				if(new Date().getTime() - this.moveLegsTime > 60){
					this.legsUp = !this.legsUp;
					this.moveLegsTime = new Date().getTime();
				}

			}
		}
	}
}
