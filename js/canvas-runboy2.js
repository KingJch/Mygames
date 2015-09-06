
//全局变量
var canvas = document.getElementById('canvas'),
	context = canvas.getContext("2d");
	wh = window.innerHeight,
	ww = window.innerWidth,
	canvas.height = wh,
	canvas.width = ww,
  runnerCells = [
    { left: 0,   top: 0, width: 47, height: 64 },
    { left: 55,  top: 0, width: 44, height: 64 },
    { left: 107, top: 0, width: 39, height: 64 },
    { left: 150, top: 0, width: 46, height: 64 },
    { left: 208, top: 0, width: 49, height: 64 },
    { left: 265, top: 0, width: 46, height: 64 },
    { left: 320, top: 0, width: 42, height: 64 },
    { left: 380, top: 0, width: 35, height: 64 },
    { left: 425, top: 0, width: 35, height: 64 },
  ],
  spritesheet = new Image(),  //images
  sky = new Image();
  spritesheet.src = 'images/running-sprite-sheet.png';
  sky.src = 'images/sky.png'
	
/** function
=========================================**/

//run sprite
SpriteSheetPainter = function (cells) {
   this.cells = cells;
};

SpriteSheetPainter.prototype = {
	 cells: [],
   cellIndex: 0,
   startTop: 100,
   startX: ww - 40,
   verX: -1,

   //转换图片
   advance: function () {
      if (this.cellIndex == this.cells.length-1) {
         this.cellIndex = 0;
      }
      else {
         this.cellIndex++;
      }
   },
   
   paint: function (context) {
      var cell = this.cells[this.cellIndex];
      var _this = this;
      context.save();
	   		context.drawImage(spritesheet, cell.left, cell.top,
                                     cell.width, cell.height,
                                     _this.startX, _this.startTop,
                                     cell.width, cell.height);
	   	context.restore();
   },

   changeXPos: function() {
   	this.startX += this.verX;
   	if(this.startX <= 0) {
   		this.startX = ww - 40;
   		this.verX = this.verX;
   	}  
   }
};


//画背景
var bg = {

	skyOffset: 0,
	verX: 1,

	draw: function() {
		context.save();
		this.skyOffset = this.skyOffset <= canvas.width ?
               this.skyOffset + this.verX : 0;

	  context.save();
	  context.translate(-this.skyOffset, 0);

	  context.drawImage(sky, 0, 0,ww,wh);
	  context.drawImage(sky, ww-2, 0,ww,wh);

	  context.restore();
	}
};

var sprite = new SpriteSheetPainter(runnerCells);
	sky.onload = function(e) {
    bg.draw();
    
  };
	spritesheet.onload = function(e) {
		 context.clearRect(0,0,canvas.width,canvas.height);
	   context.drawImage(spritesheet, 0, 0,ww,wh/10);
	   
     canvas.onclick = function() {
      timer2 = setInterval(function() {console.log(1);
                        SpriteSheetPainter.prototype.startTop = SpriteSheetPainter.prototype.startTop - 6;
                        sprite.changeXPos();
                        runflag = false;
                        if (SpriteSheetPainter.prototype.startTop == 40) {
                            clearInterval(timer2);
                            runflag = true;
                            SpriteSheetPainter.prototype.startTop = 100;
                        }

                     },50);
     }
    if(runflag){
           sprite.advance();}
	   sprite.paint(context);
	   sprite.changeXPos();
	};

	
  var timer,timer2,runflag = true;

	timer = window.setInterval(function() {sky.onload();spritesheet.onload();},100);
  /*sky.onload();
  spritesheet.onload();*/
