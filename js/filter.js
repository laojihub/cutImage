/**
 * 复古滤镜算法
 * @param  imgData canvas中像素数据
 * @returns array
 */
function filterImage(imgData) {
    var r, g, b, d = imgData.data;
    for (var i = 0; i < d.length; i += 4) {
        r = d[i];
        g = d[i + 1];
        b = d[i + 2];

        d[i] = (r * 0.393) + (g * 0.769) + (b * 0.189); // red
        d[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168); // green
        d[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131); // blue
    }
    return imgData;
}
