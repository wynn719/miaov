// 无兼容性问题啦！
window.onload = function(){
    

    var oMain = document.getElementById('main');

    for (var i = 0; i < data.length; i++) {
        var oDiv = document.createElement('div');
        oDiv.className = 'box clearfix';
        oMain.appendChild(oDiv);
    };

    var aDiv = oMain.getElementsByTagName('div');   

    for (var i = 0; i < aDiv.length; i++) {
        
        aDiv[i].index = i;
        getList(aDiv[i], data);

        // 控制序号点击
        aDiv[i].children[0].onclick = function(){
            var oSpan = this;
            var oDiv = this.parentNode;
            var oDl = oDiv.children[1];

            boxToggle(oSpan, oDl, oDiv);
        }

        // 控制块点击
        aDiv[i].children[1].children[0].onclick = function(){
            var oDl = this.parentNode;
            var oDiv = this.parentNode.parentNode;
            var oSpan = oDiv.children[0];
            
            boxToggle(oSpan, oDl, oDiv);
        }
    }

};

function getList (obj,data) {
    obj.on = false; // 控制点击状态
    _idx = obj.index;

    var oSpan = document.createElement('span');
    oSpan.innerHTML = _idx + 1;

    obj.appendChild(oSpan);
    var oDl = document.createElement('dl');
    var oDt = document.createElement('dt');
    oDt.innerHTML = data[_idx].title;

    oDl.appendChild(oDt);

    for(con in data[_idx].content){
        var oDd = document.createElement('dd');
        var oA = document.createElement('a');
        oA.innerHTML = data[_idx].content[con].text;
        oA.href = data[_idx].content[con].link;
        oDd.appendChild(oA);
        oDl.appendChild(oDd);
    }
    
    obj.appendChild(oDl);
}

// 盒子展开与收缩动作
function boxToggle(oSpan, oDl, oDiv){
    // 计算dl的真实高度
    var iDlHeight = 0;
    for (var i = 0; i < oDl.children.length; i++) {
        iDlHeight += oDl.children[i].offsetHeight;
    }

    if (!oDiv.on) {
        startMove(oSpan, {height : iDlHeight,lineHeight : iDlHeight});
        startMove(oDl, {height : iDlHeight});
        oDiv.on = true;
    }else{
        startMove(oSpan, {height : 40,lineHeight : 40});
        startMove(oDl, {height : 40});
        oDiv.on = false;
    }
};

// 封装获取样式函数
function css(obj, attr){
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
};

/*bug: 暂无*/
function startMove (obj, json, fn) {
    clearInterval(obj.iTimer);

    var iCur = 0;// 未运动前的样式值
    var iAfter = 0;// 运动后的样式值
    var iSpeed = 0;// 初始化速度

    obj.iTimer = setInterval(function(){
        var bBtn = true;// 控制运动状态是否完结

        for(var attr in json){
            var iTarget = json[attr];

            if (attr == 'opacity') {
                // Math.round(x)把一个数字舍入为最接近的整数
                iCur = Math.round(css(obj, 'opacity') * 100);
            }else{
                iCur = parseInt(css(obj, attr));
            }

            // 计算缓冲后的速度
            iSpeed = (iTarget - iCur) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            if (iCur !== iTarget) {
                bBtn = false;
                iAfter = iCur + iSpeed;
                if (attr == 'opacity') {
                    obj.style.opacity = (iAfter) / 100;
                    // 兼容ie7及以下
                    obj.style.filter = 'alpha(opacity=' + iAfter + ')';
                }else{
                    // 防止运动越界的 bug（不再需要）
                    /*if (iSpeed > 0 && iAfter > iTarget || iSpeed < 0 && iAfter < iTarget) {
                        iAfter = iTarget;
                    }*/

                    obj.style[attr] = iAfter + 'px';
                }
            }
        }

        if (bBtn) {
            clearInterval(obj.iTimer);
            // 如果回调函数存在，调用回调函数
            fn && fn();
        }

    }, 15);
};