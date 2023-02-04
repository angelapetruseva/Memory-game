Memory.Game = function (game) {};

var movesText = null;
var box = null;
var emitter = null;
var click = null;
var ding = null;
var wrong = null;
var right = null;

var txt = null;
var txt2 = null;
var txt3 = null;
var txt4 = null;
var txt5 = null;

var correct = 0;
var count = 5;
var moves;

var rows;

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

Memory.Game.prototype = {
	create: function () {
		rows = 0
		tilesLeft = Memory.gridCols;
		cardWidth = 100;
		cardSpacing = 20;
		var topBarHeight = 60;
		var rowWidth = (cardWidth + cardSpacing) * (tilesLeft - 1) + cardWidth;
		var columnHeight = (cardWidth + cardSpacing) * (4 - 1) + cardWidth;
		leftMargin = (1000 - rowWidth) / 2;
		topMargin = (560 - topBarHeight - columnHeight) / 2 + topBarHeight;

		cards = new Array(); //  contains actual card elements
		cardValues = new Array(); // an array with the value of each card

		moves = 0;

		click = this.add.audio('click');
		ding = this.add.audio('ding');

		var background = this.add.sprite(0, 0, 'gameBkgd');

		// txt.destroy(true)
		txt3 = this.add.text(170, 330, `Погодоци: ${correct}`, {
			font: "50px Arial",
			fill: "white",
		});
		txt4 = this.add.text(170, 390, `Време: ${count}`, {
			font: "50px Arial",
			fill: "white",
		});
		txt5 = this.add.text(170, 450, `Потези: ${moves}`, {
			font: "50px Arial",
			fill: "white",
		});

		Memory.soundControl = this.add.button(940, 0, Memory.getPauseString(), Memory.toggleMusic);
		var quitButton = this.add.button(10, 11, 'quitButton', this.quitGame, this);

		this.createGrid();
		this.assignCards();

		emitter = this.add.emitter(500, 100, 300);
		emitter.makeParticles('confetti');
		emitter.gravity = 200;
	},

	createGrid: function () {

		for (var j = 0; j < tilesLeft; j++) {
			var c = this.add.sprite(leftMargin + (cardWidth + cardSpacing) * j,
				topMargin + (cardWidth + cardSpacing), 'card');
			cards.push(c);
			c.inputEnabled = true;
		}

		txt2 = this.add.text(170, 100, "Гледај ги сликите внимателно:", {
			font: "50px Arial",
			fill: "white",
		});


		setTimeout(() => {

			nextLevel(null, this);

		}, 3000);
	},

	assignCards: function () {
		//  make an array to hold the possible values
		for (var i = 0; i < 12; i++) {
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
			cards[i].events.onInputDown.add(checkClick, false, this, 0, i);
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

		var scoresText = this.add.sprite(500, 130, 'scoreText');
		scoresText.anchor.set(0.5, 0);

		// var txtMoves = this.add.text(700, 75, moves, {
		// 	font: "40px Arial",
		// 	fill: "#ffffff",
		// 	fontWeight: "bold"
		// });
		// var txtScore = this.add.text(700, 145, localStorage[Memory.findScoreText()], {
		// 	font: "40px Arial",
		// 	fill: "#ffffff",
		// 	fontWeight: "bold"
		// });

		// count = 30;
		// correct = 0;



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
			localStorage[scoreString] = correct;
		} else {
			localStorage[scoreString] = Math.min(correct, localStorage[scoreString]);
		}
	}
};

// function over(sprite) {
// 	sprite.alpha = 0.5;
// }

// function out(sprite) {
// 	sprite.alpha = 1;
// }

function nextLevel(imp, arg) {

	txt2.destroy(true);

	setTimeout(function () {

		if (arg) {
			txt = arg.add.text(170, 100, "Одбери која слика се смени:", {
				font: "50px Arial",
				fill: "white",
			});
		}

		cards.forEach(el => {
			el.loadTexture('cards', el.cardValue);
			el.clickable = true;
			// 			el.inputEnabled = true;
			// el.input.useHandCursor = true;
			// el.events.onInputOver.add(over, this);
			// el.events.onInputOut.add(out, this);
		});

		if (imp) {
			imp.enabled = true;
		};
	}, 500)


	cards.forEach(el => {
		arrOfValues.push(el.cardValue);
		firstArray.push(el.cardValue);
		el.clickable = false;
		// el.events.onInputOver.removeAll();
		// el.events.onInputOut.removeAll();
		// el.events.onInputDown.removeAll();
		// el.input.useHandCursor = false;
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

var counter = setInterval(timer, 1000)

function timer() {
	// if (count == 0) {
	// 	checkClick(checkWin);
	// } else {
	count = count - 1;
	if (count < 0) {
		clearInterval(counter);
		checkClick(true);
		count = 30;

		return;
	}
	if (txt4 && txt3 && txt5) {
		txt4.text = `Време: ${count}`;
		txt3.text = `Погодоци: ${correct}`;
		txt5.text = `Потези: ${moves}`;
	}

	// }

}

function checkClick(checkWin, sth, sth2, index) {
	//  check if player won game
	if (!checkWin) {

		var c = cards[index];
		var imp = this.input.mouse;

		if (c.clickable) {

			if (!firstArray.includes(c.cardValue) && secondArray.includes(c.cardValue)) {

				// imp.enabled = true;
				correct++;
				ding.play();
				// tilesLeft -= 1;

				arrOfValues = [];
				firstArray = [];
				secondArray = [];

				right = this.add.sprite(200, 0, 'right', {
					setScale: .5,
				});

				setTimeout(() => {
					right.destroy(true);
					txt.destroy(true)
					txt2 = this.add.text(170, 100, "Гледај ги сликите внимателно:", {
						font: "50px Arial",
						fill: "white",
					});
				}, 500);

				setTimeout(() => {
					cards.forEach(el => {
						// el.events.onInputOver.removeAll();
						// el.events.onInputOut.removeAll();
						el.loadTexture('card');
					});
					nextLevel(imp, this)
				}, 3000);
				moves++;

			} else if (firstArray.includes(c.cardValue)) {

				// no match
				wrong = this.add.sprite(200, 0, 'wrong', {
					setScale: .5,
				});

				setTimeout(() => {
					wrong.destroy(true)
				}, 500);

				click.play();
				moves++;

			}


		}
	} else {
		console.log(this.winGame);
		arrOfValues = [];
		firstArray = [];
		secondArray = [];
	}
}