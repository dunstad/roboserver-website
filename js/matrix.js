function addMatrixEffect(canvasId, backgroundColor, textColor, spawnRate) {
	
	let canvas = document.getElementById(canvasId);
	
	let updateCanvasSize = ()=>{
		canvas.width  = document.documentElement.clientWidth;
		canvas.height = document.documentElement.clientHeight;
	};
	window.addEventListener('resize', updateCanvasSize);
	document.body.onload = updateCanvasSize;

	canvas.style.backgroundColor = backgroundColor;
	
	let world = [];
	const alphabet = '1O1O ';
	
	// temporary
	world.push(createRandomChain(alphabet));
	let matrix = loop(canvas, world, alphabet, backgroundColor, textColor, spawnRate);
	
}

function createRandomChain(alphabet) {
	
	let dist = Math.floor(Math.random() * 6) + 8;
	return createChain(
		alphabet,
		dist,
		[Math.floor(Math.random() * document.documentElement.clientWidth), -30 * (dist * 2)],
		Math.floor(Math.random() * 20) + 10
	);
	
}

function createChain(alphabet, distance, position, len) {
	
	return {'dist': distance, 'pos': position, 'text': createTextArray(alphabet, len)};
	
}

function createTextArray(alphabet, len) {
	
	let text = [];
	for (let i = 0; i < len; i++) {
		
		text.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
		
	}
	return text;
	
}

function moveChain(alphabet, chain) {
	
	chain.text.shift(); // essentially moves chain up one
	chain.pos[1] += (chain.dist * 2) ; // move down one
	chain.text.push(alphabet[Math.floor(Math.random() * alphabet.length)]); // prevent length loss
	
}

function deleteChain(world, chain) {
	
	world.splice(world.indexOf(chain), 1);
	
}

function drawChain(canvas, chain, textColor) {

	let ctx = canvas.getContext('2d');
	ctx.align = 'center';
	
	let posX = chain.pos[0];
	let posY = chain.pos[1];
	
	for (let i = 0; i  < chain.text.length; i++) {
		
		// creates illusion of distance
		ctx.font = (chain.dist * 2) + "px 'Lucida Console' monospace";
		ctx.globalAlpha = (chain.dist - 4) / 10;
		
		ctx.fillStyle = textColor;
		ctx.fillText(chain.text[i], posX, posY)
		posY += (chain.dist * 2);
		
	}
	
}

function clear(canvas, backgroundColor) {

	let ctx = canvas.getContext('2d');
	ctx.align = 'center';
	
	// smaller numbers make chains fade in/out more.
	ctx.fillStyle = tinycolor(backgroundColor).setAlpha(.1);
	ctx.fillRect(0, 0, canvas.width, canvas.height);
				
}

function loop(canvas, world, alphabet, backgroundColor, textColor, spawnRate) {
	
	return setInterval(()=>{
		
		clear(canvas, backgroundColor);
		for (let i = 0; i < world.length; i++) {
			
			drawChain(canvas, world[i], textColor);
			moveChain(alphabet, world[i]);
			if (world[i].pos[1] > document.documentElement.clientHeight) {
				
				deleteChain(world, world[i]);
				i--;
				
			}
			
		}
		
		if (Math.random() < spawnRate) { // controls chain spawn rate
			
			world.push(createRandomChain(alphabet));
			
		}
		
	}, 100);
	
}