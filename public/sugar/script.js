/* Prepare canvas */
const viewportWidth = window.innerWidth;
const container = document.querySelector('.container.container-canvas');
const bounds = container.getBoundingClientRect();
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
console.log('bounds: ', bounds)
const buttonTriangle = document.querySelector('.game__button-triangle');
const buttonCircle = document.querySelector('.game__button-circle');
const buttonStar = document.querySelector('.game__button-star');
const buttonUmbrella = document.querySelector('.game__button-umbrella');
const gameStart = document.querySelector('.game');
const score = document.querySelector('.score');
const restart = document.querySelector('.restart');

let mouseDown = false;
let startedTurn = false;
let brokeShape = false;
let prevX = null;
let prevY = null;
let pixelsShape = 0;

//musics
const bgMusic = new Audio('./music/bg.mp3')
bgMusic.loop = true

/* Set up the size and line styles of the canvas */
function setupCanvas() {
   canvas.height = 370;
   canvas.width = 370;
   canvas.style.width = `${canvas.width}px`;
   canvas.style.height = `${canvas.height}px`;
   ctx.lineWidth = 15;
   ctx.lineCap = 'round';

}

/* Triangle shape */
function drawTriangle() {
   bgMusic.play()
   gameStart.classList.add('hidden');
   ctx.strokeStyle = 'rgb(66, 10, 0)';
   ctx.beginPath();
   ctx.moveTo(185, 85);
   ctx.lineTo(285, 260);
   ctx.lineTo(85, 260);
   ctx.closePath();
   ctx.stroke();

   /* Get pixels of shape */
   pixelsShape = getPixelAmount(66, 10, 0);
}

/* Circle shape */
function drawCircle() {
   bgMusic.play()
   gameStart.classList.add('hidden');
   ctx.strokeStyle = 'rgb(66, 10, 0)';
   ctx.beginPath();
   ctx.arc(185, 185, 100, 0 * Math.PI, 2 * Math.PI);
   ctx.closePath();
   ctx.stroke();

   /* Get pixels of shape */
   pixelsShape = getPixelAmount(66, 10, 0);
}

/* Star shape */
function drawStar() {
   bgMusic.play()
   gameStart.classList.add('hidden');
   ctx.strokeStyle = 'rgb(66, 10, 0)';

   let rot = Math.PI / 2 * 3;
   let x = 185;
   let y = 185;
   let cx = 185;
   let cy = 185;
   const spikes = 5;
   const outerRadius = 120;
   const innerRadius = 60;
   const step = Math.PI / 5;

   ctx.strokeSyle = "#000";
   ctx.beginPath();
   ctx.moveTo(cx, cy - outerRadius)
   for (i = 0; i < spikes; i++) {
       x = cx + Math.cos(rot) * outerRadius;
       y = cy + Math.sin(rot) * outerRadius;
       ctx.lineTo(x, y)
       rot += step

       x = cx + Math.cos(rot) * innerRadius;
       y = cy + Math.sin(rot) * innerRadius;
       ctx.lineTo(x, y)
       rot += step
   }
   ctx.lineTo(cx, cy - outerRadius)
   ctx.closePath();
   ctx.stroke();

   /* Get pixels of shape */
   pixelsShape = getPixelAmount(66, 10, 0);
}

/* Umbrella Shape */
function drawUmbrella() {
   bgMusic.play()
   gameStart.classList.add('hidden');
   ctx.strokeStyle = 'rgb(66, 10, 0)';

   /* Draw individual arcs */
   drawArc(185, 165, 120, 0, 1); // large parasol
   drawArc(93, 165, 26, 0, 1);
   drawArc(146, 165, 26, 0, 1);
   drawArc(228, 165, 26, 0, 1);
   drawArc(279, 165, 26, 0, 1);

   /* Draw handle */
   ctx.moveTo(172, 165);
   ctx.lineTo(172, 285);
   ctx.stroke();
   drawArc(222, 285, 50, 0, 1, false);
   drawArc(256, 285, 16, 0, 1);
   drawArc(221, 286, 19, 0, 1, false);
   ctx.moveTo(202, 285);
   ctx.lineTo(202, 169);
   ctx.stroke();

   /* Get pixels of shape */
   pixelsShape = getPixelAmount(66, 10, 0);
}

/* Draw individual arcs */
function drawArc(x, y, radius, start, end, counterClockwise = true) {
   ctx.beginPath();
   ctx.arc(x, y, radius, start * Math.PI, end * Math.PI, counterClockwise);
   ctx.stroke();
}

/* Determine X and Y coordinates of mouse */
function handleMouseMove(e) {
   const x = e.clientX - bounds.left;
   // const x = e.clientX - 775;
   const y = e.clientY - bounds.top;
   // const y = e.clientY - 48;
   // console.log('x: ', x)
   // console.log('y: ', y)

   /* Only paint when user is holding mouse down */
   if (mouseDown) {
      paint(x, y);
   }
}

/* Set variables once user has started the game */
function handleMouseDown() {
   if (!startedTurn) {
      mouseDown = true;
      startedTurn = true;
   } else {
      console.log('You already played');
   }
}

function handleMouseUp() {
   mouseDown = false;
   /* Check score once user stops drawing */
   evaluatePixels();
}

/* Get opacity of canvas */
function getPixelColor(x, y) {
   const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
   let index = ((y * (pixels.width * 4)) + (x * 4));
   return {
      r:pixels.data[index],
      g:pixels.data[index + 1],
      b:pixels.data[index + 2],
      a:pixels.data[index + 3]
   };
}

/* Begins path and moves context and paints line */
function paint(x, y) {
   let color = getPixelColor(x, y);
   /* user has gone too far off the shape */
   // console.log(`x: ${x}, y: ${y}, r: ${color.r}, g: ${color.g}, b: ${color.b}, a: ${color.a}`);
   if (color.r === 0 && color.g === 0 && color.b === 0) {
      score.textContent = `FAILURE - You broke the shape`;
      brokeShape = true;
   } else {
      ctx.strokeStyle = 'rgb(247, 226, 135)';
      ctx.beginPath();
      /* Draw a continuous line */
      if (prevX > 0 && prevY > 0) {
         ctx.moveTo(prevX, prevY);
      }
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.closePath();
      prevX = x;
      prevY = y;
   }
}

/* Read the context and get all the pixels in the canvas based on their rgb values */
function getPixelAmount(r, g, b) {
   const pixelsData = ctx.getImageData(0, 0, canvas.width, canvas.height);
   const allPixels = pixelsData.data.length;;
   let amount = 0;
   for (let i = 0; i < allPixels; i += 4) {
      if (pixelsData.data[i] === r &&
         pixelsData.data[i+1] === g &&
         pixelsData.data[i+2] === b) {
        amount++;
      }
    }
    return amount;
}

/* Divide the number of pixels that were traced by the pixels in the shape to determine how accurate the cut out is */
function evaluatePixels() {
   if (!brokeShape) {
      const pixelsTrace = getPixelAmount(247, 226, 135);
      //console.log(`Pixels Shape: ${pixelsShape}`);
      //console.log(`Pixels Trace: ${pixelsTrace}`);
      let pixelDifference = pixelsTrace / pixelsShape;
      /* User has scored at last 50% but not drawn too much (especially on mobile) */
      if (pixelDifference >= 0.7 && pixelDifference <= 1) {
         score.textContent = `SUCCESS - You scored ${Math.round(pixelDifference * 100)}%`;
      } else {
         score.textContent = `FAILURE - You cut ${Math.round(pixelDifference * 100)}%`;
      }
   }
}

/* Clear all elements from the canvas */
function clearCanvas() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   gameStart.classList.remove('hidden');
   mouseDown = false;
   startedTurn = false;
   brokeShape = false;
   score.textContent = '';
   prevX = null;
   prevY = null;
   pixelsShape = 0;
}

/* Event Handlers for drawing on the canvas */
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);

/* Event handlers for shape buttons */
buttonTriangle.addEventListener('click', drawTriangle);
buttonCircle.addEventListener('click', drawCircle);
buttonStar.addEventListener('click', drawStar);
buttonUmbrella.addEventListener('click', drawUmbrella);

/* Event handler for resetting the game */
restart.addEventListener('click', clearCanvas);

// Set up touch events for mobile, etc
canvas.addEventListener('touchstart', function(e) {
   mousePos = getTouchPos(canvas, e);
   const touch = e.touches[0];
   const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
   });
   canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener('touchend', function() {
   const mouseEvent = new MouseEvent('mouseup', {});
   canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener("touchmove", function(e) {
   const touch = e.touches[0];
   const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
   });
   canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
   const rect = canvasDom.getBoundingClientRect();
   return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
   };
}

// Prevent scrolling when touching the canvas
document.body.addEventListener('touchstart', function(e) {
   if (e.target == canvas) {
     e.preventDefault();
   }
 }, false);
 document.body.addEventListener('touchend', function(e) {
   if (e.target == canvas) {
     e.preventDefault();
   }
 }, false);
 document.body.addEventListener('touchmove', function(e) {
   if (e.target == canvas) {
     e.preventDefault();
   }
 }, false);

setupCanvas();