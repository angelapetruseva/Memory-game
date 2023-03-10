Memory.Scores = function (game) {};

var s1Text;
var s2Text;
var s3Text;
var s4Text;
var s5Text;
var s6Text;

Memory.Scores.prototype = {
	create: function () {
		var bkgd = this.add.sprite(0, 0, 'bkgd');
		
		Memory.soundControl = this.add.button(940, 0, Memory.getPauseString(), Memory.toggleMusic);
		
		var title = this.add.image(500, 20, 'scoreTitle');
		title.anchor.set(0.5, 0);
		
		var s1 = this.add.image(100, 120, 'scoreTiny');
		var s2 = this.add.image(100, 225, 'scoreMed1');
		var s3 = this.add.image(100, 330, 'scoreLarge');
		var s4 = this.add.image(550, 120, 'scoreSmall');
		var s5 = this.add.image(550, 225, 'scoreMed2');
		var s6 = this.add.image(550, 330, 'scoreHuge');
		
		s1Text = this.add.text(300, 135, localStorage["3score"], {font: "64px Arial", fill: "#ffffff"});
		s2Text = this.add.text(300, 240, localStorage["5score"], {font: "64px Arial", fill: "#ffffff"});
		s3Text = this.add.text(320, 347, localStorage["7score"], {font: "64px Arial", fill: "#ffffff"});
		s4Text = this.add.text(770, 147, localStorage["4score"], {font: "64px Arial", fill: "#ffffff"});
		s5Text = this.add.text(770, 240, localStorage["6score"], {font: "64px Arial", fill: "#ffffff"});
		s6Text = this.add.text(770, 350, localStorage["8score"], {font: "64px Arial", fill: "#ffffff"});
		
		if (Memory.supportsStorage()) {
			var clearButton = this.add.button(525, 450, 'clearButton', function() {Memory.clearStorage(); this.refreshText()}, this);
		}
		
		var backButton = this.add.button(225, 450, 'backButton', this.gotoMenu, this);
	},
	
	refreshText: function() {
		s1Text.text = localStorage["3score"];
		s2Text.text = localStorage["4score"];
		s3Text.text = localStorage["5score"];
		s4Text.text = localStorage["6score"];
		s5Text.text = localStorage["7score"];
		s6Text.text = localStorage["8score"];
	},

	gotoMenu: function () {
		this.state.start('MainMenu');
	}
};
