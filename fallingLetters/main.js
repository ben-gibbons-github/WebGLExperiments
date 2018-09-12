
var currentScreen = 0;

var chars = [];

function init() {

	var possible = "abcdefghijklmnopqrstuvwxyz0123456789";


	for (var i = 0; i < 500; i++)
	{

		var x = -100 + 200 * Math.random();
		var y = -100 + 200 * Math.random();
		var z =  100 * Math.random();
		var c = possible.charAt(Math.floor(Math.random() * possible.length));
		chars.push({ x : x, y: y, z: z, c: c })
	}
}

function update(deltaTime) {

	cameraX = 0;
	cameraY = 0;
	cameraZ = 100;

	for (var i = 0; i < chars.length; i++)
	{
		var c = chars[i];
		drawString(c.x, c.y, c.z, 20, 1, c.c);
		c.y -= 0.01 * deltaTime;
		if (c.y < -100)
			c.y = 100;
	}
}
