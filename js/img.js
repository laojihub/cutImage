/**
 * 识别试纸区域
 * 找出颜色相近的色块，肉眼可以看到的才算
 */
function cutByRect()
{
    var imgWidth = canvas.width,
        imgHeight = canvas.height,
        imgData = ctx.getImageData(0, 0, imgWidth, imgHeight),
        arr = imgData.data, //像素颜色数组
        step = 10, //计算平均值的正方形宽高
        maxWidth = imgWidth - imgWidth % step,   //有效格子的宽度，忽略边上小于step的行列
        maxHeight = imgHeight - imgHeight % step;//有效各自高度

    var x, y, x1, y1, x2, y2,pos,hsv, num , htotal;

    //循环每个颜色识别单位
    for(x = 0; x < maxWidth; x += step) {
        for(y = 0; y < maxHeight; y += step) {
            //计算每个单位的颜色平均值
            num = 0;
            htotal = 0;
            console.log([x,y]);
            for(var rectX = x; rectX < x+step; rectX++) {
                for(var rectY = y; rectY< y+step; rectY++) {
                    pos= (rectY * imgWidth + rectX) * 4;
                    htotal+= rgbToHsv(arr[pos], arr[pos + 1], arr[pos + 2]);
                    num++;
                }
            }
            hsv = parseInt(htotal / num);
            //判断颜色相似度
            if (likeBlue(hsv)) {
                console.log(hsv);
                if (x1 == undefined || x < x1) {
                    x1 = x;
                }
                if (y1 == undefined || y < y1) {
                    y1 = y;
                }
                if (x2 == undefined || x > x2) {
                    x2 = x;
                }
                if (y2 == undefined || y > y2) {
                    y2 = y;
                }
            }
        }
    }
    console.log(x1, y1, x2, y2);
    showResult(x1, y1, x2, y2);
}

/**
 * 识别试纸区域
 * 一次性读出画布像素，判断有效像素的位置
 * 效率中等
 */
function cutByImgData()
{
    var w = canvas.width,
        h = canvas.height,
        imgData = ctx.getImageData(0, 0, w, h),
        arr = imgData.data,
        hsv, x, y, x1, y1, x2, y2,pos;

    for (var i = 0; i < arr.length; i += 8) {
        pos = i / 4;
        x = pos % w;
        y = (pos - x) / w;
        hsv = rgbToHsv(arr[i], arr[i + 1], arr[i + 2]);
        //识别相近蓝色定位区域
        if (likeRed(hsv)) {
            if (x1 == undefined || x < x1) {
                x1 = x;
            }
            if (y1 == undefined || y < y1) {
                y1 = y;
            }
            if (x2 == undefined || x > x2) {
                x2 = x;
            }
            if (y2 == undefined || y > y2) {
                y2 = y;
            }
        }
    }
    showResult(x1, y1, x2, y2);
}


/**
 * 识别试纸区域
 * 逐行列获取像素，识别有效颜色
 * 效率低
 */
function cutByPixel()
{
    var pixel, data, h, x1, y1, x2, y2;
    for (var x = 0; x < canvas.width; x += 3) {
        for (var y = 0; y < canvas.height; y += 3) {
            //像素
            pixel = ctx.getImageData(x, y, 1, 1);
            //RGB
            data = pixel.data;
            //HSV模型中的H
            h = rgbToHsv(data[0], data[1], data[2]);
            //识别相近蓝色定位区域
            if (likeBlue(h)) {
                if (x1 == undefined || x < x1) {
                    x1 = x;
                }
                if (y1 == undefined || y < y1) {
                    y1 = y;
                }
                if (x2 == undefined || x > x2) {
                    x2 = x;
                }
                if (y2 == undefined || y > y2) {
                    y2 = y;
                }
            }
        }
    }
    showResult(x1, y1, x2, y2);
}

/**
 * 指定坐标画矩形，测试用
 */
function showResult(x1, y1, x2, y2)
{
    if (x1 == undefined) return false;

    var w = x2 - x1;
    var h = y2 - y1;

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.rect(x1, y1, w, h);
    ctx.stroke();
}
/**
 * RGB 转 HSV，根据H值判断颜色域
 */
function rgbToHsv(r, g, b)
{
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;

    if (max == min) {
        h = 0;
    } else if (max == r && g >= b) {
        h = 60 * (g - b) / (max - min);
    } else if (max == r && g < b) {
        h = 60 * (g - b) / (max - min) + 360;
    } else if (max == g) {
        h = 60 * (b - r) / (max - min) + 120;
    } else if (max == b) {
        h = 60 * (r - g) / (max - min) + 240;
    }

    return h;
}
/**
 * 蓝色
 */
function likeBlue(h)
{
    return h >= 230 && h < 240;
}
/**
 * 绿色
 */
function likeGreen(h)
{
    return h >= 70 && h <= 154;
}
/**
 * 黄色
 */
function likeYellow(h)
{
    return h >= 52 && h <= 68;
}
/**
 * 红色
 */
function likeRed(h)
{
    return (h >= 0 && h <= 20) || (h >= 340 && h <= 360);
}