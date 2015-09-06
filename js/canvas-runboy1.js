
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
   this.len = this.cells.length;
   console.log(this.len);
};

SpriteSheetPainter.prototype = {
   cellIndex: 0,
   startTop: wh-80,
   startX: 40,
   verX: 10,
   changeXPosFlag: false,

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
   	if(this.startX >= ww/2) {
   		this.verX = 0;
        this.changeXPosFlag = true;
   	}  else if(this.changeXPosFlag && this.startX <= ww/2) {
        this.verX = -this.verX;
        this.changeXPosFlag = false;
    }
   },

   animate: function() {
        var _this = this;

        if(runflag) { sprite.advance();}
           sprite.paint(context);
           sprite.changeXPos();
   }
};

canvas.onclick = function() {
            //var _cellIndex = sprite.cellIndex;
            //_this.cellIndex = 0;

          timer2 = setInterval(function() {
                            sprite.startTop = sprite.startTop - 5;
                            sprite.changeXPos();
                            runflag = false;
                            if (sprite.startTop == wh-120) {
                                clearInterval(timer2);
                                runflag = true;
                                //_this.cellIndex = _cellIndex;
                                sprite.startTop = wh-80;
                            }

                         },30);
         }
//draw the background
var bg = {

	skyOffset: 10,
    grassOffset: 0,
    farTreeOffset: 0,
    nearTreeOffset: 0,

	skyVx: 0.8,
    grassVx: 6,
    farVx: 2,
    nearVx: 6,
    //draw translate image function
    transFn: function(offset, Vx, arr) {
        var arr = arr;
        context.save();
            bg[offset] = bg[offset] < ww ?  bg[offset] + bg[Vx] : bg[Vx];
            context.translate(-bg[offset], 0);
            for( var i = 0; i<arr.length; i++) {
                context.drawImage(arr[i].img, arr[i].sx, arr[i].sy, arr[i].imgW, arr[i].imgH);
            }
        context.restore();
    },

    //draw day's sky
    drawDSky: function() {
      //draw  day's sky

        var imgArr = [
                    {img: sky, sx: 0, sy: 0, imgW: ww, imgH: wh},
                    {img: sky, sx: ww-2, sy: 0, imgW: ww, imgH: wh}
                ]
        this.transFn('skyOffset', 'skyVx', imgArr);
    },

    //draw night's sky
    drawNSky: function() {
      //draw night's sky
        context.save();
            var skystyle = context.createRadialGradient( ww/2,wh,0, ww/2,wh,wh);
                skystyle.addColorStop(0.0,' rgb(13, 54, 108)');
                skystyle.addColorStop(1.0,'rgb(14, 15, 16)');
            context.fillStyle = skystyle;
            context.fillRect(0,0,ww,wh);
        context.restore();
    },

    //draw grass and tree
	drawGT: function() {

        var gH = grass.height,
            fTH = farTree.height,
            fTW = farTree.width,
            nTH = nearTree.height,
            nTW = nearTree.width,
            grassArr = [
                {img: grass, sx: 0, sy: wh-gH, imgW: ww, imgH: gH},
                {img: grass, sx: ww-2, sy: wh-gH, imgW: ww, imgH: gH},
                {img: grass, sx: 0, sy: wh-gH - 25, imgW: ww, imgH: gH},
                {img: grass, sx: ww-2, sy: wh-gH - 25, imgW: ww, imgH: gH},
                {img: grass, sx: 0, sy: wh-gH -50, imgW: ww, imgH: gH},
                {img: grass, sx: ww-2, sy: wh-gH -50, imgW: ww, imgH: gH}
            ],
            fTArr = [
                {img: farTree, sx: 0, sy: wh-fTH-60, imgW: fTW, imgH: fTH},
                {img: farTree, sx: ww, sy: wh-fTH-60, imgW: fTW, imgH: fTH},
                {img: farTree, sx: ww/3, sy: wh-fTH-60, imgW: fTW, imgH: fTH},
                {img: farTree, sx: ww+ww/3, sy: wh-fTH-60, imgW: fTW, imgH: fTH},
                {img: farTree, sx: ww/3*2, sy: wh-fTH-60, imgW: fTW, imgH: fTH},
                {img: farTree, sx: ww/3*2 + ww, sy: wh-fTH-60, imgW: fTW, imgH: fTH}
            ],
            nTArr = [
                {img: nearTree, sx: 0, sy: wh-nTH-40, imgW: nTW, imgH: nTH},
                {img: nearTree, sx: ww, sy: wh-nTH-40, imgW:nTW, imgH: nTH},

            ];
            this.transFn('grassOffset', 'grassVx', grassArr);
            this.transFn('farTreeOffset', 'farVx', fTArr);
            this.transFn('nearTreeOffset', 'nearVx', nTArr);
	}
};

//draw shape
var shape = {
    // star
    spArr: [],
    star: function(sr, br, mx, my, rot, alpha) {
        context.save();
            context.beginPath();
            for(var i = 0;i<5;i++) {
                var bx = Math.cos((18+72*i-rot)/180*Math.PI);
                var by = Math.sin((18+72*i-rot)/180*Math.PI);
                var sx = Math.cos((54+72*i-rot)/180*Math.PI);
                var sy = Math.sin((54+72*i-rot)/180*Math.PI);

                context.lineTo(bx*br+mx,-by*br+my);
                context.lineTo( sx*sr+mx, -sy*sr+my);
            }
            context.fillStyle = 'rgba(241, 241, 79,'+ alpha +')';
            context.fill();
            context.closePath();
        context.restore();
    },

    //get star position
    starPos: function() {
        var n, _sr, _br, _mx, _my, _rot, _alpha, aVx, posBox,flag = true;
        if(ww <= 500) n = 40;
        else n = 70;
        for( var i = 0;i < n;i++) {
            _sr = Math.random() * 1 + 2;
            _br = Math.random() * 3 + 5;
            _mx = Math.random() * (ww - 9) + 4;
            _my = Math.random() * wh/2.5 + 9;
            _rot = Math.random() * 80;
            _alpha = Math.random() * 0.7;
            aVx = Math.random() * 0.1;
            posBox = {
                        sr: _sr,
                        br: _br,
                        mx: _mx,
                        my: _my,
                        rot: _rot,
                        alpha: _alpha,
                        avx: aVx
                     };
            if( this.spArr.length < 1) {
                this.spArr.push(posBox);
            }
            //判断星星重叠
            else {
                for( var j = 0;j < this.spArr.length; j++) {
                            if(_mx > this.spArr[j].mx - 1 && _mx < this.spArr[j].mx + 1) { flag = false;break;}
                        }
                if(flag) this.spArr.push(posBox);
            }
        }

    },

    //update alpha
    updateAl: function() {
         for( var i = 0; i<this.spArr.length; i++) {
            this.spArr[i].alpha += this.spArr[i].avx;
            if(this.spArr[i].alpha >= 0.9) this.spArr[i].avx = -this.spArr[i].avx;
            if(this.spArr[i].alpha <= 0.4)   this.spArr[i].avx = Math.abs(this.spArr[i].avx);
        }
    },

    //draw star
    drawStar: function() {
       for( var i = 0; i<this.spArr.length; i++) {
            this.star(this.spArr[i].sr, this.spArr[i].br,
                      this.spArr[i].mx,this.spArr[i].my,
                      this.spArr[i].rot,this.spArr[i].alpha
                     );
       }
    }
};

var sprite = new SpriteSheetPainter(runnerCells);

    shape.starPos();
	sky.onload = function(e) {
        bg.drawDSky();
        if(timeFlag > 100){
            bg.drawNSky();
            shape.updateAl();
            shape.drawStar();
        }
        bg.drawGT();
        
        SpriteSheetPainter.prototype.animate();
    
  };
  var timer,timer2,runflag = true,timeFlag = 0;

	timer = window.setInterval(function() {sky.onload();timeFlag++;if(timeFlag == 200) timeFlag = 0;},100);

