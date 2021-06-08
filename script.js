var ctx = document.getElementById("mainCanvas").getContext("2d");
var cW = $("#mainCanvas").width();
var cH = $("#mainCanvas").height();
var tW = 32, tH = 32;
var columns = cW / tW, rows = cH / tH;
var engineSpeed = 1000/30, gameSpeed = 1000/100;
var easystar = new EasyStar.js();
var tiles = [], chars = [];
var map = -1, score = 10, mode = -1, code = "";
var frightened = false, frightenedWait = 0, deadGhosts = 0;
var start = true, pause = true, titleScreen = true;
var hoverPT = false, hoverCL = false;
var checkPossibleMove, ghostTimer, frightTimer;

var maps = 	[	[[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
				[1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
				[1,1,0,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1,1],
				[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
				[1,0,1,1,0,0,1,0,1,0,0,0,1,0,1,0,0,1,1,0,1],
				[1,0,0,1,0,0,1,0,1,0,0,0,1,0,1,0,0,1,0,0,1],
				[1,1,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1,1],
				[1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,1,2,0,2,1,0,0,0,0,0,0,0,1],
				[1,0,1,1,0,0,1,0,1,1,1,1,1,0,1,0,0,1,1,0,1],
				[1,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,1],
				[1,1,0,1,0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,1,1],
				[1,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
				[1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
				[1,3,0,0,1,0,0,0,0,1,0,1,0,0,0,0,1,0,0,3,1],
				[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1]],
				
				[[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
				[1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,0,1],
				[1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
				[1,0,1,0,1,3,1,0,1,1,0,1,1,0,1,3,1,0,1,0,1],
				[1,0,1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1],
				[1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1],
				[1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
				[1,0,0,0,0,0,1,0,1,2,0,2,1,0,1,0,0,0,0,0,1],
				[1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1],
				[1,0,1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1],
				[1,0,1,0,1,3,1,0,1,1,0,1,1,0,1,3,1,0,1,0,1],
				[1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
				[1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,0,1],
				[1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
				[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1]],
				
				[[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
				[1,3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,3,1],
				[1,0,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,1,1,0,1,1,0,0,0,0,0,0,0,1,1,0,1,1,0,1],
				[1,0,1,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,1,0,1,0,0,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1],
				[1,1,0,1,1,1,1,0,1,2,0,2,1,0,1,0,0,1,0,1,1],
				[1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1],
				[1,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,1],
				[1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1],
				[1,0,1,1,0,1,1,0,0,0,0,0,0,0,1,1,0,1,1,0,1],
				[1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
				[1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
				[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1]],
				
				[[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
				[1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,1,1,0,0,1,0,1,1,1,1,1,0,1,3,0,1,1,0,1],
				[1,0,1,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,1,0,1],
				[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
				[1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
				[1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
				[1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1],
				[1,0,1,0,1,0,1,0,1,2,0,2,1,0,1,0,1,0,1,0,1],
				[1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1],
				[1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1],
				[1,0,0,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,0,0,1],
				[1,0,1,0,3,0,0,0,1,0,0,0,1,0,0,0,0,0,1,3,1],
				[1,0,1,1,0,0,1,1,1,0,0,0,1,1,1,0,0,1,1,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1]],

				[[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
				[1,0,1,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,1],
				[1,0,1,0,1,0,1,0,0,0,3,0,0,0,1,0,1,0,1,0,1],
				[1,0,1,0,1,0,0,0,1,1,0,1,1,0,0,0,1,0,1,0,1],
				[1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1],
				[1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1],
				[1,1,1,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,1,3,1],
				[1,3,1,0,1,1,1,0,1,2,0,2,1,0,1,1,1,0,1,1,1],
				[1,0,1,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,1,0,1],
				[1,0,1,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,1,0,1],
				[1,0,1,0,1,1,0,0,1,0,1,0,1,0,0,1,1,0,1,0,1],
				[1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1],
				[1,0,1,0,0,0,0,1,1,0,1,0,1,1,0,0,0,0,1,0,1],
				[1,0,0,0,1,0,0,0,0,0,3,0,0,0,0,0,1,0,0,0,1],
				[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1]],
				
				[[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
				[1,3,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,3,1],
				[1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
				[1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1],
				[1,0,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,1],
				[1,0,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,0,1],
				[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
				[1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1],
				[1,0,0,1,0,0,0,0,1,2,0,2,1,0,0,0,0,1,0,0,1],
				[1,0,0,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,0,0,1],
				[1,1,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1],
				[1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
				[1,1,3,1,0,1,0,0,1,0,0,0,1,0,0,1,0,1,3,1,1],
				[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1]],
				
				[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,3,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,3,1],
				[1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,1],
				[1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
				[1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,1,0,1,0,0,0,1,1,1,1,1,0,0,0,1,0,1,0,1],
				[1,1,0,1,0,1,0,1,1,2,0,2,1,1,0,1,0,1,0,1,1],
				[1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1],
				[1,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,1],
				[1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1],
				[1,0,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,0,1,0,1],
				[1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
				[1,3,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,3,1],
				[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1]],
				
				[[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,1,2,0,2,1,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1]]
			];

function loadMap(map){
	tiles.splice(0, tiles.length);
	var tileID = 0;
	for(var i = 0; i < maps[map].length; i++){
		for(var t = 0; t < maps[map][i].length; t++){
			var tileType = maps[map][i][t];
			var tileInfo = handleTileType(tileType);
			tiles.push({
				id: tileID,
				type: tileType,
				sx: tileInfo.sx,
				sy: tileInfo.sy,
				name: tileInfo.name,
				wall: tileInfo.wall,
				column: t,
				row: i,
				x: t * tW,
				y: i * tH
			});
			if(i == columns - 1){
				i = -1;
				rowCount++;
				if(rowCount == rows){
					i = columns + 1;
				}
			}
			tileID++;
		}
	}
	easystar.setGrid(maps[map]);
}

function loadChars(){
	chars.push({
		name: "pacman",
		dir: 1,
		x: tiles[262].x,
		y: tiles[262].y,
		imgX: 0,
		imgY: 0,
		permY: 0,
		width: 32,
		height: 32,
		lives: 3,
		speed: .9,
		mode: "closed"
	});
	chars.push({
		name: "blinky",
		dir: -1,
		x: tiles[136].x,
		y: tiles[136].y,
		imgX: 32,
		imgY: 32,
		permY: 32,
		width: 32,
		height: 32,
		speed: .9,
		target: -1,
		mode: "closed",
		dead: false,
		frightened: false
	});
	chars.push({
		name: "pinky",
		dir: -2,
		x: tiles[178].x,
		y: tiles[178].y,
		imgX: 32,
		imgY: 64,
		permY: 64,
		width: 32,
		height: 32,
		speed: .9,
		target: -1,
		mode: "closed",
		dead: false,
		frightened: false
	});
	chars.push({
		name: "inky",
		dir: -2,
		x: tiles[177].x,
		y: tiles[177].y,
		imgX: 32,
		imgY: 96,
		permY: 96,
		width: 32,
		height: 32,
		speed: .9,
		target: -1,
		mode: "closed",
		dead: false,
		frightened: false
	});
	chars.push({
		name: "clyde",
		dir: -2,
		x: tiles[179].x,
		y: tiles[179].y,
		imgX: 32,
		imgY: 128,
		permY: 128,
		width: 32,
		height: 32,
		speed: .9,
		target: -1,
		mode: "closed",
		dead: false,
		frightened: false
	});
	setInterval(function(){
		if(!pause){
			for(var i = 1; i < chars.length; i++){
				chars[i].rX = chars[i].x, chars[i].rY = chars[i].y;
			}
			setTimeout(function(){
				for(var i = 1; i < chars.length; i++){
					if(chars[i].x < 288 || chars[i].x > 384) if(chars[i].y !== 256){
						if(chars[i].rX === chars[i].x && chars[i].rY === chars[i].y){
							if(chars[i].x % 32 === 0 && chars[i].y % 32 === 0){
								var tile = getTileInfo(1, chars[i].x, chars[i].y).id;
								var surTiles = [tile - 1, tile - 21, tile + 1, tile + 21];
								for(var z = 0; z < surTiles.length; z++){
									if(!tiles[surTiles[z]].wall){
										if(surTiles[z] === tile - 1){
											chars[i].dir = 1;
										}else if(surTiles[z] === tile - 21){
											chars[i].dir = 0;
										}else if(surTiles[z] === tile + 1){
											chars[i].dir = 3;
										}else if(surTiles[z] === tile + 21){
											chars[i].dir = 2;
										}
									}
								}
							}else{
								if(chars[i].x % 32 !== 0){
									chars[i].dir = 1;
								}else{
									chars[i].dir = 0;
								}
							}
						}
					}
				}
			}, 1500);
		}
	}, 3000);
}

function Timer(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
}

function handleTileType(tileType){
	switch(parseInt(tileType)){
		case 0:
			this.name = "air";
			this.sx = 128;
			this.sy = 128;
			this.wall = false;
			break;
		case 1:
			this.name = "wall";
			this.sx = 128;
			this.sy = 96;
			this.wall = true;
			break;
		case 2:
			this.name = "inviswall";
			this.sx = 128;
			this.sy = 128;
			this.wall = true;
			break;
		default:
			this.name = "spec";
			this.sx = 128;
			this.sy = 128;
			this.wall = false;
			break;
	}
	return this;
}

function getTileInfo(method, x, y){
	for(var i = 0; i < tiles.length; i++){
		if(method === 0){
			if(tiles[i].column == x && tiles[i].row == y){
				return tiles[i];
			}
		}else if(method === 1){
			if(tiles[i].x == x && tiles[i].y == y){
				return tiles[i];
			}
		}else if(method === 2){
			return tiles[x];
		}
	}
}

function startCharMovement(){
	startGhostPath(chars);
	setInterval(function(){
		if(!pause){
			if(chars[0].mode !== "open") chars[0].mode = "open";
			else if(chars[0].mode !== "closed") chars[0].mode = "closed";
			for(var i = 1; i < chars.length; i++){
				if(chars[i].frightened){
					if(chars[i].mode !== "open") chars[i].mode = "open";
					else if(chars[i].mode !== "closed") chars[i].mode = "closed";
				}else{
					if(chars[i].mode !== "closed") chars[i].mode = "closed";
				}
			}
		}
	}, 175);
	$("body").keydown(function(e){
		clearInterval(checkPossibleMove);
		switch(e.keyCode){
			case 65:
			case 37:
				//Left
				chars[0].logPos = [chars[0].x, chars[0].y];
				chars[0].newDir = 1;
				break;
			case 87:
			case 38:
				//Up
				chars[0].logPos = [chars[0].x, chars[0].y];
				chars[0].newDir = 0;
				break;
			case 68:
			case 39:
				//Right
				chars[0].logPos = [chars[0].x, chars[0].y];
				chars[0].newDir = 3;
				break;
			case 83:
			case 40:
				//Down
				chars[0].logPos = [chars[0].x, chars[0].y];
				chars[0].newDir = 2;
				break;
		}
		var keys = [37, 38, 39, 40, 65, 68, 83, 87];
		checkPossibleMove = setInterval(function(){
			if(!pause){
				if(chars[0].x === chars[0].logPos[0] - 48 || chars[0].x === chars[0].logPos[0] + 48 || chars[0].y === chars[0].logPos[1] - 48 || chars[0].y === chars[0].logPos[1] + 48){
					if(keys.indexOf(e.keyCode) > -1){
						chars[0].newDir = -1;
						clearInterval(checkPossibleMove);
					}
				}
			}
		}, chars[0].speed * gameSpeed);
	});
	carryOutPossibleMove = setInterval(function(){
		if(!pause){
			switch(chars[0].newDir){
				case 0:
					//Up
					var nextTile = getTileInfo(1, chars[0].x - (chars[0].x % tW), (chars[0].y - 1) - ((chars[0].y - 1) % tH));
					if(!nextTile.wall && chars[0].x % 32 === 0) chars[0].dir = 0;
					break;
				case 1:
					//Left
					var nextTile = getTileInfo(1, (chars[0].x - 1) - ((chars[0].x - 1) % tW), chars[0].y - (chars[0].y % tH));
					if(!nextTile.wall && chars[0].y % 32 === 0) chars[0].dir = 1;
					break;
				case 2:
					//Down
					var nextTile = getTileInfo(1, chars[0].x - (chars[0].x % tW), (chars[0].y + 32) - ((chars[0].y + 32) % tH));
					if(!nextTile.wall && chars[0].x % 32 === 0) chars[0].dir = 2;
					break;
				case 3:
					//Right
					var nextTile = getTileInfo(1, (chars[0].x + 32) - ((chars[0].x + 32) % tW), chars[0].y - (chars[0].y % tH));
					if(!nextTile.wall && chars[0].y % 32 === 0) chars[0].dir = 3;
					break;
			}
		}
	}, chars[0].speed * gameSpeed);
	for(var i = 0; i < chars.length; i++){
		(function(i){
			setInterval(function(){
				if(!pause){
					switch(chars[i].dir){
						case 0:
							//Up
							if(i > 0) chars[i].imgX = 32;
							var nextTile = getTileInfo(1, chars[i].x - (chars[i].x % tW), (chars[i].y - 1) - ((chars[i].y - 1) % tH));
							if(!nextTile.wall && chars[i].x % 32 === 0) chars[i].y--;
							break;
						case 1:
							//Left
							if(i > 0) chars[i].imgX = 64;
							var nextTile = getTileInfo(1, (chars[i].x - 1) - ((chars[i].x - 1) % tW), chars[i].y - (chars[i].y % tH));
							if(!nextTile.wall && chars[i].y % 32 === 0) chars[i].x--;
							break;
						case 2:
							//Down
							if(i > 0) chars[i].imgX = 96;
							var nextTile = getTileInfo(1, chars[i].x - (chars[i].x % tW), (chars[i].y + 32) - ((chars[i].y + 32) % tH));
							if(!nextTile.wall && chars[i].x % 32 === 0) chars[i].y++;
							break;
						case 3:
							//Right
							if(i > 0) chars[i].imgX = 0;
							var nextTile = getTileInfo(1, (chars[i].x + 32) - ((chars[i].x + 32) % tW), chars[i].y - (chars[i].y % tH));
							if(!nextTile.wall && chars[i].y % 32 === 0) chars[i].x++;
							break;
					}
					if(chars[i].x >= 320 && chars[i].y <= 2 && !chars[i].coolDown){
						chars[i].target = -1;
						chars[i].y = 477;
						if(i !== 0){
							chars[i].coolDown = true;
							setTimeout(function(){
								chars[i].coolDown = false;
							}, 1500);
						}
					}else if(chars[i].x === 320 && chars[i].y >= 478 && !chars[i].coolDown){
						chars[i].target = -1;
						chars[i].y = 3
						if(i !== 0){
							chars[i].coolDown = true;
							setTimeout(function(){
								chars[i].coolDown = false;
							}, 1500);
						}
					}
					if(chars[i].x < 0 || chars[i].y < 0 || chars[i].x > 640 || chars[i].y > 480){
						chars[i].x = 320, chars[i].y = 192;
					}
				}
			}, chars[i].speed * gameSpeed);
		})(i);
	}
}

function startGhostTimer(life){
	if(life === chars[0].lives){
		ghostTimer = new Timer(function(){
			if(life === chars[0].lives){
				chars[2].x = tiles[136].x;
				chars[2].y = tiles[136].y;
				chars[2].dir = -1;
				chars[3].dir = 3;
				ghostTimer = new Timer(function(){
					if(life === chars[0].lives){
						chars[3].x = tiles[136].x;
						chars[3].y = tiles[136].y;
						chars[3].dir = -1;
						chars[4].dir = 1;
						ghostTimer = new Timer(function(){
							if(life === chars[0].lives){
								chars[4].x = tiles[136].x;
								chars[4].y = tiles[136].y;
								//chars[4].dir = -1;
							}
						}, 5000);
					}
				}, 5000);
			}
		}, 5000);
	}
}

function startGhostPath(ghosts){
	detectCollision();
	startGhostTimer(chars[0].lives);
	easystar.setAcceptableTiles([0, 3, 4]);
	for(var i = 1; i < ghosts.length; i++){
		(function(i){
			setInterval(function(){
				if(!pause){
					if(!ghosts[i].frightened){
						var pacman = ghosts[0];
						var ghost = ghosts[i];
						if(ghost.dir > -2){
							var possibleTargets = [];
							for(var p = 0; p < tiles.length; p++){
								if(p !== 178 && !tiles[p].wall){
									possibleTargets.push(p);
								}
							}
							switch(ghost.name){
								case "blinky":
									var curPacTile = getTileInfo(1, pacman.x - (pacman.x % tW), pacman.y - (pacman.y % tH));
									var curGhostTile = getTileInfo(1, ghost.x - (ghost.x % tW), ghost.y - (ghost.y % tH));
									var target = curPacTile;
									if(chars[i].dead){
										target = tiles[chars[i].target]
									}
									easystar.findPath(curGhostTile.column, curGhostTile.row, target.column, target.row, function(path){
										if(path == null){
											//console.log("error in pathfinding; ghost: " + chars[i].name);
										}else{
											handlePath(path);
										}
									});
									easystar.calculate();
									function handlePath(data){
										var t = 0;
										while(t < data.length){
											var coords = data[t];
											var tile = getTileInfo(0, coords.x, coords.y);
											if(chars[i].x % 32 === 0 && chars[i].y % 32 === 0){
												if(tile.id == curGhostTile.id - 1){
													chars[i].dir = 1;
												}else if(tile.id == curGhostTile.id - 21){
													chars[i].dir = 0;
												}else if(tile.id == curGhostTile.id + 1){
													chars[i].dir = 3;
												}else if(tile.id == curGhostTile.id + 21){
													chars[i].dir = 2;
												}
											}
											t++
										}
									}
									if(chars[i].target > -1){
										if(chars[i].x === tiles[chars[i].target].x && chars[i].y === tiles[chars[i].target].y){
											if(chars[i].dead){
												chars[i].dir = -2;
												chars[i].target = -1;
												setTimeout(function(){
													chars[i].dead = false;
													chars[i].frightened = false;
													chars[i].dir = -1;
												}, 1500);
											}else{
												chars[i].target = -1;
											}
										}
									}
									break;
								case "inky":
									var curBlinkyTile = getTileInfo(1, chars[1].x - (chars[1].x % tW), chars[1].y - (chars[1].y % tH));
									var curGhostTile = getTileInfo(1, ghost.x - (ghost.x % tW), ghost.y - (ghost.y % tH));
									var tile = curBlinkyTile.id;
									var target;
									var posTarget;
									var x = 5;
									if(!chars[i].dead){
										while(x > 0){
											switch(chars[0].dir){
												case 0:
													if(tiles[tile].row - x < 0){
														x = tiles[tile].row;
														break;
													}else{
														var posTarget = tile - (21 * x);
														break;
													}
													var posTarget = tile - (21 * x);
													break;
												case 1:
													if(tiles[tile].column - x < 0){
														x = tiles[tile].column;
														break;
													}else{
														var posTarget = tile - x;
														break;
													}
												case 2:
													if(tiles[tile].row + x > 15){
														x = 15 - tiles[tile].row;
														break;
													}else{
														var posTarget = tile + (21 * x);
														break;
													}
													break;
												case 3:
													if(tiles[tile].column + x > 20){
														x = 20 - tiles[tile].column;
														break;
													}else{
														var posTarget = tile + x;
														break;
													}
													break;
												
											}
											if(posTarget >= 0 && posTarget <= tiles.length - 1){
												if(tiles[posTarget].wall || posTarget == 178){
													x--;
												}else{
													target = posTarget;
													chars[i].target = -1;
													x = 0;
												}
											}else{
												x--;
											}
										}
										if(target == undefined){
											function pickTarget(){
												target = possibleTargets[Math.round(Math.random() * possibleTargets.length)];
												var info = tiles[target];
												var dist = Math.abs(curGhostTile.column - info.column) + Math.abs(curGhostTile.row - info.row);
												if(dist > 5){
													chars[i].target = target;
												}else{
													pickTarget();
												}
											}
											if(chars[i].target < 0){
												pickTarget();
											}else{
												target = tiles[chars[i].target];
											}
										}
										target = tiles[target];
										if(target == undefined){
											target = tiles[chars[i].target];
										}
									}else{
										target = tiles[chars[i].target];
									}
									easystar.findPath(curGhostTile.column, curGhostTile.row, target.column, target.row, function(path){
										if(path == null){
											//console.log("error in pathfinding; ghost: " + chars[i].name);
										}else{
											handlePath(path);
										}
									});
									easystar.calculate();
									function handlePath(data){
										var t = 0;
										while(t < data.length){
											var coords = data[t];
											var tile = getTileInfo(0, coords.x, coords.y);
											if(chars[i].x % 32 === 0 && chars[i].y % 32 === 0){
												if(tile.id == curGhostTile.id - 1){
													chars[i].dir = 1;
												}else if(tile.id == curGhostTile.id - 21){
													chars[i].dir = 0;
												}else if(tile.id == curGhostTile.id + 1){
													chars[i].dir = 3;
												}else if(tile.id == curGhostTile.id + 21){
													chars[i].dir = 2;
												}
											}
											t++
										}
									}
									if(chars[i].target > -1){
										if(chars[i].x === tiles[chars[i].target].x && chars[i].y === tiles[chars[i].target].y){
											if(chars[i].dead){
												chars[i].dir = -2;
												chars[i].target = -1;
												setTimeout(function(){
													chars[i].dead = false;
													chars[i].frightened = false;
													chars[i].dir = -1;
												}, 1500);
											}else{
												chars[i].target = -1;
											}
										}
									}
									break;
								case "pinky":
									var curPacTile = getTileInfo(1, pacman.x - (pacman.x % tW), pacman.y - (pacman.y % tH));
									var curGhostTile = getTileInfo(1, ghost.x - (ghost.x % tW), ghost.y - (ghost.y % tH));
									var tile = curPacTile.id;
									var target;
									var posTarget;
									var x = 5;
									if(!chars[i].dead){
										while(x > 0){
											switch(chars[0].dir){
												case 0:
													if(tiles[tile].row - x < 0){
														x = tiles[tile].row;
														break;
													}else{
														var posTarget = tile - (21 * x);
														break;
													}
													var posTarget = tile - (21 * x);
													break;
												case 1:
													if(tiles[tile].column - x < 0){
														x = tiles[tile].column;
														break;
													}else{
														var posTarget = tile - x;
														break;
													}
												case 2:
													if(tiles[tile].row + x > 15){
														x = 15 - tiles[tile].row;
														break;
													}else{
														var posTarget = tile + (21 * x);
														break;
													}
													break;
												case 3:
													if(tiles[tile].column + x > 20){
														x = 20 - tiles[tile].column;
														break;
													}else{
														var posTarget = tile + x;
														break;
													}
													break;
												
											}
											if(posTarget >= 0 && posTarget <= tiles.length - 1){
												if(tiles[posTarget].wall || posTarget == 178){
													x--;
												}else{
													target = posTarget;
													chars[i].target = -1;
													x = 0;
												}
											}else{
												x--;
											}
										}
										if(target == undefined){
											function pickTarget(){
												target = possibleTargets[Math.round(Math.random() * possibleTargets.length)];
												var info = tiles[target];
												var dist = Math.abs(curGhostTile.column - info.column) + Math.abs(curGhostTile.row - info.row);
												if(dist > 5){
													chars[i].target = target;
												}else{
													pickTarget();
												}
											}
											if(chars[i].target < 0){
												pickTarget();
											}else{
												target = tiles[chars[i].target];
											}
										}
										target = tiles[target];
										if(target == undefined){
											target = tiles[chars[i].target];
										}
									}else{
										target = tiles[chars[i].target];
									}
									easystar.findPath(curGhostTile.column, curGhostTile.row, target.column, target.row, function(path){
										if(path == null){
											//console.log("error in pathfinding; ghost: " + chars[i].name);
										}else{
											handlePath(path);
										}
									});
									easystar.calculate();
									function handlePath(data){
										var t = 0;
										while(t < data.length){
											var coords = data[t];
											var tile = getTileInfo(0, coords.x, coords.y);
											if(chars[i].x % 32 === 0 && chars[i].y % 32 === 0){
												if(tile.id == curGhostTile.id - 1){
													chars[i].dir = 1;
												}else if(tile.id == curGhostTile.id - 21){
													chars[i].dir = 0;
												}else if(tile.id == curGhostTile.id + 1){
													chars[i].dir = 3;
												}else if(tile.id == curGhostTile.id + 21){
													chars[i].dir = 2;
												}
											}
											t++
										}
									}
									if(chars[i].target > -1){
										if(chars[i].x === tiles[chars[i].target].x && chars[i].y === tiles[chars[i].target].y){
											if(chars[i].dead){
												chars[i].dir = -2;
												chars[i].target = -1;
												setTimeout(function(){
													chars[i].dead = false;
													chars[i].frightened = false;
												}, 1500);
													chars[i].dir = -1;
											}else{
												chars[i].target = -1;
											}
										}
									}
									break;
								case "clyde":
									var curGhostTile = getTileInfo(1, ghost.x - (ghost.x % tW), ghost.y - (ghost.y % tH));
									function pickTarget(){
										var target = possibleTargets[Math.round(Math.random() * possibleTargets.length)];
										var info = tiles[target];
										var dist = Math.abs(curGhostTile.column - info.column) + Math.abs(curGhostTile.row - info.row);
										if(dist > 5){
											chars[i].target = target;
										}else{
											pickTarget();
										}
									}
									if(chars[i].target < 0){
										pickTarget();
									}else{
										var target = tiles[chars[i].target];
										easystar.findPath(curGhostTile.column, curGhostTile.row, target.column, target.row, function(path){
											if(path == null){
												//console.log("error in pathfinding; ghost: " + chars[i].name);
											}else{
												handlePath(path);
											}
										});
										easystar.calculate();
										function handlePath(data){
											var t = 0;
											while(t < data.length){
												var coords = data[t];
												var tile = getTileInfo(0, coords.x, coords.y);
												if(chars[i].x % 32 === 0 && chars[i].y % 32 === 0){
													if(tile.id == curGhostTile.id - 1){
														chars[i].dir = 1;
													}else if(tile.id == curGhostTile.id - 21){
														chars[i].dir = 0;
													}else if(tile.id == curGhostTile.id + 1){
														chars[i].dir = 3;
													}else if(tile.id == curGhostTile.id + 21){
														chars[i].dir = 2;
													}
												}
												t++
											}
										}
										if(chars[i].target > -1){
											if(chars[i].x === tiles[chars[i].target].x && chars[i].y === tiles[chars[i].target].y){
												if(chars[i].dead){
													chars[i].dir = -2;
													chars[i].target = -1;
													setTimeout(function(){
														chars[i].dead = false;
														chars[i].frightened = false;
														chars[i].dir = -1;
													}, 1500);
												}else{
													chars[i].target = -1;
												}
											}
										}
									}
									break;
							}
						}
					}else{
						if(chars[i].dir > -2){
							var curPacTile = getTileInfo(1, chars[0].x - (chars[0].x % tW), chars[0].y - (chars[0].y % tH));
							var curGhostTile = getTileInfo(1, chars[i].x - (chars[i].x % tW), chars[i].y - (chars[i].y % tH));
							var tile = curPacTile.id;
							var target;
							var posTarget;
							var x = 10;
							if(chars[i].target >= 0){
								target = chars[i].target;
							}else{
								while(x > 4){
									switch(chars[0].dir){
										case 0:
											if(tiles[tile].row - x < 0){
												x = tiles[tile].row;
												break;
											}else{
												var posTarget = tile - (21 * x);
												break;
											}
											var posTarget = tile - (21 * x);
											break;
										case 1:
											if(tiles[tile].column - x < 0){
												x = tiles[tile].column;
												break;
											}else{
												var posTarget = tile - x;
												break;
											}
										case 2:
											if(tiles[tile].row + x > 15){
												x = 15 - tiles[tile].row;
												break;
											}else{
												var posTarget = tile + (21 * x);
												break;
											}
											break;
										case 3:
											if(tiles[tile].column + x > 20){
												x = 20 - tiles[tile].column;
												break;
											}else{
												var posTarget = tile + x;
												break;
											}
											break;
										
									}
									if(posTarget >= 0 && posTarget <= tiles.length - 1){
										if(tiles[posTarget].wall || posTarget == 178){
											x--;
										}else{
											target = posTarget;
											chars[i].target = -1;
											x = 0;
										}
									}else{
										x--;
									}
								}
								if(target == undefined){
									function pickTarget(){
										target = possibleTargets[Math.round(Math.random() * possibleTargets.length)];
										var info = tiles[target];
										var dist = Math.abs(curGhostTile.column - info.column) + Math.abs(curGhostTile.row - info.row);
										if(dist > 5){
											chars[i].target = target;
										}else{
											pickTarget();
										}
									}
									if(chars[i].target < 0){
										pickTarget();
									}else{
										target = tiles[chars[i].target];
									}
								}
							}
							target = tiles[target];
							if(target == undefined){
								target = tiles[chars[i].target];
							}
							easystar.findPath(curGhostTile.column, curGhostTile.row, target.column, target.row, function(path){
								if(path == null){
									//console.log("error in pathfinding; ghost: " + chars[i].name);
								}else{
									handlePath(path);
								}
							});
							easystar.calculate();
							function handlePath(data){
								var t = 0;
								while(t < data.length){
									var coords = data[t];
									var tile = getTileInfo(0, coords.x, coords.y);
									if(chars[i].x % 32 === 0 && chars[i].y % 32 === 0){
										if(tile.id == curGhostTile.id - 1){
											chars[i].dir = 1;
										}else if(tile.id == curGhostTile.id - 21){
											chars[i].dir = 0;
										}else if(tile.id == curGhostTile.id + 1){
											chars[i].dir = 3;
										}else if(tile.id == curGhostTile.id + 21){
											chars[i].dir = 2;
										}
									}
									t++
								}
							}
							if(chars[i].target > -1){
								if(chars[i].x === tiles[chars[i].target].x && chars[i].y === tiles[chars[i].target].y){
									if(chars[i].dead){
										chars[i].dir = -2;
										chars[i].target = -1;
										setTimeout(function(){
											chars[i].dead = false;
											chars[i].frightened = false;
											chars[i].dir = -1;
										}, 1500);
									}else{
										chars[i].target = -1;
									}
								}
							}
						}
					}
				}
			}, chars[i].speed * gameSpeed);
		})(i);
	}
}

function placeDots(){
	for(var i = 0; i < tiles.length; i++){
		if(!tiles[i].wall && i !== 178  && i !== 262 && tiles[i].column > 0 && tiles[i].row > 0 && tiles[i].column < 20 && tiles[i].row < 15){
			tiles[i].dot = true;
			if(tiles[i].name == "spec"){
				tiles[i].dot = "spec";
			}
		}
	}
}

function detectCollision(){
	var slack = 14;
	setInterval(function(){
		for(var i = 1; i < chars.length; i++){
			if(!(chars[0].x + slack > chars[i].x + chars[i].width ||
				chars[0].x + chars[0].width < chars[i].x + slack ||
				chars[0].y + slack > chars[i].y + chars[i].height ||
				chars[0].y + chars[0].height < chars[i].y + slack)){
					//Line to avoid confusion
				if(chars[i].frightened || chars[i].dead){
					if(!chars[i].dead){
						chars[i].dead = true;
						chars[i].target = 136;
						deadGhosts++;
						if(deadGhosts === 1){
							score += 100;
						}else if(deadGhosts === 2){
							score += 200;
						}else if(deadGhosts === 3){
							score += 400;
						}else if(deadGhosts === 4){
							score += 800;
						}
					}
				}else{
					if(chars[0].lives === 1){
						endGame();
					}else{
						takeLife();
					}
				}
			}
			if(chars[0].dir == 0){
				var tile = getTileInfo(1, chars[0].x - chars[0].x % 32, chars[0].y - chars[0].y % 32);
				if(chars[0].y >= tile.y + 14 && chars[0].y <= tile.y + 18){
					if(tiles[tile.id].dot == "spec"){
						frightenGhosts();
						tiles[tile.id].dot = false;
						score += 50;
					}else if(tiles[tile.id].dot){
						tiles[tile.id].dot = false;
						score += 10;
					}
				}
			}else if(chars[0].dir == 2){
				var tile = getTileInfo(1, chars[0].x - chars[0].x % 32, chars[0].y + 32 - chars[0].y % 32);
				if(chars[0].y + chars[0].height >= tile.y + 14 && chars[0].y + chars[0].height <= tile.y + 18){
					if(tiles[tile.id].dot == "spec"){
						frightenGhosts();
						tiles[tile.id].dot = false;
						score += 50;
					}else if(tiles[tile.id].dot){
						tiles[tile.id].dot = false;
						score += 10;
					}
				}
			}else if(chars[0].dir == 1){
				var tile = getTileInfo(1, chars[0].x - chars[0].x % 32, chars[0].y - chars[0].y % 32);
				if(chars[0].x >= tile.x + 14 && chars[0].x <= tile.x + 18){
					if(tiles[tile.id].dot == "spec"){
						frightenGhosts();
						tiles[tile.id].dot = false;
						score += 50;
					}else if(tiles[tile.id].dot){
						tiles[tile.id].dot = false;
						score += 10;
					}
				}
			}else if(chars[0].dir == 3){
				var tile = getTileInfo(1, chars[0].x + 32 - chars[0].x % 32, chars[0].y - chars[0].y % 32);
				if(chars[0].x + chars[0].width >= tile.x + 14 && chars[0].x + chars[0].width <= tile.x + 18){
					if(tiles[tile.id].dot == "spec"){
						frightenGhosts();
						tiles[tile.id].dot = false;
						score += 50;
					}else if(tiles[tile.id].dot){
						tiles[tile.id].dot = false;
						score += 10;
					}
				}
			}
		}
	}, engineSpeed);
}

function frightenGhosts(){
	if(frightened){
		frightenedWait++;
	}else{
		for(var i = 1; i < chars.length; i++){
			chars[i].speed = .75;
			if(!chars[i].dead){
				chars[i].frightened = true;
			}
		}
		frightened = true;
		frightTimer = new Timer(function(){
			for(var i = 1; i < chars.length; i++){
				chars[i].speed = .75;
				chars[i].frightened = false;
			}
			deadGhosts = 0;
			frightened = false;
			if(frightenedWait > 0){
				frightenedWait--;
				frightenGhosts();
			}
		}, 5500);
	}
}

function loadNewMap(x){
	$("#play").hide();
	$("#pause").hide();
	pause = true;
	chars[0].newDir = -1;
	chars[0].x = tiles[262].x, chars[0].y = tiles[262].y, chars[0].dir = 1;
	chars[1].x = tiles[136].x, chars[1].y = tiles[136].y, chars[1].dir = -1;
	chars[2].x = tiles[178].x, chars[4].y = tiles[178].y, chars[4].dir = -2;
	chars[3].x = tiles[177].x, chars[3].y = tiles[177].y, chars[3].dir = -2;
	chars[4].x = tiles[179].x, chars[2].y = tiles[179].y, chars[2].dir = -2;
	frightened = false;
	for(var i = 1; i < chars.length; i++){
		chars[i].frightened = false;
		chars[i].dead = false;
	}
	tiles = [];
	loadMap(x);
	placeDots();
	setTimeout(function(){
		pause = false;
		$("#pause").css("display","block");
		startGhostTimer(chars[0].lives);
	}, 1500);
}

function takeLife(){
	$("#play").hide();
	$("#pause").hide();
	chars[0].lives--;
	pause = true;
	chars[0].newDir = -1;
	chars[0].x = tiles[262].x, chars[0].y = tiles[262].y, chars[0].dir = 1;
	chars[1].x = tiles[136].x, chars[1].y = tiles[136].y, chars[1].dir = -1;
	chars[2].x = tiles[178].x, chars[4].y = tiles[178].y, chars[4].dir = -2;
	chars[3].x = tiles[177].x, chars[3].y = tiles[177].y, chars[3].dir = -2;
	chars[4].x = tiles[179].x, chars[2].y = tiles[179].y, chars[2].dir = -2;
	frightened = false;
	for(var i = 1; i < chars.length; i++){
		chars[i].frightened = false;
		chars[i].dead = false;
	}
	setTimeout(function(){
		$("#pause").css("display","block");
		pause = false;
		startGhostTimer(chars[0].lives);
	}, 1500);
}

function endGame(){
	$("#play").hide();
	$("#pause").hide();
	chars[0].lives--;
	for(var i = 0; i < 9999; i++){
		clearInterval(i);
		clearTimeout(i);
	}
	setTimeout(function(){
		$(".controls").hide();
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, cW, cH);
		ctx.fillStyle = "yellow";
		ctx.font = "65px Arial";
		ctx.fillText("PACMAN", 198, 100);
		ctx.font = "15px Arial";
		ctx.fillText("THE CHRIS EDITION", 265, 115);
		ctx.font = "45px Arial";
		ctx.fillStyle = "yellow";
		ctx.fillText("GAME OVER", 198, 255);
		ctx.font = "30px Arial";
		ctx.fillText("REFRESH", 264, 282);
		ctx.font = "20px Arial";
		if(map <= 4){
			ctx.fillText("MAP: " + (map + 1), 5, 467);
		}else{
			ctx.fillText("MAP: \"" + code + "\"", 5, 467);
		}
		if(mode === 0){
			ctx.fillText("MODE: " + "Playthrough", 5, 487);
		}else{
			ctx.fillText("MODE: " + "Choose Lv.", 5, 487);
		}
		ctx.fillText("FINAL SCORE: " + score, 5, 507);
	}, 1500);
}

function detectWin(){
	setInterval(function(){
		var dots = 0;
		for(var i = 0; i < tiles.length; i++){
			if(tiles[i].dot == "spec" || tiles[i].dot){
				dots++;
			}
		}
		if(dots === 0){
			if(mode === 0){
				if(map < 4){
					chars[0].lives++;
					chars[0].newDir = -1;
					map++;
					loadNewMap(map);
				}else{
					$("#play").hide();
					$("#pause").hide();
					chars[0].lives--;
					for(var i = 0; i < 9999; i++){
						clearInterval(i);
						clearTimeout(i);
					}
					setTimeout(function(){
						$(".controls").hide();
						ctx.fillStyle = "black"
						ctx.fillRect(0, 0, cW, cH);
						ctx.fillStyle = "yellow";
						ctx.font = "65px Arial";
						ctx.fillText("PACMAN", 198, 100);
						ctx.font = "15px Arial";
						ctx.fillText("THE CHRIS EDITION", 265, 115);
						ctx.fillStyle = "yellow";
						ctx.font = "70px Arial";
						ctx.fillText("YOU WON", 165, 245);
						ctx.font = "50px Arial";
						ctx.fillText("FINAL SCORE: " + score, 100, 285);
						ctx.font = "30px Arial";
						ctx.fillText("REFRESH", 264, 312);
					}, 1500);
				}
			}else{
				$("#play").hide();
				$("#pause").hide();
				chars[0].lives--;
				for(var i = 0; i < 9999; i++){
					clearInterval(i);
					clearTimeout(i);
				}
				setTimeout(function(){
					$(".controls").hide();
					ctx.fillStyle = "black"
					ctx.fillRect(0, 0, cW, cH);
					ctx.fillStyle = "yellow";
					ctx.font = "65px Arial";
					ctx.fillText("PACMAN", 198, 100);
					ctx.font = "15px Arial";
					ctx.fillText("THE CHRIS EDITION", 265, 115);
					ctx.font = "45px Arial";
					ctx.fillStyle = "yellow";
					if(map <= 4){
						ctx.fillText("BEAT LV. " + (map + 1), 215, 255);
					}else{
						ctx.fillText("BEAT CODE: \"" + code + "\"", 120, 255);
					}
					ctx.font = "30px Arial";
					ctx.fillText("REFRESH", 264, 282);
					ctx.font = "20px Arial";
					ctx.fillText("FINAL SCORE: " + score, 5, 507);
				}, 1500);
			}
		}
	}, engineSpeed);
}

function startGame(){
	loadMap(map);
	pause = false;
	loadChars();
	startCharMovement();
	titleScreen = false;
	detectWin();
	$("#pause").css("display", "block");
	if(start){
		placeDots();
		start = false;
	}
}

function render(){
	var spritesheet = new Image();
	spritesheet.src = "sprites/spritesheet.png";
	setInterval(function(){
		if(titleScreen){
			ctx.clearRect(0, 0, cW, cH);
			ctx.fillStyle = "black"
			ctx.fillRect(0, 0, cW, cH);
			ctx.fillStyle = "yellow";
			ctx.font = "65px Arial";
			ctx.fillText("PACMAN", 198, 100);
			ctx.font = "15px Arial";
			ctx.fillText("THE CHRIS EDITION", 265, 115);
			ctx.font = "25px Arial";
			if(hoverPT){
				ctx.fillStyle = "yellow"
				ctx.fillRect(95, 250, 210, 60);
				ctx.fillStyle = "black"
			}else if(hoverCL){
				ctx.fillStyle = "yellow"
				ctx.fillRect(367, 250, 210, 60);
				ctx.fillStyle = "black"
			}
			ctx.fillText("PLAYTHROUGH", 105, 290);
			ctx.fillText("CHOOSE LV.", 395, 290);
			ctx.strokeStyle = "yellow"
			ctx.strokeRect(95, 250, 210, 60);
			ctx.strokeRect(367, 250, 210, 60);
		}else{
			if(!pause){
				ctx.clearRect(0, 0, cW, cH);
				for(var i = 0; i < tiles.length; i++){
					ctx.drawImage(spritesheet, tiles[i].sx, tiles[i].sy, tW, tH, tiles[i].x, tiles[i].y, tW, tH);
					if(tiles[i].dot == "spec"){
						ctx.fillStyle = "yellow";
						ctx.beginPath();
						ctx.arc(tiles[i].x + 16, tiles[i].y + 16, 8, 0, 2 * Math.PI);
						ctx.fill();
					}else if(tiles[i].dot){
						ctx.fillStyle = "yellow";
						ctx.beginPath();
						ctx.arc(tiles[i].x + 16, tiles[i].y + 16, 4, 0, 2 * Math.PI);
						ctx.fill();
					}
				}
				for(var i = 0; i < chars.length; i++){
					if(chars[i].frightened && i > 0){
						chars[i].imgX = 128;
						chars[i].imgY = 32;
					}else if(i > 0){
						chars[i].imgY = chars[i].permY;
					}
					if(chars[i].mode === "open"){
						if(i === 0){
							switch(chars[i].dir){
								case 0:
									chars[i].imgX = 64;
									break;
								case 1:
									chars[i].imgX = 96;
									break;
								case 2:
									chars[i].imgX = 128;
									break;
								case 3:
									chars[i].imgX = 32;
									break;
							}
						}else{
							chars[i].imgX = 128;
							chars[i].imgY = 64;
						}
					}else if(chars[0].mode === "closed"){
						chars[0].imgX = 0;
					}
					if(chars[i].dead){
						chars[i].imgY = 160;
						switch(chars[i].dir){
							case 0:
								chars[i].imgX = 32;
								break;
							case 1:
								chars[i].imgX = 64;
								break;
							case 2:
								chars[i].imgX = 96;
								break;
							case 3:
								chars[i].imgX = 0;
								break;
						}
					}
					ctx.drawImage(spritesheet, chars[i].imgX, chars[i].imgY, chars[i].width, chars[i].height, chars[i].x, chars[i].y, chars[i].width, chars[i].height);
				}
				ctx.font = "24px Arial";
				ctx.fillStyle = "white";
				ctx.fillText("Lives: " + chars[0].lives, 5, 25);
				ctx.fillText("Score: " + score, 100, 25);
			}
		}
	}, engineSpeed);
}

$("#mainCanvas").click(function(e){
	var x = e.offsetX, y = e.offsetY;
	if(!titleScreen){
		var tileX = x - x % 32, tileY = y - y % 32;
		var tile = getTileInfo(1, tileX, tileY);
		console.log(tile);
	}else{
		if(x > 95 && x < 305 && y > 250 && y < 310){
			$("#mainCanvas").css("cursor", "default");
			map = 0, mode = 0;
			startGame();
		}else{
			if(x > 367 && x < 577 && y > 250 && y < 310){
				$("#mainCanvas").css("cursor", "default");
				function getLevel(){
					var level = prompt("Enter a lv. # or code", "1");
					if(level !== null){
						function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 
						if(isNumber(level)){
							var level = parseInt(level);
							if(level > 0 && level <= 5){
								if(level % 1 === 0){
									$("#mainCanvas").css("cursor", "default");
									map = level - 1, mode = 1;
									startGame();
								}else{
									alert(level + " is not a valid lv. # or code.");
								}
							}else{
								alert(level + " is not a valid lv. # or code.");
							}
						}else{
							level = level.toUpperCase();
							switch(level){
								case "1738FW":
									$("#mainCanvas").css("cursor", "default");
									map = 5, mode = 1, code = "1738FW";
									startGame();
									break;
								case "LCC5":
									$("#mainCanvas").css("cursor", "default");
									map = 6, mode = 1, code = "LCC5";
									startGame();
									break;
								case "CMS":
									$("#mainCanvas").css("cursor", "default");
									map = 7, mode = 1, code = "CMS";
									startGame();
									break;
								default:
									alert(level + " is not a valid lv. # or code.");
									break;
							}
						}
					}
				}
				getLevel();
			}
		}
	}
});

$("#pause").click(function(){
	pause = true;
	$('#play').css('display', 'block');
	$('#pause').hide();
	if(ghostTimer) ghostTimer.pause();
	if(frightTimer) frightTimer.pause();
});
$("#play").click(function(){
	pause = false;
	$('#pause').css('display', 'block');
	$('#play').hide();
	if(ghostTimer) ghostTimer.resume();
	if(frightTimer) frightTimer.resume();
});

$("#mainCanvas").mousemove(function(e){
	var x = e.offsetX, y = e.offsetY;
	if(titleScreen){
		if(x > 95 && x < 305 && y > 250 && y < 310){
			if(!hoverPT) hoverPT = true;
			$("#mainCanvas").css("cursor", "pointer");
		}else{
			if(hoverPT) hoverPT = false;
			$("#mainCanvas").css("cursor", "pointer");
			if(x > 367 && x < 577 && y > 250 && y < 310){
				if(!hoverCL) hoverCL = true;
			}else{
				if(hoverCL) hoverCL = false;
				$("#mainCanvas").css("cursor", "default");
			}
		}
	}
});

render();