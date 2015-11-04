/**
 *打飞机游戏
 *Created by Jch
 *
 *
 */

 //游戏入口

var game = new Game();

function gameInit() {
	if(game.init())
		game.start();
}


/**
 * Game对象
 */
function Game() {
	var wh = window.innerHeight,
		ww = window.innerWidth;
	this.init = function() {
		//获取canvas上下文
		this.bgCavs = $$('background');
		this.mainCavs = $$('main');
		this.shipCavs = $$('ship-move');
		if (this.bgCavs.getContext) {
			//背景
			this.bgContext = this.bgCavs.getContext('2d');
			//子弹。。。
			this.mainContext = this.mainCavs.getContext('2d');
			//玩家飞船
			this.shipContext = this.shipCavs.getContext('2d');

			Background.prototype.context = this.bgContext;
			this.bgCavs.width = ww;
			this.bgCavs.height = wh;
			Background.prototype.cavsWidth = ww;
			Background.prototype.cavsHeight = wh;

			Ship.prototype.context = this.shipContext;
			this.shipCavs.width = ww;
			this.shipCavs.height = wh;
			Ship.prototype.cavsWidth = ww;
			Ship.prototype.cavsHeight = wh;

			Bullet.prototype.context = this.mainContext;
			Bullet.prototype.cavsWidth = ww;
			Bullet.prototype.cavsHeight = wh;

			EnemyShip.prototype.context = this.mainContext;
			this.mainCavs.width = ww;
			this.mainCavs.height = wh;
			EnemyShip.prototype.cavsWidth = ww;
			EnemyShip.prototype.cavsHeight = wh;


			//初始背景对象
			this.background = new Background();
			this.background.init(0, 0, ww, wh);

			//初始飞机对象

			this.ship = new Ship();
			var shipStartX = this.shipCavs.width/2 - imageRepository.spaceship.width;
			var shipStartY = this.shipCavs.height/4*3 + imageRepository.spaceship.height*2;
			this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
			               imageRepository.spaceship.height);

			//敌军飞船
			this.enemyShip = new Box(2);
			this.enemyShip.init("enemy");
			this.enemyMove = function() {
				var eStartX = (ww - 20) * Math.random();
				var eStartY = -20 *Math.random() + -10;
				var eStartV = 3 * Math.random() + 2;
				this.enemyShip.get(eStartX, eStartY, eStartV);
			}
			//this.enemyArr = this.enemyShip.getPool();
			this.getP = new ObjProp();
			//初始敌军子弹量
			this.enemyBBox = new Box(100);
			this.enemyBBox.init("enemyBullet");

			return true;
		} else {return false;}
	};

	//game start
	this.start = function() {
		this.ship.draw();
		game.ship.move();
		animate();
	}
}

/**
 * 动画函数
 */
 function animate() {
	requestAnimFrame( animate );
	game.background.draw();
	game.ship.autoFire();
	//game.ship.draw();
	game.ship.bulletPool.animate(); 
	game.enemyShip.animate();
	game.enemyMove();
	game.enemyBBox.animate();

	game.getP.clear();
	game.getP.inset(game.enemyShip.getPool());
	game.getP.inset(game.enemyBBox.getPool());
	game.getP.inset(game.ship.bulletPool.getPool());
	//game.getP.print();
	DetectCollision();
}

/**
 * 游戏图片资源对象
 */
var imageRepository = new function() {

	this.background = new Image();
	this.spaceship = new Image();
	this.bullet = new Image();
	this.enemy = new Image();
	this.enemyBullet = new Image();

	var numImages = 5;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.gameInit();
		}
	}
	this.background.onload = function() {
		imageLoaded();
	}
	this.spaceship.onload = function() {
		imageLoaded();
	}
	this.bullet.onload = function() {
		imageLoaded();
	}
	this.enemy.onload = function() {
		imageLoaded();
	}
	this.enemyBullet.onload = function() {
		imageLoaded();
	}
	
	this.background.src = "imgs/bg.png";
	this.spaceship.src = "imgs/ship.png";
	this.bullet.src = "imgs/bullet.png";
	this.enemy.src = "imgs/enemy.png";
	this.enemyBullet.src = "imgs/bullet-enemy.png"
}

/**
 * 游戏中所有可动对象都继承的函数
 */
 function RemoveAble() {
 	this.init = function(x, y, width, height) {
 		//默认参数
 		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};

		this.speed = 0;
		this.isColliding = false;
		this.type = "";

		//默认方法
		this.draw = function() {
		};
		this.move = function() {
		};
 }

 /**
  * 游戏背景
  */
function Background() {
	this.speed = 1; //游戏画面移动速度
	
	// 画背景
	this.draw = function() {var _this = this;
		this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y, this.width, this.height);
		
		// 实现背景无缝移动
		this.context.drawImage(imageRepository.background, this.x, this.y - this.height, this.width, this.height);

		if (this.y >= this.height)
			this.y = 0;
	};
}
// 让背景继承可移动方法
Background.prototype = new RemoveAble();

/**
 * 子弹对象
 */
 function Bullet(obj) {
 	var object = obj;
	this.alive = false; // 判断子弹是否在用
	
	//生产子弹
	this.set = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	//画子弹
	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width, this.height);
		if(object === "userBullet") this.y -= this.speed;
		else if(object === "enemyBullet") this.y += this.speed;
		
		if(object === "userBullet" && (this.y <= 0 - this.height || this.isCollided )){
			return true;
		}
		else if(object === "enemyBullet" && (this.y >= window.innerHeight || this.isCollided )) { 
			return true;
		}
		else {
			if(object === "userBullet") {
				this.context.drawImage(imageRepository.bullet, this.x, this.y);
			}
			else if(object === "enemyBullet") {
				this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
			}
		}
	};
	
	//清除
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
		this.isCollided = false;
	};
}
Bullet.prototype = new RemoveAble();

/**
 * 子弹等对象的盒子
 *
 */

function Box(maxSize) {
	var size = maxSize; 
	var pool = [];
	
	//添加子弹、敌人飞船、子弹
	this.init = function(obj) {
		if(obj === "userBullet") { //玩家子弹
			for (var i = 0; i < size; i++) {
			
				var bullet = new Bullet("userBullet");
				bullet.init(0, 0, imageRepository.bullet.width,
				            imageRepository.bullet.height);
				bullet.type = "bullet";
				bullet.isCollided = false;
				bullet.collideWith = "enemy";
				pool[i] = bullet;
			}
		} 
		else if(obj === "enemy") { //敌人飞船
			for(var i = 0; i < size; i++) {
				var enemy = new EnemyShip();
				//var startX = window.innerWidth * Math.random();
				enemy.init(0, 0, imageRepository.enemy.width,
				            imageRepository.enemy.height);
				enemy.type = "enemy";
				enemy.isCollided = false;
				enemy.collideWith = "Ship";
				pool[i] = enemy;
			}
			
		}
		else if(obj === "enemyBullet") {
			for(var i = 0; i < size; i++) {
				var enemyBullet = new Bullet("enemyBullet");
				enemyBullet.init(0, 0, imageRepository.enemyBullet.width,
				            imageRepository.enemyBullet.height);
				enemyBullet.type = "enemyBullet";
				enemyBullet.isCollided = false;
				enemyBullet.collideWith = "Ship";
				pool[i] = enemyBullet;
			}
		}
		
	};
	
	//获得pool数组
	this.getPool = function() {
		var obj = [];
		for (var i = 0; i < size; i++) {
			if (pool[i].alive) {
				obj.push(pool[i]);
			}
		}
		return obj;
	};

	//发射一颗子弹
	this.get = function(x, y, speed) {
		if(!pool[size - 1].alive) {
			pool[size - 1].set(x, y, speed);
			pool.unshift(pool.pop());
		}
	};
	
	//反射两颗子弹
	this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
		if(!pool[size - 1].alive && 
		   !pool[size - 2].alive) {
				this.get(x1, y1, speed1);
				this.get(x2, y2, speed2);
			 }
	};
	
	//子弹的移动
	this.animate = function() {
		for (var i = 0; i < size; i++) {
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};
}

/**
 * 玩家飞船
 */

 function Ship() {
	
	this.bulletPool = new Box(100);
	this.bulletPool.init("userBullet");

	this.alive = true; //判断生存
	this.isCollided = false; //判断发生碰撞
	this.type = "Ship"; //该对象
	this.collideWith = "enemyBullet";

	var fireRate = 10;
	var counter = 0;
	/**
	 * 画船
	 */
	this.draw = function() {
		if (!this.isCollided) this.context.drawImage(imageRepository.spaceship, this.x, this.y);
		else this.context.clearRect(this.x, this.y, this.width, this.height);
	};

	/**
	 *飞船移动
	 */
	this.move = function() {	
		
		var _this = this,
			clickX = 0, 
			clickY = 0,
			isMove = false;
		//this.draw();
		var touchMove = function(e) {
			var point = e.targetTouches[0];
			_this.x = point.pageX;
			_this.y = point.pageY;
		}
		var touchEnd = function(e) {
			var point = e.targetTouches[0];
			_this.x = point.pageX;
			_this.y = point.pageY;
		}
		var shipCavs = $$('ship-move');

		addEvevt(shipCavs,'touchstart',function(e) {
			if(e.targetTouches.length == 1) {
				_this.context.clearRect(_this.x, _this.y, _this.width, _this.height);
				var point = e.targetTouches[0];
				if(Math.abs(point.pageX - _this.x) <= _this.width && 
					Math.abs(point.pageY - _this.y) <= _this.height) {
					isMove = true;
					_this.x = point.pageX;
					_this.y = point.pageY;
					_this.draw();
				}
			}
			
		});

		addEvevt(shipCavs,'touchmove',function(e) {
			if(e.targetTouches.length == 1 && isMove) {
				_this.context.clearRect(_this.x, _this.y, _this.width, _this.height);
				var point = e.targetTouches[0];
					_this.x = point.pageX;
					_this.y = point.pageY;
					_this.draw();
				}			
		});

		addEvevt(shipCavs,'touchmove',function(e) {
			_this.context.clearRect(_this.x, _this.y, _this.width, _this.height);
			isMove = false;
			touchEnd(e);
			_this.draw();
			
		});
		// addEvevt(shipCavs,'touchstart',function(e) {
		// 	console.log(clickX);
		// 	var point = e.targetTouches[0],
		// 	    isMove = ((clickX > _this.x && clickX < _this.x + _this.width) &&
		// 	    		(clickY > _this.y && clickY < _this.y + _this.height));
		// 	clickX = point.pageX;
		// 	clickY = point.pageY;console.log(clickX);console.log(isMove)

		// 	_this.context.clearRect(_this.x, _this.y, _this.width, _this.height);
		// 	addEvevt(shipCavs, 'touchmove', function(e) {
				
		// 		if(isMove) {
		// 			_this.context.clearRect(_this.x, _this.y, _this.width, _this.height);
		// 			clickX = 0;
		// 			clickY = 0;
		// 			touchMove(e);
					
		// 			_this.draw();
		// 		}
				
		// 	});
		// 	addEvevt(shipCavs, 'touchend', function(e) {
				
		// 		if (isMove) {
		// 			_this.context.clearRect(_this.x, _this.y, _this.width, _this.height);
		// 			clickX = 0;
		// 			clickY = 0;
		// 			touchEnd(e);
					
		// 			_this.draw();
		// 		}
				
		// 	});
			
		// });
		
	};
	/**
	 *自动开炮
	 */
	 this.autoFire = function() {
	 	counter++;
	 	//if(fireRate == 16) fireRate = 4;
	 	//setTimeout(function() {fireRate = 15;},3000);
	 	if (counter >= fireRate && !this.isCollided) {
			this.fire()
			counter = 0;
		}
	 }
	/*
	 * 两颗子弹
	 */
	this.fire = function() {
		this.bulletPool.getTwo(this.x + 6, this.y, 4,
		                       this.x + 33, this.y, 4);
	};
}
Ship.prototype = new RemoveAble();

/**
 * 敌人飞船
 *
 */
 function EnemyShip() {
 	this.alive = false; // 判断敌人是否在用
 	this.isCollided = false; // 判断是否发生碰撞
 	this.type = "EnemyShip"; // 对象名
 	this.collideWith = "userBullet"; // 碰撞对象

 	var fireRate = 80,
 		counter = 0;
	
	//生产敌人飞船
	this.set = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	//画敌人飞船
	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.y += this.speed;
		counter++;
		if (this.y >= this.cavsHeight || this.isCollided) {
			return true;
		}
		else {
			this.context.drawImage(imageRepository.enemy, this.x, this.y);
			if(fireRate == counter) {
				counter = 0;
				this.fire();
			}

		}
		

	};
	
	//开炮
	this.fire = function() {
		game.enemyBBox.get(this.x + this.width/2, this.y + this.height, this.speed + 5);
	}

	//清除
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
		this.isCollided = false;
	};
 }

EnemyShip.prototype = new RemoveAble();

/**
 * 获取各个对象的属性
 */

 function ObjProp() {
 	var objects = []; //存放对象属性

 	this.inset = function(obj) {
 		if(typeof obj === "undefined") {
 			console.log("没有传入参数");
 			return;
 		}

 		if(obj instanceof Array) {
 			for(var i = 0, len = obj.length; i < len; i++) {
 				this.inset(obj[i]);
 			}
 			return;
 		}
 		objects.push(obj);
 	};
 	this.print = function() {
 		console.log(objects)
 	};
 	this.clear = function() {
 		objects = [];
 	};
 	this.getObj = function(objArr) {
 		if(typeof objArr === "undefined") {
 			console.log("没有传入参数");
 			return;
 		}

 		for(var i = 0, len = objects.length; i < len; i++) {
 			objArr.push(objects[i]);
 		}

 		return objArr;
 	}
 }

 /**
  * 碰撞检测
  *
  */
 
 function DetectCollision() {
 	var objects = [];

 	game.getP.getObj(objects);

 	for(var i = 0; i < objects.length; i++) {
 		
 		 for(var j = 0; j < objects.length; j++) {
 		 	//玩家子弹与敌人碰撞判断
 		 	 if(objects[i].collideWith === objects[j].type &&
	 	 	 	  ( objects[i].x < objects[j].x + objects[j].width &&
	 	 	 		objects[i].x + objects[i].width > objects[j].x &&
	 	 	 		objects[i].y + objects[i].height > objects[j].y &&
	 	 	 		objects[i].y <  objects[j].y + objects[j].height )
 		 	 	) {
 		 	 	objects[i].isCollided = true;
 		 	 	objects[j].isCollided = true;
 		 	}

 		 	//玩家飞船与敌人子弹、飞船碰撞判断
 		 	if(objects[j].collideWith === "Ship" &&
	 	 	 	  ( game.ship.x < objects[j].x + objects[j].width &&
	 	 	 		game.ship.x + game.ship.width > objects[j].x &&
	 	 	 		game.ship.y + game.ship.height > objects[j].y &&
	 	 	 		game.ship.y <  objects[j].y + objects[j].height )
	 	 	 	  ) {
 		 		game.ship.isCollided = true;
 		 		objects[j].isCollided = true;
 		 	}
 		 }
 	}

 }
