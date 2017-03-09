function Lights() {
    var NUM_LIGHTS = 7; // 0 and 6 are broken
    var NUM_PIANO_KEYS = 13;
    var working_lights = [1, 2, 3, 4, 5]
    var light_colors = ['ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff', 'ffffff'];

    var red = 0;
    var green = 0;
    var blue = 0;
    var startTick = 0;


    this.setRGB = function(r, g, b) {
        red   = r;
        green = g;
        blue  = b;
        this.setAllLights();
        this.sendMessage();
    };

    this.setColor = function(color) {
        red = parseInt(color.substring(1, 3), 16);
        green = parseInt(color.substring(3, 5), 16);
        blue = parseInt(color.substring(5, 7), 16);
        // console.log(red, green, blue);
        this.setAllLights();
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
        this.setAllLights();
        this.sendMessage();
    };

    this.lightenPressedKey = function(pianokey) {
        var light_num = 1 + Math.floor(pianokey / NUM_PIANO_KEYS * working_lights.length);
        var newColor = shadeBlendConvert(-0.3, '#' + light_colors[light_num]); // make new color 50% lighter
        light_colors[light_num] = newColor.substring(1);
        console.log(light_colors);
        this.sendMessage();
    };

    this.setAllLights = function() {
        for(var i = 0; i < NUM_LIGHTS; i++) {
            light_colors[i] = this.getRGB();
        }
    };

    this.sendMessage = function() {
        var message = '';
        for(var i = 0; i < NUM_LIGHTS - 1; i++) {
            message += light_colors[i] + ', ';
        }
        message += light_colors[NUM_LIGHTS - 1];
        console.log(message);

        if(ws.readyState === ws.OPEN){
            ws.send(message);
        }
    };
}