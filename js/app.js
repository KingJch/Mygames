/**
 *打飞机游戏
 *Created by Jch
 *
 *
 */

 //游戏入口

var game = new Game();

// function gameInit() {
// 	if(game.init())
// 		game.start();
// }


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

			EnemyBoss.prototype.context = this.mainContext;

			/*
			 * 分数、血量、金币计数变量
			 */
			 this.gameScore = 0;
			 this.shipLife = 3; //玩家生命值

			//初始背景对象
			this.background = new Background();
			this.background.init(0, 0, ww, wh);

			/*
			 *初始飞机对象
			 */
			 
			this.ship = new Ship();
			this.shipStartX = this.shipCavs.width/2 - imageRepository.spaceship.width/2;
			this.shipStartY = this.shipCavs.height - imageRepository.spaceship.height - 50;
			this.ship.init(this.shipStartX, this.shipStartY, imageRepository.spaceship.width,
			               imageRepository.spaceship.height);

			/*
			 *敌军飞船
			 */
			this.enemyShip = new Box(8);
			this.enemyShip.init("enemy");
			this.enemyMove = function() {
				var eStartX = (ww - 20) * Math.random();
				var eStartY = -20 *Math.random() + -10;
				var eStartV = Math.floor(3 * Math.random()) + 3;
				this.enemyShip.get(eStartX, eStartY, eStartV);
			}
			//this.enemyArr = this.enemyShip.getPool();
			this.getP = new ObjProp();
			//初始敌军子弹量
			//this.enemyBBox = new Box(6);
			//this.enemyBBox.init("enemyBullet");

			//enemyBoss1
			this.enemyBoss = new EnemyBoss();

			this.enemyBoss.init(this.mainCavs.width, -imageRepository.enemyBoss[0].height,
						   imageRepository.enemyBoss[0].width,
			               imageRepository.enemyBoss[0].height);

			this.enemyBoss.setSp(1, 1, 30, 0);

			//enemyBoss2
			this.enemyBoss1 = new EnemyBoss();

			this.enemyBoss1.init(-imageRepository.enemyBoss[1].width, -imageRepository.enemyBoss[1].height, 
						   imageRepository.enemyBoss[1].width,
			               imageRepository.enemyBoss[1].height);
			this.enemyBoss1.setSp(1.2, 0.8, 100, 1);

			//enemyBoss3
			this.enemyBoss3 = new EnemyBoss();

			this.enemyBoss3.init(this.mainCavs.width + 60, -imageRepository.enemyBoss[0].height,
						   imageRepository.enemyBoss[0].width,
			               imageRepository.enemyBoss[0].height);

			this.enemyBoss3.setSp(1, 1, 30, 0);


			/*
			 * 奖励血
			 */
			 this.isGetLifes = false; //判断血量是否与飞船相碰
			 this.isLifeMove = false; //判断血量是否移动
			 this.getLifes = new Box(1);
			 this.getLifes.init("shipLifes");
			 this.lifesMove = function() {
				var eStartX = (ww - 20) * Math.random();
				var eStartY = -20 *Math.random() + -10;
				var eStartV = 3 * Math.random() + 2;
				this.getLifes.get(eStartX, eStartY, eStartV);
			}
			/*
			 *游戏声音
			 */
			this.voicePool = new SoundPool(200);
			this.voicePool.init("explosion");

			this.backgroundAudio = new Audio("sounds/kick_shock.wav");
			this.backgroundAudio.loop = true;
			this.backgroundAudio.volume = .25;
			this.backgroundAudio.load();
			

			//游戏结束声音
			this.gameOverAudio = new Audio("sounds/game_over.wav");
			this.gameOverAudio.loop = true;
			this.gameOverAudio.volume = .55;
			this.gameOverAudio.load();

			this.checkAudio = window.setInterval(function(){checkReadyState()},1000);

			return true;
		} else {return false;}
	};

	/*
	 *开始游戏
	 */
	this.start = function() {
		this.ship.draw();
		game.ship.move();
		animate();
		this.backgroundAudio.play();
	}

	/*
	 * 游戏结束
	 */
	 this.gameOver = function() {
	 	this.backgroundAudio.pause();
		this.gameOverAudio.currentTime = 0;
	 	this.gameOverAudio.play();
	 }

	/*
	 *重新开始游戏
	 */
	 this.reStart = function() {
	 	this.gameOverAudio.pause();

	 	this.bgContext.clearRect(0, 0, this.bgCavs.width, this.bgCavs.height);
		this.shipContext.clearRect(0, 0, this.shipCavs.width, this.shipCavs.height);
		this.mainContext.clearRect(0, 0, this.mainCavs.width, this.mainCavs.height);

		this.getP.clear();

		this.background.init(0, 0, ww, wh);
		this.background.bgNum = 0;

		this.ship.init(this.shipStartX, this.shipStartY, imageRepository.spaceship.width,
			               imageRepository.spaceship.height);
		this.ship.alive = true;

		this.enemyShip.init("enemy");
		//this.enemyBBox.init("enemyBullet");

		this.gameScore = 0;
		this.shipLife = 3;

		this.backgroundAudio.currentTime = 0;
		this.backgroundAudio.play();

		this.start();
	 }
	  var restart = $$('restart-btn');
	 addEvevt(restart, 'touchstart', function() {game.reStart();$$('game-over').style.display = "none";});
	
}

/**
 * 动画函数
 */
 function animate() {
	
	game.shipLife = game.shipLife < 0 ? 0 : game.shipLife;
	document.getElementById('score').innerHTML = game.gameScore; //分数
	document.getElementById('life').innerHTML = game.shipLife; //生命值

	game.getP.clear();
	game.getP.inset(game.getLifes.getPool());
	game.getP.inset(game.enemyShip.getPool());
	game.getP.inset(game.ship.bulletPool.getPool());
	game.getP.inset(game.enemyBoss.bulletPool.getPool());
	game.getP.inset(game.enemyBoss1.bulletPool.getPool());
	DetectCollision();

	if(game.ship.alive) {

		requestAnimFrame( animate );

		game.background.draw();

		game.ship.autoFire();
		game.ship.draw();
		game.ship.bulletPool.animate(); 

		game.enemyShip.animate();
		game.enemyMove();

		//循环设定boss1的出现
		if(game.gameScore > 0 && game.gameScore % 2000 == 0) {
			game.enemyBoss.lifeCount = 30;
		}

		if(game.enemyBoss.lifeCount > 0 && game.gameScore > 1000) {
			game.enemyBoss.move();
		} else {game.enemyBoss.x = game.mainCavs.width + 60; game.enemyBoss.y = -60}

		game.enemyBoss.bulletPool.animate();

		//循环设定boss1的出现
		if(game.gameScore > 0 && game.gameScore % 3000 == 0) {
			game.enemyBoss3.lifeCount = 30;
		}

		if(game.enemyBoss3.lifeCount > 0 && game.gameScore > 1500) {
			game.enemyBoss3.move();
		} else {game.enemyBoss3.x = -60; game.enemyBoss3.y = -60}

		game.enemyBoss3.bulletPool.animate();

		//循环设定boss2的出现
		if(game.gameScore > 0 && game.gameScore % 5000 == 0) {
			game.enemyBoss1.lifeCount = 100;
		}

		if(game.enemyBoss1.lifeCount > 0 && game.gameScore > 8000) {
			game.enemyBoss1.move();
		} else {game.enemyBoss1.x = -120; game.enemyBoss1.y = -60}

		game.enemyBoss1.bulletPool.animate();


		if(game.gameScore > 0 &&　game.gameScore % 3000 == 0) {
			game.isLifeMove = true;
		}
		if(game.gameScore > 0 && game.isLifeMove) {
			game.lifesMove();
		}
		game.getLifes.animate();
		
	}
	
}

/**
 * 游戏图片资源对象
 */
var imageRepository = new function() {

	this.background = new Array(4); //不同关卡背景图
	for(var i = 0; i < this.background.length; i++) {
		this.background[i] = new Image();
	}

	//boss
	this.enemyBoss = new Array(2);
	for(var i = 0; i < this.enemyBoss.length; i++) {
		this.enemyBoss[i] = new Image();
	}

	this.spaceship = new Image();
	this.bullet = new Image();
	this.enemy = new Image();
	
	this.enemyBullet = new Image();
	this.shipLifes = new Image();

	var numImages = 10;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			game.init();	
		}
	}
	for(var i = 0; i < this.background.length; i++) {
		this.background[i].onload = function() {
			imageLoaded();
		}
	}
	
	for(var i = 0; i < this.enemyBoss.length; i++) {
		this.enemyBoss[i].onload = function() {
			imageLoaded();
		}
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
	this.shipLifes.onload = function() {
		imageLoaded();
	}
	
	for(var j = 0; j < this.background.length; j++) {
		this.background[j].src = 'imgs/bg' + j +'.jpg';
	 }
	
	for(var j = 0; j < this.enemyBoss.length; j++) {
		this.enemyBoss[j].src = 'imgs/enemyBoss' + j +'.png';
	 }

	this.spaceship.src = "imgs/ship.png";
	this.bullet.src = "imgs/bullet.png";
	this.enemy.src = "imgs/enemy1_fly_1.png";
	this.enemyBullet.src = "imgs/bullet-enemy.png";
	this.shipLifes.src = "imgs/life.png";
}

/**
 * 声音资源
 * 
 */

//加载声音资源
 function checkReadyState() {
	if (game.gameOverAudio.readyState === 4 && game.backgroundAudio.readyState === 4) {
		window.clearInterval(game.checkAudio);
		$$('loading-wapper').style.display = "none";
		$$('start-wapper').style.display = "block";
		var startBtn = $$('start-btn');
		addEvevt(startBtn, 'touchstart', function() {
			$$('start-wapper').style.display = "none";
			$$('game-wappeer').style.display = "block";
			game.start();
		});
		//game.start();
	}
}


function SoundPool(maxSize) {
	var size = maxSize; 
	var pool = [];
	this.pool = pool;
	var currSound = 0;

	/*
	 * 声音种类
	 */
	this.init = function(object) {
		if (object === "laser") {
			for (var i = 0; i < size; i++) {
				laser = new Audio("sounds/laser.wav");
				laser.volume = .12;
				laser.load();
				pool[i] = laser;
			}
		}
		else if (object === "explosion") {
			for (var i = 0; i < size; i++) {
				var explosion = new Audio("sounds/explosion.wav");
				explosion.volume = .1;
				explosion.load();
				pool[i] = explosion;
			}
		}
	};

	/**
	 * 播放
	 */
	this.get = function() {
		if(pool[currSound].currentTime == 0 || pool[currSound].ended) {
			pool[currSound].play();
		}
		currSound = (currSound + 1) % size;
	};
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
	this.bgNum = 0;
	
	// 画背景
	this.draw = function() {var _this = this;
		this.y += this.speed;
		if(game.gameScore > 4000 && game.gameScore < 7500) this.bgNum = 1;
		else if(game.gameScore > 7500 && game.gameScore < 18000) this.bgNum = 2;
		else if(game.gameScore > 15000) this.bgNum = 3;
		this.context.drawImage(imageRepository.background[this.bgNum], this.x, this.y, this.width, this.height);
		
		// 实现背景无缝移动
		this.context.drawImage(imageRepository.background[this.bgNum], this.x, this.y - this.height, this.width, this.height);

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
		this.context.clearRect(this.x, this.y, this.width + 5, this.height + 5);
		/*
		 * 对象移动
		 */
		if(object === "userBullet") this.y -= this.speed;
		else if(object === "enemyBullet" || object === "shipLifes") this.y += this.speed;

		/*
		 *判断对象存亡
		 */
		if(object === "userBullet" && (this.y <= 0 - this.height || this.isCollided )){
			return true;
		}
		else if(object === "enemyBullet" && (this.y >= window.innerHeight || this.isCollided )) {
			
			return true;
		}
		else if(object === "shipLifes" && (this.y >= window.innerHeight || this.isCollided )) {
			game.isLifeMove = false;
			return true;
		}
		else {
			if(object === "userBullet") {
				this.context.drawImage(imageRepository.bullet, this.x, this.y);
			}
			else if(object === "enemyBullet") {
				this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
			}
			else if(object === "shipLifes") {
				this.context.drawImage(imageRepository.shipLifes, this.x, this.y);
			}
		}

		// if(object === "enemyBullet" && this.isCollided ) {
		// 	game.voicePool.get();console.log(0)
		// }
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
				bullet.type = "userBullet";
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
		else if(obj === "shipLifes") {
			for(var i = 0; i < size; i++) {
				var shipLifes = new Bullet("shipLifes");
				shipLifes.init(0, 0, imageRepository.shipLifes.width,
				            imageRepository.shipLifes.height);
				shipLifes.type = "shipLifes";
				shipLifes.isCollided = false;
				shipLifes.collideWith = "ShipLifes";
				pool[i] = shipLifes;
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

	//反射3颗子弹
	this.getThree = function(x1, y1, speed1, x2, y2, speed2, x3, y3, speed3) {
		if(!pool[size - 1].alive && 
		   !pool[size - 2].alive && !pool[size - 3].alive ) {
				this.get(x1, y1, speed1);
				this.get(x2, y2, speed2);
				this.get(x3, y3, speed3);
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
	//this.collideWith = "enemyBullet";

	var fireRate = 15;
	var counter = 0;
	/**
	 * 画船
	 */
	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width + 5, this.height + 5);

		if(this.isCollided) {game.shipLife--; this.isCollided = false;} //玩家飞船被击中减血
		if(game.isGetLifes) {game.shipLife++; game.isGetLifes = false;} //玩家加血

		if (game.shipLife > 0) this.context.drawImage(imageRepository.spaceship, this.x, this.y);
		else {
			this.context.clearRect(this.x, this.y, this.width + 5, this.height + 5);
			if(game.gameScore > 5000 && game.gameScore < 15000) $$('rank').innerHTML = "太空上将";
				else if(game.gameScore > 15000 && game.gameScore < 25000) $$('rank').innerHTML = "宇宙上将";
				else if(game.gameScore > 25000) $$('rank').innerHTML = "宇宙司令";
			$$('game-over').style.display = "block";
			game.gameOver();
			this.alive = false;
		}
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

		//addEvevt('body',"touchstart",function() {console.log(11)});
		addEvevt(shipCavs,'touchstart',function(e) {
			e.preventDefault();
			if(e.targetTouches.length == 1) {
				//
				var point = e.targetTouches[0];
				//_this.draw();
				if((point.pageX >= _this.x && point.pageX <= _this.x + _this.width)  && 
					(point.pageY >= _this.y && point.pageY <= _this.y + _this.height) ) {
					_this.context.clearRect(_this.x, _this.y, _this.width, _this.height);
					isMove = true;
					_this.x = point.pageX - _this.width / 2;
					_this.y = point.pageY - _this.height / 2;
					
				}
			}
			
		});

		addEvevt(shipCavs,'touchmove',function(e) {
			e.preventDefault();
			if(e.targetTouches.length == 1 && isMove) {
				_this.context.clearRect(_this.x, _this.y, _this.width + 5, _this.height + 5);
				var point = e.targetTouches[0];
					_this.x = point.pageX - _this.width / 2;
					_this.y = point.pageY - _this.height / 2;
					_this.draw();
				}			
		});

		addEvevt(shipCavs,'touchend',function(e) {
			e.preventDefault();
			isMove = false;
			
		});
		
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

	
	//生产敌人飞船
	this.set = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	//画敌人飞船
	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width + 5, this.height + 5);
		this.y += this.speed;
		if (this.y >= this.cavsHeight || this.isCollided) {
			if(this.isCollided) {
				game.gameScore = game.gameScore + 10;
				game.voicePool.get();  //敌军爆炸的声音
			}
			return true;
		}
		else {
			this.context.drawImage(imageRepository.enemy, this.x, this.y);
		}
		

	};
	
	//开炮
	this.fire = function() {
		game.enemyBBox.get(this.x + this.width/2, this.y + this.height, this.speed + 2);
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
 * boss
 */
 function EnemyBoss() {

 	this.bulletPool = new Box(100);
	this.bulletPool.init("enemyBullet");

 	this.alive = true; // 判断敌人是否在用
 	this.isCollided = false; // 判断是否发生碰撞
 	this.type = "EnemyShip"; // 对象名
 	this.collideWith = "userBullet"; // 碰撞对象

 	var fireRate = 80,
 		counter = 0;
	
	//设置
	this.setSp = function(speedX, speedY, lifeC, bossNum) {
		this.speedX = speedX;
		this.speedY = speedY
		this.alive = true;
		this.lifeCount = lifeC;
		this.bossNum = bossNum;
	};

	//画敌人飞船
	this.move = function() {
		this.context.clearRect(this.x, this.y, this.width + 5, this.height + 5);

		this.x += this.speedX;
		this.y += this.speedY;

		if(this.x < 0) {
			this.speedX = Math.abs(this.speedX);
		} else if(this.x > game.bgCavs.width - this.width) {
			this.speedX = this.speedX > 0 ? -this.speedX : this.speedX;
		}

		if(this.y < this.height / 3) {
			this.speedY = Math.abs(this.speedY);
		} else if(this.y > game.bgCavs.height/3) {
			this.speedY = -this.speedY;
		}

		counter++;

		//boss减血
		if(this.isCollided) {
			this.lifeCount--;
		 	this.isCollided = false;
		 	game.voicePool.get();  //敌军爆炸的声音
		 } 

		if (this.lifeCount <= 0) {
				if(this.bossNum == 0) {game.gameScore = game.gameScore + 500;}
				else game.gameScore = game.gameScore + 1000;
				
			return true;
		}
		else {
			this.context.drawImage(imageRepository.enemyBoss[this.bossNum], this.x, this.y);
			if(fireRate == counter) {
				counter = 0;
				this.bossNum == 0 ? this.fireTwo() : this.fireThree();
			}

		}
		

	};
	
	/**
	 *自动开炮
	 */
	 this.autoFire = function() {
	 	counter++;

	 	if (counter >= fireRate && !this.isCollided) {
			this.fire();
			counter = 0;
		}
	 }
	/*
	 * 两颗子弹
	 */
	this.fireTwo = function() {
		this.bulletPool.getTwo(this.x + 6, this.y + this.height / 3, 5,
		                       this.x + this.width - 5, this.y + this.height / 3, 4);
	};
	/*
	 * 三颗子弹
	 */
	this.fireThree = function() {
		this.bulletPool.getThree(this.x + 6, this.y + this.height / 2, 4,
		                       this.x + this.width / 2, this.y + this.height / 4, 5,
		                       this.x + this.width - 6, this.y + this.height / 2, 4);
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
 EnemyBoss.prototype = new RemoveAble();
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

 		 	//玩家飞船与血量碰撞
 		 	if(objects[j].collideWith === "ShipLifes" &&
	 	 	 	  ( game.ship.x < objects[j].x + objects[j].width &&
	 	 	 		game.ship.x + game.ship.width > objects[j].x &&
	 	 	 		game.ship.y + game.ship.height > objects[j].y &&
	 	 	 		game.ship.y <  objects[j].y + objects[j].height )
	 	 	 	  ) {
 		 		game.isGetLifes = true;
 		 		objects[j].isCollided = true;
 		 	}

 		 	//玩家飞船与敌人boss1碰撞判断
 		 	if(objects[j].type === "userBullet" &&
	 	 	 	  ( game.enemyBoss.x < objects[j].x + objects[j].width &&
	 	 	 		game.enemyBoss.x + game.enemyBoss.width > objects[j].x &&
	 	 	 		game.enemyBoss.y + game.enemyBoss.height > objects[j].y &&
	 	 	 		game.enemyBoss.y <  objects[j].y + objects[j].height )
	 	 	 	  ) {
 		 		game.enemyBoss.isCollided = true;
 		 		objects[j].isCollided = true;
 		 	}

 		 	if(objects[j].type === "userBullet" &&
	 	 	 	  ( game.enemyBoss3.x < objects[j].x + objects[j].width &&
	 	 	 		game.enemyBoss3.x + game.enemyBoss3.width > objects[j].x &&
	 	 	 		game.enemyBoss3.y + game.enemyBoss3.height > objects[j].y &&
	 	 	 		game.enemyBoss3.y <  objects[j].y + objects[j].height )
	 	 	 	  ) {
 		 		game.enemyBoss3.isCollided = true;
 		 		objects[j].isCollided = true;
 		 	}

 		 	//玩家飞船与敌人boss2碰撞判断
 		 	if(objects[j].type === "userBullet" &&
	 	 	 	  ( game.enemyBoss1.x < objects[j].x + objects[j].width &&
	 	 	 		game.enemyBoss1.x + game.enemyBoss1.width > objects[j].x &&
	 	 	 		game.enemyBoss1.y + game.enemyBoss1.height > objects[j].y &&
	 	 	 		game.enemyBoss1.y <  objects[j].y + objects[j].height )
	 	 	 	  ) {
 		 		game.enemyBoss1.isCollided = true;
 		 		objects[j].isCollided = true;
 		 	}
 		 }
 	}

 }
