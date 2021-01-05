
/*
AXIS OF CANVAS
X AXIX --->>> increases from 0
 
Y AXIS  ^
Inccreases From 0
       |
      \|/
       +
*/
var ctx = document.getElementById('ctx').getContext('2d');
var CanHeight = 210;
var CanWidth = 210;
var bG = document.querySelector("#ctx")//background
bG.style.background = "url('https://images.unsplash.com/photo-1483354483454-4cd359948304?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80')";
bG.style.backgroundSize = "210px 210px";

var one = 0; two = 0; three = 0; four = 0
var direction;
var moving;
var eaten;
var score;
let SnakeArr = [{ x: 85, y: 3 }, { x: 75, y: 3 }, { x: 65, y: 3 }, { x: 55, y: 3 }, { x: 45, y: 3 }, { x: 35, y: 3 }, { x: 25, y: 3 }, { x: 15, y: 3 }, { x: 5, y: 3 }];
var SnakeArrLastIndex = 8;
var SnakeArrLastInX;
var SnakeArrLastInY;
var SnakeArrAfterL = 9;
var up = 1; down = 3; left = 0, right = 2;//to change direction within javascript snippet(will remove bot and make into a javascript snippet which i will 
//paste in browser)

//Variables between this and below are for food region(the rectangle within which food is displayed)
var minX = 0; maxX = 0; minY = 0; maxY = 0;//food region variable.
var max = CanWidth - 15;
var RegionWid;//var needed to draw rectangle food region
var minWH = 15;//minimum difference between maxX and minX that I want ie minimum width of food rectangle
/**
 * 
 * @param {number} max 
 * @return {number} - Random number bounded by max
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
minX = getRandomInt((CanWidth - 15 - minX));
var preMaxX = getRandomInt((CanWidth - 15 - 0));//food region variable,will use this to get minX the LHS coord of rect and maxX RHS coord
//based on value
var preMaxY = getRandomInt((CanWidth - 15 - 0));
var movedDown = false;
var movedUp = false;
var movingUp = false;
var foodEatingDistance = 5;
var gameStart = false;//to only trigger the start event if not started yet
var straySnakeFix = false;//bug fix variable set true if scanning region started
/**
 * Function is called at the start of the game. Function uses Global variables to set location of food region, that is the randomly placed rectangle within which food will appear all the time.
 * Function then displays these coordinates. in the table.
 */
function actualFoodRegionCoordinates(){
//Below we are setting food region coordinates the randomly placed rectangle in which food will appear.
if (preMaxX < minX) {//if minX coord happened to be larger then max we swap
  if ((minX - preMaxX) < minWH) {//if difference smaller then minimum width of rectangle i want.
    minX += minWH;
  }
  maxX = minX;//since minX was larger then preMaxX
  minX = preMaxX;
}
else if (preMaxX > minX) {//if max was already larger then minX just check that we are not getting width smaller then minWH
  if ((preMaxX - minX) < minWH) {
    preMaxX += minWH;

  }
  maxX = preMaxX;

}
else {//if equal both preMaxX and minX are same
  maxX = minX + minWH;
}
RegionWid = maxX - minX;
minY = getRandomInt((CanWidth - 15 - minY));
if (preMaxY < minY) {
  if ((minY - preMaxY) < minWH) {
    minY += minWH;
  }
  maxY = minY;
  minY = preMaxY;
}
else if (preMaxY > minY) {
  if ((preMaxY - minY) < minWH) {
    preMaxY += minWH;

  }
  maxY = preMaxY;

}
else {//if equal
  maxY = minY + minWH;
}//food region variables have been set

//Below Display the food region coordinates (actual not predicted) in the table,done only at beginning of game

document.getElementById("col1").innerHTML = minX;
document.getElementById("col2").innerHTML = maxX;
document.getElementById("col3").innerHTML = minY;
document.getElementById("col4").innerHTML = maxY;
}


//The Object below will tell us status of table to know values of food entered or not. Each time I change value in table I will update this object as well
foodTableStats = {//This object will have predicted values of food region based on food coordinates recorded when eating.
  minX: {
    value: undefined,
    boolEntered: false//false means no previuos value of minX; where minX is prediction of minX of food region made when food eaten  
  },
  maxX: {
    value: undefined,
    boolEntered: false
  },
  minY: {
    value: undefined,
    boolEntered: false
  },
  maxY: {
    value: undefined,
    boolEntered: false
  }
};

snakeSeg = {//SnakeSegment object,Snake is array of these objects that will be drawn using draw function
  color: "sienna",
  width: 13,
  height: 13
};
snakeFood = {//SnakeFood Object,Snake drawn using these details
  color: "CadetBlue",
  width: 15,
  height: 15
};
let HeadCoord = [{ x: 130, y: 5 }]
var SnakeX = HeadCoord[0].x;//This SnakeX and SnakeY is head of snake that we will use to find if snake touching edge etc for our bot 
//purposes
var SnakeY = HeadCoord[0].y;
var PrevSnakeX = 0;//These variables PrevSnakeX PrevSnakeY are used to know direction which
//snake is heading or in which snake moved These variables are for bot purposes as well
var PrevSnakeY = 0;


/**
 * Function draws segment of snake,we loop through snake body array and call on each segment
 * @param {number} x - xCoord of segment
 * @param {number} y - yCoord of Segment
 */
function drawSnake (x, y, counter) {
  ctx.save();
  if (counter == 0) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, snakeSeg.width, snakeSeg.height);
    ctx.restore();
  }
  else {
    ctx.fillStyle = snakeSeg.color;
    ctx.fillRect(x, y, snakeSeg.width, snakeSeg.height);
    ctx.restore();
  }
}
/**
 * Function draws the randomly located rectangel in which food will appear throughout game
 * @param {number} minX - The smaller XCoord
 * @param {number} maxY - The larger YCoord
 * @param {number} maxX - The larger XCoord
 * @param {number} minY - The smaller YCoord
 */
function drawFRegion (minX, maxY, maxX, minY) {
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "blue";
  ctx.rect(minX, minY, RegionWid, (maxY - minY));
  ctx.stroke();
  ctx.restore();
}


/**
 * @param {Object} sf - TheSnake Food object
 * @param {number} counter - counter helps with foreach usage in array
 */
 function drawFood (sf, counter) {
  ctx.save();
  if (counter == 0) {
    ctx.fillStyle = snakeFood.color;
    ctx.beginPath();
    ctx.arc(sf.x, sf.y, (snakeFood.width * 0.3), 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }
}
/**
 * unused Function intended to increase lenght of snake,since bot snake moves fast so I wont use this
 * @param {number} x - xcoord 
 * @param {number} y  - ycoord
 */
function addSeg(x, y) {
  SnakeArr.push({ x, y });
}
/**
 * Function draws or displays the score on the canvas
 * @param {number} scoreG - Current Score
 */
 function drawScore (scoreG) {
  ctx.save();
  ctx.font = "10px Comic Sans MS";
  ctx.fillStyle = "black";
  ctx.fillText("Score:" + scoreG, 0, 30);
  ctx.restore();
  ctx.save();
  ctx.font = "15px Comic Sans MS";
  ctx.fillStyle = "black";
  ctx.fillText("Coord:x:" + HeadCoord[0].x + " y:" + HeadCoord[0].y, 85, 30);
  ctx.restore();
}
/**
 * Function allows to display the Start Screen of Game ie. press g to start
 */
 function drawPreStart () {
  ctx.save();
  ctx.font = "22px Comic Sans MS";
  ctx.fillStyle = "black";
  ctx.fillText("Please Press 'g'", 30, 90);
  ctx.fillText("to start the game", 10, 110);
  ctx.restore();
}
/**
 * Change direction function
 * @param {number} mydirection to update direction of snake
 */
 function changeDir (mydirection) {
  // body...
  direction = mydirection;
}
/**
 * This function updates snake segment coordinates,this is called every frame by main function. The draw function will draw according to the updated details
 */
 function oneStep () {
  for (var i = SnakeArr.length - 1; i >= 0; i--) {
    if (direction == 0) {//if left pressed
      if (SnakeArr[0].x > 0) {


        if (i == 0) {
          SnakeArr[0].x = SnakeArr[0].x - 5;
        }
        else {
          SnakeArr[i].x = SnakeArr[i - 1].x;//of previous segment
          SnakeArr[i].y = SnakeArr[i - 1].y;
        }
      }

    }
    else if (direction == 1) {//if direction pressed is up
      //if pressed up
      if (SnakeArr[0].y > 0) {
        if (i == 0) {
          SnakeArr[i].y = SnakeArr[i].y - 5;
        }
        else {
          SnakeArr[i].x = SnakeArr[i - 1].x;
          SnakeArr[i].y = SnakeArr[i - 1].y;
        }
      }
    }
    else if (direction == 2) {//if right pressed
      if ((SnakeArr[0].x < (CanHeight - 10))) {//10 less then max canvas width or height
        if (i == 0) {
          SnakeArr[i].x = SnakeArr[i].x + 5;
        }
        else {
          SnakeArr[i].x = SnakeArr[i - 1].x;
          SnakeArr[i].y = SnakeArr[i - 1].y;
        }
      }
    }
    else if (direction == 3) {//if down pressed
      if ((SnakeArr[0].y < (CanHeight - 10))) {//10 less then max canvas height
        if (i == 0) {
          SnakeArr[i].y = SnakeArr[i].y + 5;
        }
        else {
          SnakeArr[i].x = SnakeArr[i - 1].x;
          SnakeArr[i].y = SnakeArr[i - 1].y;
        }
      }
    }
  }
}
/**
 * This function will control the snake. Will make snake scan canvas (or Food region after it has been found) for food,by scanning down left to right,right to left. After reaching bottom, scanning up left to right,right to left.
 * 
 * Function uses Global variables declared in this file. Score<=20 means food region not found and vice versa.
 */
function snakeBot(){
  //If snake has direction right or left it will contrinue going in that direction in all frames,so when snake reaches end of canvas
  //it needs to go down or up depending on whether we are scanning down or up. 
  if (PrevSnakeY < SnakeY) {
    movedDown = true;//Tells Bot that we already moved down one step after reached horizontal end of canvas so now need to go right or left.
  }
  if (PrevSnakeY > SnakeY) {
    movedUp = true;//Tells Bot that we already moved up one step after reached horizontal end of canvas so now need to go right or left.
  }

//reset movingUp if reached top of foodregion/canvas,set to false when we need to scan down because we are at top.
if (SnakeY < foodTableStats.minY.value && score > 20) {//Reached top of food region so have to scan down food region for 
  //food
  movingUp = false;
}
if (SnakeY < 5 && score <= 20) {//reached top of canvas so have to scan down canvas for food.
  movingUp = false;
}

//movingUp variable false tells snake to scan downwards and not upwards.
  if ((SnakeY < CanHeight-15) && (movingUp == false) && (score <= 20)) {//Scanning down Canvas since food region not found
    if (SnakeX > CanWidth-20 && SnakeX < CanWidth && (movedDown == false)) {//reached right end of canvas move down one step
      PrevSnakeY = SnakeY;//will set movedDown to true in next frame using the if statement
      direction = down;//will set movedDown to true in next frame using the if statement
    }
    if (SnakeX > CanWidth-20 && SnakeX < CanWidth && (movedDown == true)) {//reached right end of canvas and moved down,so go left.
      direction = left;
      PrevSnakeY = SnakeY;
      movedDown = false;//reseting value of moved down
    }
    if (SnakeX > 0 && SnakeX < 8 && (movedDown == false)) {//reached left end of canvas, move down one step
      PrevSnakeY = SnakeY;
      direction = down;//will set movedDown to true in next frame using the if statement
    }
    if (SnakeX > 0 && SnakeX < 8 && (movedDown == true)) {//reached left end of canvas and moved down one step. So go right
      PrevSnakeY = SnakeY;
      movedDown = false;
      direction = right;
    }
  }

  //scan food region if it has been found part.
  if ((SnakeY < foodTableStats.maxY.value) && (movingUp == false) && (score > 20)) {//Scanning downwards the food region if found
    straySnakeFix = true;//a bug fix,bug caused snake to get outside from food region
    if (SnakeX > foodTableStats.maxX.value && SnakeX < CanWidth && (movedDown == false)) {//reached right end of food region move down one step
      PrevSnakeY = SnakeY;//will set movedDown to true in next frame using the if statement
      direction = down;
    }
    if (SnakeX > foodTableStats.maxX.value && SnakeX < CanWidth && (movedDown == true)) {//reached right end of food region and moved down,so go left.
      direction = left;
      PrevSnakeY = SnakeY;
      movedDown = false;//resetting value of moved down
    }
    if (SnakeX > 0 && SnakeX < foodTableStats.minX.value && (movedDown == false)) {//reached left end of food region, move down one step
      PrevSnakeY = SnakeY;
      direction = down;
    }
    if (SnakeX > 0 && SnakeX < foodTableStats.minX.value && (movedDown == true)) {//reached left end of food region and moved down one step. So go right
      PrevSnakeY = SnakeY;
      movedDown = false;
      direction = right;
    }
  }

  //Scan upwards part
  if (SnakeY > CanHeight-15 && score <= 20) {//For scanning up,since snake at bottom of canvas we set movingUp true,this will only
    //allow the scan up to work;just like setting movingUp to false only allows scan down to work.
    movingUp = true;
  }
  if (SnakeY > foodTableStats.maxY.value && score > 20) {//in case if scanning food region we enable scan up using this. 
    movingUp = true;
  }

  
  if (SnakeY > 10 && movingUp == true && (score <= 20)) {//If food region not found,Scanning canvas upwards for food from bottom of canvas.
    if (SnakeX > CanWidth-20 && SnakeX < CanWidth && (movedUp == false)) {
      PrevSnakeY = SnakeY;
      direction = up;
    }
    if (SnakeX > CanWidth-20 && SnakeX < CanWidth && (movedUp == true)) {
      direction = left;
      PrevSnakeY = SnakeY;
      movedUp = false;
    }
    if (SnakeX > 0 && SnakeX < 8 && (movedUp == false)) {
      PrevSnakeY = SnakeY;
      direction = up;
    }
    if (SnakeX > 0 && SnakeX < 8 && (movedUp == true)) {
      PrevSnakeY = SnakeY;
      movedUp = false;
      direction = right;
    }
  }

  //scan food region upwards if food region found and we are at bottom of food region
  if (SnakeY > foodTableStats.minY.value && movingUp == true && (score > 20)) {//scan food region upwards if food region found and we are at bottom of food region
    if (SnakeX > foodTableStats.maxX.value && SnakeX < CanWidth && (movedUp == false)) {
      PrevSnakeY = SnakeY;
      direction = up;
    }
    if (SnakeX > foodTableStats.maxX.value && SnakeX < CanWidth && (movedUp == true)) {
      direction = left;
      PrevSnakeY = SnakeY;
      movedUp = false;
    }
    if (SnakeX > 0 && SnakeX < foodTableStats.minX.value && (movedUp == false)) {
      PrevSnakeY = SnakeY;
      direction = up;
    }
    if (SnakeX > 0 && SnakeX < foodTableStats.minX.value && (movedUp == true)) {
      PrevSnakeY = SnakeY;
      movedUp = false;
      direction = right;
    }
  }
  
  if ((straySnakeFix == true) && ((SnakeY < (foodTableStats.minY.value) - 10) || (SnakeY > (foodTableStats.maxY.value) + 10)) && (SnakeX < ((CanWidth - 10)))) {//attempt to fix bug which causes snake to occasionally wander away from food region when score >20
    diection = right;//works by leading snake to edge of horizontal canvas,so as soon as edge of canvas reached the scan food region 
    //code directs it back to scan food region,food region code has no condition to control snake if snakeX is <maxX and >maxX,so a snake going down or up kept going up.
    direction = right;
    straySnakeFix = false;
  }



}
/**
 * This is the main function,this function is the function that gets called every frame by our setInterval loop and calls all other required functions in it.
 */
 function mainFunct () {
  ctx.clearRect(0, 0, CanHeight, CanWidth);//clear whole canvas every frame
  drawFRegion(minX, maxY, maxX, minY);//drawfood region every frame
  for (var i = 0; i < SnakeArr.length; i++) {//draw Snake based on latest segment coordinates
    drawSnake((SnakeArr[i].x), (SnakeArr[i].y), (i));
  }
  HeadCoord[0].x = SnakeArr[0].x;
  HeadCoord[0].y = SnakeArr[0].y;
  SnakeX = HeadCoord[0].x;
  SnakeY = HeadCoord[0].y;
  document.getElementById("Score").innerHTML = ("Score: " + (score));//draw score outside canvas on top
  drawScore(score);//display score in canvas

  while (eaten) {
    //each time i eat i record food coordinate to predict food region,so i can simply search for food in this region
    //Updating predicted food region based on coordinate of food we ate,only update if ate food in previous frame.
    if (foodTableStats.minX.boolEntered == false || foodTableStats.minX.value > SnakeX) {//if previous minX > food Coord we encountered(ate) OR if no previous minX
      //prediction, then update minX prediction
      document.getElementById('mnX').innerHTML = SnakeX;
      foodTableStats.minX.boolEntered = true;
      foodTableStats.minX.value = SnakeX;
    }
    else if ((foodTableStats.minX.boolEntered == true && foodTableStats.maxX.boolEntered == false) || foodTableStats.maxX.value < SnakeX) {
      document.getElementById('mxX').innerHTML = SnakeX;
      foodTableStats.maxX.value = SnakeX;
      foodTableStats.maxX.boolEntered = true;
    }
    if (foodTableStats.minY.boolEntered == false || foodTableStats.minY.value > SnakeY) {
      document.getElementById('mnY').innerHTML = SnakeY;
      foodTableStats.minY.boolEntered = true;
      foodTableStats.minY.value = SnakeY;
    }
    else if ((foodTableStats.minY.boolEntered == true && foodTableStats.maxY.boolEntered == false) || foodTableStats.maxY.value < SnakeY) {
      document.getElementById('mxY').innerHTML = SnakeY;
      foodTableStats.maxY.value = SnakeY;
      foodTableStats.maxY.boolEntered = true;
    }


    //
    foodX = Math.random() * (maxX - minX) + minX;//since food eaten so redraw food within foodregion
    foodY = Math.random() * (maxY - minY) + minY;
    foodList[0].x = foodX;
    foodList[0].y = foodY;
    eaten = false;
  }
  foodList.forEach(drawFood);

  snakeBot();//Controls snake to make it scan whole canvas for food,when food region found only scans through foodregion for food.
  oneStep();

  //Below we are finding distance between food and snakeHead. If it is within threshhold then we say eaten=true; and
  //food will have to reappear somewhere else..note looks complicated because food is round so had to adjust if we eat it
  //from bottom or top or side.
  one = SnakeArr[0].x - foodList[0].x;//head to food dist ie for positive and negative numbers
  two = foodList[0].x - SnakeArr[0].x;//same as above for negative
  three = SnakeArr[0].y - foodList[0].y;
  four = foodList[0].y - SnakeArr[0].y;
  if (direction == up || direction == down) {//direction==down or up need more foodeating distance margin for xaxis error fix
    if (((one < (1.6 * foodEatingDistance) && one > 0) || (two < (1.6 * foodEatingDistance) && two > 0)) && (((three) < (foodEatingDistance) && three > 0) || (four < (foodEatingDistance) && four > 0))) {
      eaten = true;
      score = score + 1;
      if (eaten) {//update variables for function that could increase snake length. Not being used since snake too fast.
        SnakeArrLastIndex++;//variable used by function that increases snake length
        SnakeArrAfterL++;
      }
    }

  }
  else {//direction==right or left need more foodeating distance margin for yaxis error fix
    if (((one < foodEatingDistance && one > 0) || (two < foodEatingDistance && two > 0)) && (((three) < (1.6 * foodEatingDistance) && three > 0) || (four < (1.6 * foodEatingDistance) && four > 0))) {
      eaten = true;
      score = score + 1;
      if (eaten) {//update variables for function that could increase snake length. Not being used since snake too fast.
        SnakeArrLastIndex++;
        SnakeArrAfterL++;
        //console.log("length increased");
      }
    }
  }
  moving = true;//used by pause and resume keys.
  // body...
}
drawPreStart();//calling this to draw prestart screen.
/**
 * This function initialises game and other variables of game and calls the main function.This function is called when we start game by pressing g
 */
function startGame() {
  actualFoodRegionCoordinates();
  snakeBody = SnakeArr = [{ x: 85, y: 3 }, { x: 75, y: 3 }, { x: 65, y: 3 }, { x: 55, y: 3 }, { x: 45, y: 3 }, { x: 35, y: 3 }, { x: 25, y: 3 }, { x: 15, y: 3 }, { x: 5, y: 3 }];
  score = 0;
  eaten = false;
  foodX = Math.random() * (maxX - minX) + minX;//food will appear within region
  foodY = Math.random() * (maxY - minY) + minY;
  foodList = [{ x: foodX, y: foodY }];
  //Starting AI direction
  direction = right;
  PrevSnakeY = SnakeY;
  movingUp = false;
  //Starting AI direction
  for (var i = 0; i < SnakeArr.length; i++) {
    drawSnake((SnakeArr[i].x), (SnakeArr[i].y), (i));
  }
  myInter = setInterval(mainFunct, 4);
}
document.onkeydown = function (event) {//set direction or pause/resume game
  if ((event.keyCode == 71) && (gameStart == false)) {
    gameStart = true;
    startGame();
    //console.log("pressed left");
  }
  else if (event.keyCode == 37) {
    direction = 0;
    //console.log("pressed left");
  }
  else if (event.keyCode == 38) {
    direction = 1;
    //console.log("pressed up");
  }
  else if (event.keyCode == 39) {
    direction = 2;
    //console.log("pressed right");
  }
  else if (event.keyCode == 40) {
    direction = 3;
    //console.log("pressed down");
  }
  else if ((event.keyCode == 32) && (moving == true)) {//created this to pause game
    //console.log("spacebar");
    clearInterval(myInter);
    moving = false;

  }
  else if ((event.keyCode == 32) && (moving == false)) {//created this to resume game
    //console.log("spacebar to start");
    myInter = setInterval(mainFunct, 8);
    moving = true;
  }

}
