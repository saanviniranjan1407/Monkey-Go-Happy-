var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey, monkey_running;
var banana, bananaImage, obstacle, obstacleImage;
var FoodGroup, ObstacleGroup;
var survivalTime = 0;
var score = 0;
var count = 0;
var gameover, gameoverImage;
var Restart, restartImage;
var monkey_collided;
var jungleImage;

function preload(){  
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png"); 
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  monkey_collided = loadAnimation("Monkey.png");
  jungleImage = loadImage("jungle.jpg");
}

function setup() {
  createCanvas(displayWidth,displayHeight);
  
  jungle = createSprite(0,0,displayWidth,displayHeight);
  jungle.addImage(jungleImage);
  jungle.scale = 4;  
  jungle.velocityX = -2;
  
  monkey = createSprite(50,displayHeight-80,10,10);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("collided", monkey_collided);
  monkey.scale = 0.12;
  monkey.velocityX = 1
  
  ground = createSprite(displayWidth/2,displayHeight-20,displayWidth*10,15);
  ground.velocityX = -4;
  ground.visible = true;
  
  gameover = createSprite(displayWidth/2,displayHeight/2-50,10,10);
  gameover.addImage(gameoverImage);
  gameover.scale = 0.8;
  
  Restart = createSprite(camera.position.x+1000,displayHeight/2,10,10);
  Restart.addImage(restartImage);
  Restart.scale = 0.55;
  
  FoodGroup = createGroup();
  ObstacleGroup = createGroup();
  
  //monkey.debug = true;
}

function draw() {
  drawSprites();
  
  stroke("white");
  fill("white");
  textSize(18);
  text("Score: " + score,camera.position.x - 100,50);
  
  stroke("white");
  fill("white");
  textSize(18);
  text("Survival Time: " + survivalTime,camera.position.x,50);
  
  if(gameState === PLAY){
    if(ground.x < 0){
      ground.x = ground.width/2;  
    } 
    
    if(jungle.x < 0){
      jungle.x = camera.position.x;  
    }
    
    if(keyDown("space")){
      monkey.velocityY = -12;
    }
    
    camera.position.x = monkey.x;
    //camera.position.y = displayHeight/2;
    
    gameover.visible = false;
    Restart.visible = false;
    
    survivalTime = survivalTime + Math.round(getFrameRate()/60);
    
    //gravity
    monkey.velocityY = monkey.velocityY + 0.8;  
    monkey.collide(ground);
    
    //if(monkey.isTouching(FoodGroup)){
      //score = score + 2;
      //FoodGroup.destroyEach();
    //}

    for(var i = 0; i < FoodGroup.length; i++){
      if(FoodGroup.get(i).isTouching(monkey)){
        FoodGroup.get(i).destroy();
        score = score + 2;
      }
    }
    
    if(monkey.isTouching(ObstacleGroup) && count === 0){
      monkey.scale = 0.12; 
      count = count + 1;
      ObstacleGroup.destroyEach();
    }  
    
    else if(ObstacleGroup.isTouching(monkey)){
      gameState = END;        
    }
    
    switch(score){
      case 10: monkey.scale = 0.14;               
               break;
      case 20: monkey.scale = 0.16;                
               break;
      case 30: monkey.scale = 0.18;              
               break;
      case 40: monkey.scale = 0.20;  
               break; 
      default: break;
   }
    
    if(monkey.isTouching(ObstacleGroup) && count === count + 1){
      gameState = END;  
    }
    
    Food();
    Obstacle();
  }
  
  else if(gameState === END){
    ObstacleGroup.setLifetimeEach(-1);
    FoodGroup.setLifetimeEach(-1);
    
    ObstacleGroup.setVelocityXEach(0);
    FoodGroup.setVelocityXEach(0);
    
    ground.velocityX = 0;
    monkey.velocityX = 0;
    jungle.velocityX = 0;
    
    monkey.collide(ground);
    
    gameover.visible = true;
    Restart.visible = true;
    
    monkey.changeAnimation("collided", monkey_collided);
    
    if(mousePressedOver(Restart)){
      restart();   
    }
  }
}

function Food(){
  if(frameCount % 80 === 0){
    var food = createSprite(displayWidth,Math.round(random(displayHeight/2-100,displayHeight/2+100)),5,5);
    food.addImage(bananaImage);
    food.scale = 0.1;  
    food.velocityX = -4;
    food.lifetime = displayWidth;
    
    food.depth = gameover.depth;
    gameover.depth = gameover.depth + 1;
    
    food.depth = Restart.depth;
    Restart.depth = Restart.depth + 1;
    
    FoodGroup.add(food);
  }
}

function Obstacle(){
  if(frameCount % 300 === 0){
    var obstacle = createSprite(displayWidth,displayHeight-70,10,10);
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.15;
    obstacle.velocityX = -4;
    obstacle.lifetime = displayWidth;
    
    obstacle.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    obstacle.depth = gameover.depth;
    gameover.depth = gameover.depth + 1;
    
    obstacle.depth = Restart.depth;
    Restart.depth = Restart.depth + 1;
    
    ObstacleGroup.add(obstacle);
  }
}

function restart(){
  gameState = PLAY;
  jungle.velocityX = -4;
  FoodGroup.destroyEach();
  ObstacleGroup.destroyEach();
  score = 0;
  count = 0;
  monkey.changeAnimation("running", monkey_running);
  survivalTime = 0;
}