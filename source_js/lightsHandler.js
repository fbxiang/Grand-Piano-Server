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
        // // console.log(red, green, blue);
        this.setAllLights();
        this.sendMessage();
    };

    this.getRGB = function() {
        var rgb = blue | (green << 8) | (red << 16);
        return rgb.toString(16);
    };

    this.setRandomRGB = function() {
        red = Math.random() * 150;
        green = Math.random() * 255;
        blue = Math.random() * 255;
        this.setAllLights();
        this.sendMessage();
    };

    this.lightenPressedKey = function(pianokey) {
        var light_num = 1 + Math.floor(pianokey / NUM_PIANO_KEYS * working_lights.length);

        var inverseColor = ('000000' + (('0xffffff' ^ ('0x'+this.getRGB())).toString(16))).slice(-6);
        // var newColor = shadeBlendConvert(-1, '#' + light_colors[light_num], '#' + inverseColor.substring(2)); // make new color 50% lighter
        // light_colors[light_num] = newColor.substring(1);
        try {
            light_colors[light_num] = inverseColor.substring(2);
        }
        catch(err) {
            light_colors[light_num] = this.getRGB();
            // console.log('error with changing color of light');
        }
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
        // // console.log(message);

        if(ws.readyState === ws.OPEN){
            ws.send(message);
        }
    };
}