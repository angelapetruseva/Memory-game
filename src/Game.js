Memory.Game = function (game) {};

var correctText = null;
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

var helper = true;

var correct;
var count;
var moves;

var timer = null;

var rows;

var checkWin;

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

		moves = 0;
		count = 30;
		correct = 0;

		function destroyer(st) {
			if (st) {
				st.destroy(true)
			};
		}
		destroyer(right)
		destroyer(wrong)
		destroyer(txt2)
		destroyer(txt)


		click = this.add.audio('click');
		ding = this.add.audio('ding');

		var background = this.add.sprite(0, 0, 'gameBkgd');

		timer = setInterval(() => {
			if (count === 0) {
				checkWin();
				clearInterval(timer)
			} else if (count > 0) {
				count = count - 1;

			}
			if (txt4 && txt3 && txt5) {
				txt4.text = `Време: ${count}`;
				txt3.text = `Погодоци: ${correct}`;
				txt5.text = `Потези: ${moves}`;
			}

		}, 1000)


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
		var quitButton = this.add.button(0, 11, 'quitButton', this.quitGame, this);

		cards = [];
		cardValues = [];

		this.createGrid();
		this.assignCards();

		emitter = this.add.emitter(500, 100, 300);
		emitter.makeParticles('confetti');
		emitter.gravity = 200;

		checkWin = () => {
			this.winGame()
			destroyer(right)
			destroyer(wrong)
			destroyer(txt2)
			destroyer(txt)
			cards.forEach(el => el.clickable = false)
			arrOfValues = [];
			firstArray = [];
			secondArray = [];
			cards = [];
			cardValues = [];
			count = 30;
		}

		if (Memory.supportsStorage()) {
			this.saveScore();
		}
		if (right) {
			right.destroy(true);
		};
		if (wrong) {
			wrong.destroy(true);
		};
		if (txt) {
			txt.destroy(true);
		};

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
			cards[i].clickable = false;
			cards[i].events.onInputDown.add(checkClick, this, 0, i);
			cards[i].loadTexture('cards', cards[i].cardValue)

		}
	},

	winGame: function () {
		if (Memory.supportsStorage()) {
			this.saveScore();
		}
		if (right) {
			right.destroy(true);
		};
		if (wrong) {
			wrong.destroy(true);
		};
		if (txt) {
			txt.destroy(true);
		};
		if (txt2) {
			txt2.destroy(true);
		};

		box = this.add.sprite(500, 280, 'gameOverBox');
		box.anchor.set(0.5, 0.5);

		var scoresText = this.add.sprite(500, 130, 'scoreText');
		scoresText.anchor.set(0.5, 0);

		var thisScore = this.add.sprite(500, 82, 'correctText');
		thisScore.anchor.set(0.5, 0);

		var txtMoves = this.add.text(650, 95, correct, {
			font: "40px Arial",
			fill: "#ffffff",
			fontWeight: "bold"
		});
		var txtScore = this.add.text(700, 145, localStorage[Memory.findScoreText()], {
			font: "40px Arial",
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
		if (txt2) {
			txt2.destroy(true);
		};
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


function nextLevel(imp, arg) {

	if (cards.length > 0) {

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
			});

			if (imp) {
				imp.enabled = true;
			};
		}, 500)


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

}

function checkClick(obj, x, index) {

	var c = cards[index];
	var imp = this.input.mouse;


	if (c) {
		if (c.clickable) {

			if (!firstArray.includes(c.cardValue) && secondArray.includes(c.cardValue)) {

				imp.enabled = true;
				moves++;
				correct++;
				ding.play();

				arrOfValues = [];
				firstArray = [];
				secondArray = [];

				if (wrong) {
					wrong.destroy(true)

				}

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
					c.clickable = true;
					imp.enabled = true;
				}, 500);

				setTimeout(() => {
					cards.forEach(el => {
						el.loadTexture('card');
					});
					nextLevel(imp, this)
				}, 3000);

			} else if (firstArray.includes(c.cardValue)) {

				moves++;
				// no match
				wrong = this.add.sprite(200, 0, 'wrong', {
					setScale: .5,
				});

				c.clickable = false;
				c.inputEnabled = false;

				setTimeout(() => {
					wrong.destroy(true)
					c.clickable = true;
					c.inputEnabled = true;
				}, 500);

				click.play();

			}
		}
	}

}