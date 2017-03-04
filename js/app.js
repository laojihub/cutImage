!(function(e){
    //画布
    var canvas = document.getElementById("canvas");
    //工具
    var ctx = canvas.getContext("2d");
    //文件
    var file = document.getElementById("file");
    //URL
    var URL = window.URL || window.webkitURL;
    //跟踪器
    var tracker = new tracking.ColorTracker(['blue']);

    var tempImg;

    /**
     * 选择/拍照
     */
    file.onchange = function () {
        var files = this.files,
            file;

        if (files && files.length > 0) {
            file = files[0];
            //图片类型
            if (/^image\/\w+$/.test(file.type)) {
                analysisImage(readBlob(file));
            }
        }
    };

    /**
     * 跟踪事件
     */
    tracker.on('track', function(event) {
        var num = event.data.length;
        //仅当找到两个定位才算正确，其他的忽略
        if(num != 2) {
            addLogs("找到"+num+"个蓝色定位");
            return false;
        }else{
            addLogs("找到2个蓝色定位");
        }
        //计算试纸区域
        var x1,y1,x2,y2;
        event.data.forEach(function(rect) {
            if(x1 == undefined || x1 > rect.x) {
                x1 = rect.x;
            }
            if(y1 == undefined || y1 > rect.y) {
                y1 = rect.y;
            }
            if(x2 == undefined || x2 < (rect.x + rect.width)) {
                x2 = (rect.x + rect.width);
            }
            if(y2 == undefined || y2 < (rect.y + rect.height)) {
                y2 = rect.y + rect.height;
            }
        });
        //显示裁剪结果
        showResult(x1,y1,x2,y2);
    });

    /**
     * 分析图片
     */
    function analysisImage(url) {
        addLogs("开始分析");
        tempImg = new Image();
        tempImg.onload = function () {
            tracking.track(tempImg, tracker);
        };
        tempImg.src = url;
    }

    /**
     * 读取base64
     */
    function readBase64(file, callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
            typeof callback == "function" && callback(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    /**
     * 读取blob url
     */
    function readBlob(file) {
        return URL.createObjectURL(file);
    }

    /**
     * 显示裁剪结果
     */
    function showResult(x1,y1,x2,y2)
    {
        //边距
        var dist = 30;
        //坐标矫正，剪切不要太靠近试纸
        x1 = (x1 - dist) < 0 ? 0 : x1 - dist;
        y1 = (y1 - dist) < 0 ? 0 : y1 - dist;

        x2 = (x2 + dist) >  tempImg.width ? tempImg.width : (x2 + dist);
        y2 = (y2 + dist) >  tempImg.height ? tempImg.height : (y2 + dist);

        var width = x2 - x1;
        var height = y2 - y1;
        //判断倾斜度
        checkPosition(width,height);

        //绘制原图
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;
        ctx.drawImage(tempImg,0,0,tempImg.width,tempImg.height);
        //原图裁剪
        var imgData = ctx.getImageData(x1,y1,width,height);
        var canvas2 = document.createElement("canvas");
        var ctx2 = canvas2.getContext("2d");

        canvas2.width = width;
        canvas2.height = height;
        ctx2.putImageData(imgData,0,0);

        showPreview(canvas2.toDataURL());
        addLogs("已做裁剪");
    }

    /**
     * 判断倾斜度，在30-60度(0.5-1.7)提示太倾斜
     */
    function checkPosition(w,h)
    {
        var tan = Math.round(w / h * 10) /10;
        if(tan >= 0.5 && tan <= 1.7) {
            addLogs("倾斜角度过大");
        }
    }

    /**
     * 显示裁剪后的预览图
     */
    function showPreview(url)
    {
        var result = document.getElementById("result");
        var img = new Image();

        result.innerHTML = "";
        img.onload = function(){
            if(img.width > img.height) {
                img.style.width = "100%";
                img.style.height = "auto";
            }else{
                img.style.width = "auto";
                img.style.height = "100%";
            }
            result.appendChild(img);
        };
        img.src = url;
    }

    /**
     * 显示分析日志
     */
    function addLogs(txt)
    {
        var logs = document.getElementById("logs");
        var p = document.createElement("p");
        var date = new Date();
        var time = date.toLocaleTimeString();
        p.innerText  =time + "： "  + txt ;

        if(logs.firstChild) {
            logs.insertBefore(p,logs.firstChild);
        }else{
            logs.appendChild(p);
        }
    }

    /**
     * 刷新
     */
    e.refresh = function(){
        window.location.href = window.location.pathname + "?" +  Math.random();
    };

})(window);