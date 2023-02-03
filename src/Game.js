Memory.Game = function (game) {};

var movesText = null;
var box = null;
var emitter = null;
var click = null;
var ding = null;

var rows;
var columns;

var cardWidth;
var cardSpacing;

var leftMargin;
var topMargin;

var cards; //  contains actual card elements
var cardValues; // an array with the value of each card twice
var lastClickedIndex; // the index of the card that was last clicked
var arrOfValues = []; //the first array which I'm about to modify 
var firstArray = []; //array of values shown on screen first time
var secondArray = []; // array of els shown on screen the second time

var moves;
var tilesLeft = 10;

Memory.Game.prototype = {
	create: function () {
		rows = 0
		columns = Memory.gridCols;
		cardWidth = 100;
		cardSpacing = 20;
		var topBarHeight = 60;
		var rowWidth = (cardWidth + cardSpacing) * (columns - 1) + cardWidth;
		var columnHeight = (cardWidth + cardSpacing) * (4 - 1) + cardWidth;
		leftMargin = (1000 - rowWidth) / 2;
		topMargin = (560 - topBarHeight - columnHeight) / 2 + topBarHeight;

		cards = new Array(); //  contains actual card elements
		cardValues = new Array(); // an array with the value of each card

		moves = 0;
		tilesLeft = columns * 1;

		click = this.add.audio('click');
		ding = this.add.audio('ding');

		var background = this.add.sprite(0, 0, 'gameBkgd');
		movesText = this.add.text(215, 1, "0", {
			font: "54px Arial",
			fill: "#617edf",
			fontWeight: "bold"
		});

		Memory.soundControl = this.add.button(940, 0, Memory.getPauseString(), Memory.toggleMusic);
		var quitButton = this.add.button(870, 10, 'quitButton', this.quitGame, this);

		this.createGrid();
		this.assignCards();

		emitter = this.add.emitter(500, 100, 300);
		emitter.makeParticles('confetti');
		emitter.gravity = 200;
	},

	createGrid: function () {
		for (var j = 0; j < columns; j++) {
			var c = this.add.sprite(leftMargin + (cardWidth + cardSpacing) * j,
				topMargin + (cardWidth + cardSpacing), 'card');
			cards.push(c);
			c.inputEnabled = true;
		}

		setTimeout(() => {

			nextLevel()

		}, 3000);
	},

	assignCards: function () {
		//  make an array to hold the possible values
		for (var i = 0; i < 16; i++) {
			cardValues.push(i);
		}
		//  add a value to each card
		for (var i = 0; i < cards.length; i++) {
			// get a rand num from the cardvalues arr
			var randNum = Math.floor(Math.random() * (cardValues.length));
			// assign it to the card's cardValue
			cards[i].cardValue = cardValues[randNum];
			//console.log("cards[" + i + "] has the card " + cardValues[randNum]);
			cardValues.splice(randNum, 1);
			// add a listener for clicking on the card that passes the card's index in the array as an arg
			cards[i].events.onInputDown.add(checkClick, this, 0, i);
			cards[i].clickable = true;
			cards[i].loadTexture('cards', cards[i].cardValue)

		}
	},

	winGame: function () {
		if (Memory.supportsStorage()) {
			this.saveScore();
		}

		box = this.add.sprite(500, 280, 'gameOverBox');
		box.anchor.set(0.5, 0.5);
		box.alpha = 0.9;

		var movesText = this.add.sprite(500, 60, 'movesText');
		movesText.anchor.set(0.5, 0);

		var scoresText = this.add.sprite(500, 130, 'scoreText');
		scoresText.anchor.set(0.5, 0);

		var txtMoves = this.add.text(590, 75, moves, {
			font: "54px Arial",
			fill: "#ffffff",
			fontWeight: "bold"
		});
		var txtScore = this.add.text(580, 145, localStorage[Memory.findScoreText()], {
			font: "54px Arial",
			fill: "#ffffff",
			fontWeight: "bold"
		});

		var menuBtn = this.add.button(500, 240, 'gameOverMenu', function () {
			this.state.start('MainMenu')
		}, this);
		menuBtn.anchor.set(0.5, 0);
		var replayBtn = this.add.button(500, 330, 'gameOverReplay', function () {
			this.state.start('Game')
		}, this);
		replayBtn.anchor.set(0.5, 0);
		var sizeBtn = this.add.button(500, 420, 'gameOverSize', function () {
			this.state.start('GridSelect')
		}, this);
		sizeBtn.anchor.set(0.5, 0);

		this.world.bringToTop(emitter);
		emitter.start(true, 4000, null, 100);
	},

	quitGame: function () {
		this.state.start('MainMenu');
	},

	saveScore: function () {
		var scoreString = Memory.findScoreText();

		if (localStorage[scoreString] == 0) {
			localStorage[scoreString] = moves;
		} else {
			localStorage[scoreString] = Math.min(moves, localStorage[scoreString]);
		}
	}
};


const nextLevel = (imp) => {

	setTimeout(function () {

		cards.forEach(el => {
			el.loadTexture('cards', el.cardValue);
			el.clickable = true;
		});

		if (imp) {
			imp.enabled = true;
		};


	}, 3000)

	cards.forEach(el => {
		arrOfValues.push(el.cardValue);
		firstArray.push(el.cardValue);
		el.clickable = false;
	})

	if (imp) {
		imp.enabled = false;
	}

	const filteredCardValues = cardValues.filter(function (element) {
		return arrOfValues.indexOf(element) === -1;
	});

	const shuffledArrOfValues = arrOfValues.sort(() => Math.random() - 0.5);

	let randomIndex1 = Math.floor(Math.random() * shuffledArrOfValues.length);
	let randomIndex2 = Math.floor(Math.random() * filteredCardValues.length);
	let randomElement2 = filteredCardValues[randomIndex2];
	shuffledArrOfValues.splice(randomIndex1, 1, randomElement2)

	shuffledArrOfValues.forEach(el => secondArray.push(el))

	for (var i = 0; i < arrOfValues.length; i++) {
		cards[i].cardValue = shuffledArrOfValues[i];
		cards[i].loadTexture('card');
	}

}

function checkClick(obj, x, index) {

	var c = cards[index];
	var imp = this.input.mouse;

	if (c.clickable) {

		if (!firstArray.includes(c.cardValue) && secondArray.includes(c.cardValue)) {

			// imp.enabled = true;
			ding.play();
			tilesLeft -= 1;

			arrOfValues = [];
			firstArray = [];
			secondArray = [];

			setTimeout(() => {
				cards.forEach(el => el.loadTexture('card'));
				nextLevel(imp)
			}, 3000);
			moves++;

		} else if (firstArray.includes(c.cardValue)) {
			
			// no match
			click.play();
			moves++;

		}

		movesText.text = moves;

	}
	//  check if player won game
	if (tilesLeft == 0) {
		this.winGame();
	}
}