function Lights() {
    var NUM_LIGHTS = 7;

    var red = 0;
    var green = 0;
    var blue = 0;
    var startTick = 0;

    this.setRGB = function(r, g, b) {
        red   = r;
        green = g;
        blue  = b;

        this.sendMessage();
    };

    this.setColor = function(color) {
        red = parseInt(color.substring(1, 3), 16);
        green = parseInt(color.substring(3, 5), 16);
        blue = parseInt(color.substring(5, 7), 16);
        console.log(red, green, blue);
        this.sendMessage();
    };

    this.getRGB = function() {
        var rgb = blue | (green << 8) | (red << 16);
        return rgb.toString(16);
    };

    this.setRandomRGB = function() {
        red = Math.random() * 255;
        green = Math.random() * 255;
        blue = Math.random() * 255;

        this.sendMessage();
    }

    this.pulse = function() {

    };

    this.sendMessage = function() {
        var message = '';
        for(var i = 0; i < NUM_LIGHTS - 1; i++) {
            message += this.getRGB() + ', ';
        }
        message += this.getRGB();
        console.log(message);

        if(ws.readyState === ws.OPEN){
           // Do your stuff...
            ws.send(message);
        }
    };
}