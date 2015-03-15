// 模仿jQuery选择符简易库
function $(v) {
	if(typeof v === 'function'){
		window.onload = v;
	}else if (typeof v === 'string') {
		return document.getElementById(v);
	}else if (typeof v === 'object') {
		return v;
	}
}

// 获得计算后样式
function getStyle(obj, attr){
	return obj.currentStyle ? obj.currentStyle(attr):getComputedStyle(obj)[attr];
}

// 移动封装
// @param obj: 运动对象
// @param attr: 运动对象样式属性
// @param target: 运动终点目标
// @param dir: 运动幅度
// @param callback: 回调函数
function doMove(obj,attr,target,dir,endFn) {
	dir = parseInt(getStyle(obj,attr)) < target ? dir : -dir;

	clearInterval(obj.doMoveTimer);

	obj.doMoveTimer = setInterval(function(){
		var cValue = parseInt(getStyle(obj,attr)) + dir;
		
		if (dir > 0 && cValue > target || dir < 0 && cValue < target) {
			cValue = target;
		}

		obj.style[attr] = cValue + 'px';

		if(cValue === target){
			clearInterval(obj.doMoveTimer);
			// 执行回调函数
			endFn && endFn();
		}  
	},15);
}

// 透明度变化
// @param obj: 运动对象
// @param speed: 变化速度
// @param target: 终点目标
// @param dir: 幅度
// @param callback: 回调函数
function opacity(obj,speed,dir,target,endFn){
	var dir = parseFloat(getStyle(obj,'opacity')) < target ? dir : -dir;

	clearInterval(obj.opacityTimer);

	obj.opacityTimer = setInterval(function(){
		var cValue = parseFloat(getStyle(obj,'opacity')) + dir;

		if(dir > 0 && cValue > target || dir < 0 && cValue < target){
			cValue = target;
		}

		obj.style.opacity = cValue;

		if(cValue === target){
			clearInterval(obj.opacityTimer);
			endFn && endFn(); 
		}
	},speed);
}

function shake(obj,attr,dir,endFn){
	var pos = parseInt(getStyle(obj,attr));
	var arr = [];
	var num = 0;
	if(obj.shaked) return;
	obj.shaked = true;
	if (obj.shaked) {
		// 加入抖动变化系数
		for (var i = 10; i > 0; i-=dir) {
			arr.push(i,-i);
		};
		arr.push(0);

		clearInterval(obj.shakeTimer);

		obj.shakeTimer = setInterval(function(){
			var cValue = pos + arr[num];
			obj.style[attr] = cValue + 'px';
			num++;

			if(num > 10){
				clearInterval(obj.shakeTimer); 
				obj.shaked = false;
				endFn && endFn();
			}
		},30);
	}
}