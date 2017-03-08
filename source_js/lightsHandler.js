function Lights() {
    var red = 0;
    var green = 0;
    var blue = 0;
    var startTick = 0;

    this.setRGB = function(r, g, b) {
        red   = r;
        green = g;
        blue  = b;
    }

    this.getRGB = function() {
        var rgb = blue | (green << 8) | (red << 16);
        return '#' + rgb.toString(16);
    }


}