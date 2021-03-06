var pins = []; // array of objects
var pinsTagged = []
var d; // diameter of circles 
var r; 
var tag;
var value;
var socket; 

function setup() {	
  createCanvas(windowWidth, windowHeight);  
  //var pins = []; // array of objects
  d = 50; // diameter of circles 
  r = d/2; 
  tag = false;
  value = random(120);
 
  for(var i = 0; i < 10; i++) {
  	var speedX = random(-4, 4);
  	var speedY = random(-4, 4);
  	var randX = random(0, windowWidth);
	var randY = random(0, windowHeight);
	var color = 'red';

	pins.push(new Pin(randX, randY, speedX, speedY, color)); 
  }	

  socket = io.connect('http://138.197.215.239:8080');

}

function draw() {	
	background(255); 

	for(var i = 0; i < pins.length; i++) {
		pins[i].display();
		pins[i].move();
	} 

	for(var i = 0; i < pinsTagged.length; i++) {
		pinsTagged[i].display(); // displays the tagged ones
		pinsTagged[i].move(); // this changes to 0 once bubble gets tagged
	}	
}

/* function sendTags(message) {
	socket.emit('tags', message);
}

function updateTags(ballX, ballY, speedX, speedY, ballColor) {
	// updating info of tags that I am receiving
	// how can I update
	// I want ball being passed that have 0 speed
} 
*/ 

function windowResize() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {

	// if mouse is pressed, check if mouse is on bubble
	// if mouse is on ball change color of that bubble

	//tagged stops the ball from moving when it's clicked
	for(var i = 0; i < pins.length; i++) {
  		pins[i].tagged(); // once mouse is clicked, I want to trigger something in every object
  		//send x and y position of that ball to the server
  		
  		// console.log('tagged x:' + pins[i].x + ', y: ' + pins[i].y);
  	}

 //  	console.log('Sending: ' + mouseX + ',' + mouseY);	

 //  	var data = {
	// 		x: mouseX,
	// 		y: mouseY
	// }

	// socket.emit('mouse', data);
}

function Pin(x, y, speedX, speedY, theColor) {
	this.x = x; // position of circle
	this.y = y; 
	this.speedX = speedX; // speed of circle
	this.speedY = speedY;
	this.color = theColor;

	this.display = function() {
		if(this.color != 'red') {
			fill(this.color);
		} else {
			fill('red');
		}

		noStroke();
		ellipse(this.x, this.y, d, d);
	}

	this.move = function() {

		// constructing barriers for ball 

		if (this.x < 0 || this.x > width) { 
			this.speedX *= -1; 
		} 

		if (this.y < 0 || this.y > height) {
			this.speedY *= -1; 
		}

		this.x = this.x + this.speedX; 
		this.y = this.y + this.speedY; 
	} 

	this.tagged = function() {
		
		var dis = dist(mouseX, mouseY, this.x, this.y);

		if (dis < 25) {
			//this.color = color(255, 0, 200);
			this.color = 'blue';
			this.speedX = 0; 
			this.speedY = 0; 

			// console.log('tagged x:' + this.x + ', y: ' + this.y);

			sendTags({
				'x': this.x,
				'y': this.y,
				'color': this.color		
			}); 

		} // end of if statement
  	
	} // end tagged method

}// end of pin object

function sendTags(message) {
	console.log("sending tags to the server");
	//this sends the tagged pin's x and y coordinates
	socket.emit('tagged', message);
} 

function drawTagged(theX, theY, theColor) { 
	// once our circle is tagged  we create a new object 
	// that gets stored in our new array 
	console.log("drawing tagged: " + theX + ", " + theY + ", " + theColor);
	pinsTagged.push(new Pin(theX, theY, 0,0, theColor));
}

