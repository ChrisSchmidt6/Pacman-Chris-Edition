var cW = $("#mainCanvas").width();
var cH = $("#mainCanvas").height();
var tW = 32, tH = 32;
var columns = cW / tW, rows = cH / tH;
var tiles = [];
var map = 0;

var originalMap = [[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
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
					[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1]];

var maps = [];
maps.push(originalMap);
var mapArray = maps[map];

function loadMap(){
	tiles.splice(0, tiles.length);
	var tileID = 0;
	for(var i = 0; i < maps[map].length; i++){
		for(var t = 0; t < maps[map][i].length; t++){
			var tileType = maps[map][i][t];
			var tileInfo = handleTileType(tileType);
			tiles.push({
				id: tileID,
				type: tileType,
				color: tileInfo.color,
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
	render();
}

loadMap();

function handleTileType(tileType){
	switch(parseInt(tileType)){
		case 0:
			this.name = "air";
			this.color = "white";
			break;
		case 1:
			this.name = "wall";
			this.color = "black";
			break;
		case 2:
			this.name = "invisWall";
			this.color = "purple";
			break;
		case 3:
			this.name = "spec";
			this.color = "orange";
			break;
		default:
			this.name = "null";
			this.color = "white";
			break;
	}
	return this;
}

$("#mainCanvas").mousemove(function(e){
	mapDraw(e.buttons, e);
});
$("#mainCanvas").click(function(e){
	mapDraw(e.which, e);
});

function mapDraw(type, e){
	var x = e.offsetX, y = e.offsetY;
	var tileX = x - (x % 32), tileY = y -(y % 32);
    switch(type){
        case 1:
			if(!e.shiftKey && !e.ctrlKey && !e.altKey){
				for(var i = 0; i < tiles.length; i++){
					if(tiles[i].x === tileX && tiles[i].y === tileY){
						var col = tiles[i].column, row = tiles[i].row;
						mapArray[row][col] = 1;
						tiles[i].color = "black";
					}
				}
			}else if(!e.shiftKey && !e.altKey && e.ctrlKey){
				for(var i = 0; i < tiles.length; i++){
					if(tiles[i].x === tileX && tiles[i].y === tileY){
						var col = tiles[i].column, row = tiles[i].row;
						mapArray[row][col] = 2;
						tiles[i].color = "purple";
					}
				}
			}else if(e.shiftKey && !e.altKey && !e.ctrlKey){
				for(var i = 0; i < tiles.length; i++){
					if(tiles[i].x === tileX && tiles[i].y === tileY){
						var col = tiles[i].column, row = tiles[i].row;
						mapArray[row][col] = 0;
						tiles[i].color = "white";
					}
				}
			}else if(!e.shiftKey && e.altKey && !e.ctrlKey){
				for(var i = 0; i < tiles.length; i++){
					if(tiles[i].x === tileX && tiles[i].y === tileY){
						var col = tiles[i].column, row = tiles[i].row;
						mapArray[row][col] = 3;
						tiles[i].color = "orange";
					}
				}
			}
            break;
    }
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

$("#getMap").click(function(){
	var exportMap = [];
	for(var i = 0; i < mapArray.length; i++){
		for(var t = 0; t < mapArray[i].length; t++){
			if(i == 0 && t == 0){
				exportMap.push("[[" + mapArray[i][t]);
			}else if(i == mapArray.length - 1 && t == mapArray[i].length - 1){
				exportMap.push(mapArray[i][t] + "]]");
			}else{
				if(t == 0){
					if(i > 0 && i < mapArray.length - 1){
						exportMap.push("\n[" + mapArray[i][t]);
					}else{
						exportMap.push("\n[" + mapArray[i][t]);
					}
				}else if(t == mapArray[i].length - 1){
					exportMap.push(mapArray[i][t] + "]");
				}else{
					exportMap.push(mapArray[i][t]);
				}
			}
		}
	}
	document.getElementById("exportedMap").innerHTML = "";
	document.getElementById("exportedMap").innerHTML = exportMap.toString();
});

function render(){
	var ctx = document.getElementById("mainCanvas").getContext("2d");
	setInterval(function(){
		ctx.clearRect(0, 0, cW, cH);
		for(var i = 0; i < tiles.length; i++){
			ctx.fillStyle = tiles[i].color;
			ctx.fillRect(tiles[i].x, tiles[i].y, tW, tH);
		}
	}, 1000/30);
}