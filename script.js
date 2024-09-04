////////// set the canvas for game
//create canvas
const canvas = document.createElement("canvas");
canvas.style.background = "black";
const ctx = canvas.getContext("2d"); // give context size
document.body.prepend(canvas); // append canvas to dom
const game = {
  grid: 40,
  ani: "",
  bricks: [],
  bonus: [],
  inplay: false,
  gameover: true,
  num: 100,
}; // setting the grid
//setting ball :
const ball = {
  x: game.grid * 7,
  y: game.grid * 5,
  w: game.grid / 3,
  h: game.grid / 3,
  color: "blue",
  dx: 0,
  dy: 0,
};

// setting player : position(x,y) and height, width
const player = {
  //   x: game.grid * 7,
  //   y: game.grid * 8,
  //   w: game.grid * 2,
  //   h: game.grid / 2,
  color: "red",
  speed: 5,
  //   lives: 5,
  //   score: 0
};

//setting keys for treaking key
const keys = { ArrowLeft: false, ArrowRight: false };

canvas.setAttribute("width", game.grid * 15); // setting width of game window
canvas.setAttribute("height", game.grid * 10); // setting height of game window
canvas.style.border = "1px solid black"; // setting border of game window

//Adding a click event on canvas fro starting the game.
canvas.addEventListener("click", (e) => {
  if (game.gameover) {
    game.gameover = false;
    startGame();
    game.ani = requestAnimationFrame(draw); // animation on draw
  } else if (!game.inplay) {
    game.inplay = true;
    ball.dx = 2;
    ball.dy = -2;
  }
});

outputStartGame();

//////////adding eventlistener for keypress for treaking keys
document.addEventListener("keydown", (e) => {
  if (e.code in keys) {
    keys[e.code] = true;
  }
  if (e.code == "ArrowUp" && !game.inplay) {
    game.inplay = true;
    ball.dx = 2;
    ball.dy = -2;
  }
});
document.addEventListener("keyup", (e) => {
  if (e.code in keys) {
    keys[e.code] = false;
  }
});

/////// For mouse movements

canvas.addEventListener("mousemove", (e) => {
  // console.log(e)
  // getting the value of players x movements
  const val = e.clientX - canvas.offsetLeft;
  if (val > player.w && val < canvas.width) {
    player.x = val - player.w;
    if (!game.inplay) {
      ball.x = val - (player.w / 2);
    }
    // console.log(player.x)
  }
});

// reseting ball position

function resetBall() {
  ball.dx = 0;
  ball.dy = 0;
  ball.y = player.y - ball.h;
  ball.x = player.x + (player.w / 2);
  game.inplay = false;
}

function gameWinner() {
  game.gameover = true;
  game.inplay = false;
  cancelAnimationFrame(game.ani);
}
function gameOver() {
  game.gameover = true;
  game.inplay = false;
  cancelAnimationFrame(game.ani);
}

function outputStartGame() {
  let output = "Click to start Game";
  ctx.font = Math.floor(game.grid * 0.7) + "px serif";
  if(canvas.width < 900){
    ctx.font =  "20px serif"
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "yellow";
  ctx.fillText(output, canvas.width / 2, canvas.height / 2);
}
// function for starting game
function startGame() {
  game.inplay = false;
  player.x = game.grid * 7;
  player.y = canvas.height - game.grid * 2;
  player.w = game.grid * 1.5;
  player.h = game.grid / 4;
  player.lives = 5;
  player.score = 0;
  game.bonus = []

  resetBall();

  let buffer = 10;
  let width = game.grid;
  let height = game.grid / 2;
  let totalAccross = Math.floor((canvas.width - game.grid) / (width + buffer));
  let xPos = game.grid / 2;
  let yPos = 0;
  let yy = 0
  for (let i = 0; i < game.num; i++) {
    if (i % totalAccross == 0) {
        yy++;
      yPos += height + buffer;
      xPos = game.grid / 2;
    }
    if(yy<4){
        createBrick(xPos, yPos, width, height);
    }
    xPos += width + buffer;
  }
}

//Adding bricks to game
function createBrick(xPos, yPos, width, height) {
  let ranCol = "#" + Math.random().toString(16).substring(9);
  console.log(ranCol);
  game.bricks.push({
    x: xPos,
    y: yPos,
    w: width,
    h: height,
    c: ranCol,
    v: Math.floor(Math.random() * 50),
    b:Math.floor(Math.random() * 3),
  });
}

//paddle movement function
function movement() {
  if (keys.ArrowLeft && player.x>0) {
    player.x -= player.speed;
  }
  if (keys.ArrowRight && player.x + player.w<canvas.width ) {
    player.x += player.speed;
  }
  if (!game.inplay) {
    ball.x = player.x + (player.w / 2);
  }
}

// Ball movement function
function ballmove() {
  if (ball.x > canvas.width || ball.x < 0) {
    ball.dx *= -1;
  }
  if (ball.y < 0) {
    ball.dy *= -1;
  }
  if (ball.y > canvas.height) {
    player.lives--;
    resetBall();
    if (player.lives < 0) {
      gameOver();
    }
  }
  if(ball.dy>-2 && ball.dy<0){
    ball.dy = -3
  }
  if(ball.dy>0 && ball.dy<2){
    ball.dy = 3
  }
  ball.x += ball.dx;
  ball.y += ball.dy;
}

//funtion for ball drawing on canvas
function drawBall() {
  ctx.beginPath(); // begin draw
  ctx.strokeStyle = 'white';
  ctx.rect(ball.x, ball.y, ball.w, ball.h); // draw ball
  //   ctx.stroke(); // start
  ctx.closePath(); // close drawing
  ctx.beginPath();
  ctx.fillStyle = ball.color; //fill color
  let adj = ball.w / 2;
  ctx.arc(ball.x + adj, ball.y + adj, ball.w / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath(); // close drawing
}

//funtion for drawing player on canvas
function drawPlayer() {
  ctx.beginPath(); // begin draw
  ctx.rect(player.x, player.y, player.w, player.h); // draw player
  ctx.fillStyle = player.color; //fill color
  ctx.fill(); // start
  ctx.closePath(); // close drawing
}
//funtion for drawing bonus item on canvas
function drawBonus(obj) {
    if(obj.counter<0){
    if(obj.color == "white"){
        obj.color = "black"
        obj.alt = "white"
        obj.counter = 10
    }else{
        obj.color = "white"
        obj.alt = "black"
        obj.counter = 10
    }
}
obj.counter--
  ctx.beginPath(); // begin draw
  ctx.rect(obj.x, obj.y, obj.w, obj.h); // draw obj
  ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
  ctx.strokeStyle = obj.color;
  ctx.fillStyle = obj.alt; //fill color
  ctx.fill(); // start
  ctx.closePath(); // close drawing

  ctx.beginPath(); // begin draw
  ctx.font = "14px serif";
  ctx.fillStyle = obj.color; //fill color
  ctx.textAlign = "center";
  ctx.fillText(obj.points, obj.x + obj.w/2, obj.y + obj.h/1.5);
  ctx.closePath(); // close drawing
}

//////////// Function collision Detection

function collDetection(obj1, obj2) {
  // checking ball is on the left or right
  const xAxis = (obj1.x < (obj2.x + obj2.w)) && ((obj1.x + obj1.w) > obj2.x);
  // checking ball is on the top or bottom of the paddle
  const yAxis = (obj1.y < (obj2.y + obj2.h)) && ((obj1.y + obj1.h) > obj2.y);
  const val = xAxis && yAxis;
  return val;
}

// funtion for paddle drawing on canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing the extra height and width when we move
  movement(); //calling paddle movement function
  ballmove(); //calling ball movement function
  drawPlayer(); // calling player function
  drawBall(); // calling ball function
  game.bonus.forEach((prize, index) => {
    prize.y+=5;
    drawBonus(prize)
    if(collDetection(prize, player)){
        player.score += prize.points
        let temp = game.bonus.splice(index, 1)
    }
    if (prize.y>canvas.height){
        let temp = game.bonus.splice(index, 1)
    }
    
  })
  
  // calling drawBricks function
  game.bricks.forEach((brick, index) => {
    ctx.beginPath(); // begin draw
    ctx.fillStyle = brick.c;
    ctx.strokeStyle = "white";
    ctx.rect(brick.x, brick.y, brick.w, brick.h); // draw player
    ctx.fill(); // start
    ctx.stroke();
    ctx.closePath(); // close drawing

    if (collDetection(brick, ball)) {
      game.bricks.splice(index, 1);
      player.score += brick.v;
      if(ball.dy>-10 && ball.dy <10){
        ball.dy--
      }
      ball.dy *= -1;
      if(brick.b == 1){
        game.bonus.push({
            x: brick.x,
            y:brick.y,
            h:brick.h,
            w:brick.w,
            points: Math.ceil(Math.random()*100) + 50,
            color:"white",
            alt: "black",
            counter :10
        })
      }

      if(game.bricks.length == 0){
        gameWinner()
      }
    }
  });

  // calling collision detection function
  if (collDetection(player, ball)) {
    ball.dy *= -1;
    let val1 = ball.x + (ball.w / 2) - player.x;
    let val2 = val1 - (player.w / 2);
    let val3 = Math.ceil(val2 / (player.w / 10));
    ball.dx = val3;
    // console.log(val1)
  }
  let output1 = player.lives <= 1 ? "Life" : "Lives";
  let output = `${output1} : ${player.lives} Score : ${player.score}`;
  ctx.font = Math.floor(game.grid * 0.7) + "px serif";
  if (game.gameover) {
    ctx.font =  "24px serif"
    output = `Total Score : ${player.score}. GAME OVER! Click to play again.`;
  }
  if(canvas.width < 900){
    ctx.font =  "20px serif"
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(output, canvas.width / 2, canvas.height - 20);
  if (!game.gameover) {
    game.ani = requestAnimationFrame(draw); //loop
  }
}
