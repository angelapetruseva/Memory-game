var Memory = {
	gridCols: 2,
	gridRows: 2,
	soundControl: null,
	music: null,
	toggleMusic: function () {
		if (!Memory.music.paused) {
			Memory.music.pause();
			Memory.soundControl.loadTexture('soundOff');
		} else {
			Memory.music.resume();
			Memory.soundControl.loadTexture('soundOn');
		}
	},
	getPauseString: function() {
		if (Memory.music.paused) {
			return 'soundOff';
		} else {
			return 'soundOn';
		}
	},
	supportsStorage: function() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}	
	},
	clearStorage: function() {
		localStorage["3score"] = 0;
		localStorage["4score"] = 0;
		localStorage["5score"] = 0;
		localStorage["6score"] = 0;
		localStorage["7score"] = 0;
		localStorage["8score"] = 0;
	},
	findScoreText: function() {
		var scoreString = "";
		
		if (Memory.gridCols == 4 && Memory.gridRows == 3) {
			scoreString = "3score";
		} else if (Memory.gridCols == 4 && Memory.gridRows == 4) {
			scoreString = "4score";
		} else if (Memory.gridCols == 5) {
			scoreString = "5score";
		} else if (Memory.gridCols == 6) {
			scoreString = "6score";
		} else if (Memory.gridCols == 7) {
			scoreString = "7score";
		} else if (Memory.gridCols == 8) {
			scoreString = "8score";
		}
		
		return scoreString;
	}
};

Memory.Boot = function (game) {

};

Memory.Boot.prototype = {
    init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = false;

        /*if (!this.game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(500, 230, 1000, 560);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }*/
    },

    preload: function () {
        //  load preloader assets
		this.load.image('menuBackground', 'assets/bkgd-menu.png');
		this.load.image('preloaderBar', 'assets/spr-loadbar.png');
    },

    create: function () {
        this.state.start('Preloader');
    }
};
