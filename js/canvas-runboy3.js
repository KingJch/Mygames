
//全局变量
var canvas = document.getElementById('canvas'),
	context = canvas.getContext("2d");
	wh = window.innerHeight,
	ww = window.innerWidth,
	canvas.height = wh,
	canvas.width = ww,
  runnerCells = [
    { left: 0,   top: 0, width: 40, height: 64 },
    { left: 43,  top: 0, width: 47, height: 64 },
    { left: 94, top: 0, width: 51, height: 64 },
    { left: 147, top: 0, width: 51, height: 64 },
    { left: 202, top: 0, width: 56, height: 64 },
    { left: 262, top: 0, width: 48, height: 64 },
    { left: 313, top: 0, width: 43, height: 64 },
    { left: 360, top: 0, width: 50, height: 64 },
    { left: 411, top: 0, width: 50, height: 64 },
  ],
  spritesheet = new Image(),  //images
  grass = new Image(),
 farTree = new Image(),
  nearTree = new Image(),
    sky = new Image();

  spritesheet.src = 'images/running-sprite-sheet.png';
  grass.src = 'images/grass.png';
  farTree.src = 'images/smalltree.png';
  nearTree.src = 'images/tree-twotrunks.png';
  sky.src = 'images/sky.png'
	
/** function
=========================================**/

//run sprite
SpriteSheetPainter = function (cells) {
   this.cells = cells;
};

SpriteSheetPainter.prototype = {
   cellIndex: 9,
   startTop: canvas.height-80,
   startX: 40,
   verX: 10,
   changeXPosFlag: false,

   //转换图片
   advance: function () {
      if (this.cellIndex == 0) {
         this.cellIndex = this.cells.length-1;
      }
      else {
         this.cellIndex--;
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
   	if(this.startX >= canvas.width/2) {
   		this.verX = 0;
        this.changeXPosFlag = true;
   	}  else if(this.changeXPosFlag && this.startX <= canvas.width/2) {
        this.verX = -this.verX;
        this.changeXPosFlag = false;
    }
   },

   animate: function() {
        var _this = this;

         canvas.onclick = function() {
            var _cellIndex = _this.cellIndex;
            _this.cellIndex = 0;

          timer2 = setInterval(function() {
                            SpriteSheetPainter.prototype.startTop = SpriteSheetPainter.prototype.startTop - 4;
                            sprite.changeXPos();
                            runflag = false;
                            if (SpriteSheetPainter.prototype.startTop == canvas.height-100) {
                                clearInterval(timer2);
                                runflag = true;
                                _this.cellIndex = _cellIndex;
                                SpriteSheetPainter.prototype.startTop = canvas.height-80;
                            }

                         },50);
         }

        if(runflag) { sprite.advance();}
           sprite.paint(context);
           sprite.changeXPos();
   }
};


//draw the background
var bg = {

	skyOffset: 0,
    grassOffset: 0,
    farTreeOffset: 0,
    nearTreeOffset: 0,

	skyVx: 0.8,
    grassVx: 6,
    farVx: 2,
    nearVx: 6,


	draw: function() {
      //draw sky
		context.save();
    		this.skyOffset = this.skyOffset < canvas.width ? this.skyOffset + this.skyVx : this.skyVx;
    	    context.translate(-this.skyOffset, 0);
    	    context.drawImage(sky, 0, 0,ww,wh);
    	    context.drawImage(sky, ww-2, 0,ww,wh);
	    context.restore();

      //draw grass
        context.save();
            this.grassOffset = this.grassOffset < canvas.width ? this.grassOffset + this.grassVx : this.grassVx;
            context.translate(-this.grassOffset, 0);
            context.drawImage(grass, 0, canvas.height-grass.height,ww, grass.height);
            context.drawImage(grass, ww-2, canvas.height-grass.height, ww,grass.height);
            context.drawImage(grass, 0, canvas.height-grass.height - 25,ww, grass.height);
            context.drawImage(grass, ww-2, canvas.height-grass.height - 25, ww,grass.height);
            context.drawImage(grass, 0, canvas.height-grass.height - 50,ww, grass.height);
            context.drawImage(grass, ww-2, canvas.height-grass.height - 50, ww,grass.height);
        context.restore();

      //draw farTree
        context.save();
            this.farTreeOffset = this.farTreeOffset < canvas.width ? this.farTreeOffset + this.farVx : this.farVx;
            context.translate(-this.farTreeOffset, 0);
            context.drawImage(farTree, 0, canvas.height-farTree.height-60, farTree.width, farTree.height);
            context.drawImage(farTree, 0 + ww, canvas.height-farTree.height-60, farTree.width, farTree.height);
            context.drawImage(farTree, ww/3, canvas.height-farTree.height-60, farTree.width, farTree.height);
            context.drawImage(farTree, ww/3+ww, canvas.height-farTree.height-60, farTree.width, farTree.height);
            context.drawImage(farTree, ww/3*2, canvas.height-farTree.height-60, farTree.width, farTree.height);
            context.drawImage(farTree, ww/3*2 + ww, canvas.height-farTree.height-60, farTree.width, farTree.height);
        context.restore();

      //draw nearTree
        context.save();
            this.nearTree = this.nearTree < canvas.width ? this.nearTree + this.nearVx : this.nearVx;
            context.translate(-this.nearTree, 0);
            context.drawImage(nearTree, 0, canvas.height-nearTree.height-40, nearTree.width, nearTree.height);
            context.drawImage(nearTree, 0 + ww, canvas.height-nearTree.height-40, nearTree.width, nearTree.height);
            //context.drawImage(nearTree, ww/2, canvas.height-nearTree.height-40, nearTree.width, nearTree.height);
            //context.drawImage(nearTree, ww/2+ ww, canvas.height-nearTree.height-40, nearTree.width, nearTree.height);
            //context.drawImage(nearTree, ww, canvas.height-nearTree.height-40, nearTree.width, nearTree.height);
            //context.drawImage(nearTree, 2* ww, canvas.height-nearTree.height-40, nearTree.width, nearTree.height);
        context.restore();
	}
};

var sprite = new SpriteSheetPainter(runnerCells);


	/*spritesheet.onload = function(e) {
		 //context.clearRect(0,0,canvas.width,canvas.height);
	   
	};*/

	sky.onload = function(e) {
        bg.draw();
        SpriteSheetPainter.prototype.animate();
    
  };
  var timer,timer2,runflag = true;

	timer = window.setInterval(function() {sky.onload();},100);
  /*sky.onload();
  spritesheet.onload();*/
