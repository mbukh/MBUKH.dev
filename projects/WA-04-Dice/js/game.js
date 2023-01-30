"use strict";

const LONGER_WAIT_MILLISECONDS = 4500;
const LONG_WAIT_MILLISECONDS = 2500;
const SHORT_WAIT_MILLISECONDS = 300;

let COUNT_PLAYERS;
let MAX_SCORE;
let gameUI;
let gameData;

// ==================
// ==================
//  Game Engine Init
// ==================

// Disable text version if UI is available
// if (!gameUI.playersUI) gameLoop(gameData);

function initGame() {
    const players = [];
    for (let id = 1; id <= COUNT_PLAYERS; id++) {
        players.push(new Player(pickFunnyUsername()));
        if (gameUI)
            gameUI.playersUI[id - 1].updateUserName(players[id - 1].name);
    }
    const game = new Game(players);
    const gameController = new GameController(game);
    return { players, game, gameController };
}

function gameLoop({ game, players, gameController }) {
    // Text version game loop
    const letsPlay = true;
    while (letsPlay) {
        // NEXT GAME ROUTINE
        gameController.nextStep("restart");
        console.table(players);
        console.table(game);
        while (!game.endGame) {
            // ONE GAME ROUTINE
            gameController.nextStep();
            console.table(players);
            console.table(game);
            game.looser = players.find((pl) => pl.score > game.maxScore);
            game.winner = players.find((pl) => pl.score === game.maxScore);
            game.endGame = game.looser || game.winner;
        }
        // UPDATE WINNER SCORE
        if (game.looser) game.updateRoundViaLooser();
        else if (game.winner) game.updateRoundViaWinner();
    }
}

// =================
// =================
//  Game Controller
// =================

function GameController(game) {
    this.nextStep = (forceTask) => {
        const options = [
            "fullReset",
            "roll",
            "hold",
            "renameUser",
            "startGame",
        ];
        const task = forceTask;
        // || prompt("Next step (" + options.join(", ") + "): ");
        switch (task) {
            case options[0]:
                // full reset
                console.log(task);
                game.fullReset();
                break;
            case options[1]:
                // roll
                console.log(task);
                game.rollDice();
                break;
            case options[2]:
                // hold
                console.log(task);
                game.holdScore();
                break;
            case options[3]:
                // rename user
                console.log(task);
                game.renameUser();
                break;
            case options[4]:
                // start game
                console.log(task);
                game.start();
                break;
            default:
                // roll;
                break;
        }
    };
}

// =========
// =========
//  Classes
// =========

function Player(name) {
    this.name = name || "Ask user for name";
    this.score = 0;
    this.currentScore = 0;
    this.wins = 0;
    this.setNewName = () =>
        (this.name = escapeHTMLChars(prompt("Please enter name: ")));
    this.newGame = () => {
        this.currentScore = 0;
        this.score = 0;
    };
    this.addDice = (dice) => {
        this.currentScore += dice.reduce((acc, e) => acc + e);
    };
    this.clearCurrentScore = () => (this.currentScore = 0);
    this.holdScore = () => {
        this.score += this.currentScore;
        this.currentScore = 0;
    };
    this.updateGamesWon = () => (this.wins += 1);
}

function Game(players) {
    this.players = players;
    this.winner = null;
    this.looser = null;
    this.maxScore = MAX_SCORE;
    this.turn = 0;
    this.diceCount = 2;
    this.diceSides = 6;
    this.dice = [];
    this.canHold = false;
    this.canRoll = true;
    this.endGame = false;
    this.start = () => {
        this.turn = 0;
        gameUI.playersUI[this.turn].makeActive();
        gameUI.diceUI.updatePlayerTurn(players[this.turn].name);
    };
    this.setMaxScore = (maxScore) => (this.maxScore = maxScore);
    // this.setDiceSides = () =>
    //     (this.diceSides = prompt("Choose dice (d6, d20): D"));
    this.rollDice = () => {
        if (!this.canRoll) return;
        this.canRoll = false;
        this.canHold = false;
        this.dice = Array.from({ length: this.diceCount }, () =>
            getRandomNumber(1, this.diceSides)
        );
        if (hasDuplicateValue(this.dice, 6)) {
            this.clearCurrentScore();
            console.log("Wow! Wow! Wow! Wow! Wow! Wow! Wow! Wow! ");
        } else {
            // update current score
            players[this.turn].addDice(this.dice);
        }
        console.log(`Player #${this.turn}: ${this.dice}`);
        // UI
        gameUI.diceUI.renderDice(this.dice);
        gameUI.playersUI[this.turn].updateCurrentScore(
            players[this.turn].currentScore
        );
        gameUI.diceUI.actionsDisabled();
        setTimeout(() => {
            this.canHold = players[this.turn].currentScore > 0;
            gameUI.diceUI.rollEnabled();
            if (this.canHold) gameUI.diceUI.actionsEnabled();
            this.canRoll = true;
        }, SHORT_WAIT_MILLISECONDS);
    };
    this.clearCurrentScore = () => {
        players[this.turn].clearCurrentScore();
        // UI
        gameUI.playersUI[this.turn].clearCurrentScore();
    };
    this.holdScore = () => {
        const nextPlayerName = players[this.whoseNextTurn()].name;
        let timeout = LONG_WAIT_MILLISECONDS;
        if (!this.canHold) return;
        players[this.turn].holdScore();
        if (players[this.turn].score === 0) timeout = LONGER_WAIT_MILLISECONDS;
        console.log(players[this.turn].score);
        // WIN - LOSE conditions
        this.looser = players.find((pl) => pl.score > this.maxScore);
        this.winner = players.find((pl) => pl.score === this.maxScore);
        this.endGame = this.looser || this.winner;
        if (this.looser) this.updateRoundViaLooser();
        else if (this.winner) this.updateRoundViaWinner();
        // UI Update Users
        if (!this.endGame) {
            // normal gameplay
            gameUI.playersUI[this.turn].progressAlongPath(
                (players[this.turn].score * 100) / (this.maxScore + 0.01)
            );
        } else {
            // loose
            if (this.looser) {
                console.table(this.looser);
                gameUI.playersUI[this.turn].loseGame();
                players.forEach((pl, i) => {
                    if (pl !== this.looser) {
                        gameUI.playersUI[i].MAX_TURNS += 1;
                        gameUI.playersUI[i].winGame();
                        gameUI.playersUI[i].addCoaster();
                        gameUI.playersUI[i].updateWins(players[i].wins);
                    }
                });
            } else if (this.winner) {
                gameUI.playersUI[this.turn].MAX_TURNS += 1;
                gameUI.playersUI[this.turn].addCoaster();
                gameUI.playersUI[this.turn].winGame();
                gameUI.playersUI[this.turn].updateWins(players[this.turn].wins);
            }
            this.newGame();
        }
        // UI Update score
        console.log(players[this.turn].currentScore);
        gameUI.playersUI[this.turn].updateCurrentScore(0);
        gameUI.playersUI[this.turn].updateScore(players[this.turn].score);
        gameUI.diceUI.actionsDisabled();
        gameUI.diceUI.hide();
        gameUI.diceUI.updatePlayerTurn(nextPlayerName);
        gameUI.diceUI.clear();
        // Timeout Switch user: UI & GAME
        setTimeout(() => {
            gameUI.playersUI[this.turn].makeInactive();
            gameUI.playersUI[this.whoseNextTurn()].makeActive();
            gameUI.diceUI.show();
            gameUI.diceUI.rollEnabled();
            this.nextTurn();
        }, timeout);
        this.canHold = false;
    };
    this.nextTurn = () => {
        this.turn = (this.turn + 1) % players.length;
        console.log(`turn by player #${this.turn}`);
    };
    this.whoseNextTurn = () => (this.turn + 1) % players.length;
    this.playersZeroScore = () => players.forEach((pl) => pl.newGame());
    this.newGame = () => {
        this.winner = null;
        this.looser = null;
        this.endGame = false;
    };
    this.updateRoundViaLooser = () => {
        // i would change this behavior
        // when one looses other continue their ways
        players.forEach((pl, i) => {
            if (pl !== this.looser) {
                pl.updateGamesWon();
            }
        });
        this.playersZeroScore();
    };
    this.updateRoundViaWinner = () => {
        this.winner.updateGamesWon();
        this.playersZeroScore();
    };
    this.renameUser = () => {
        players[this.turn].setNewName();
    };
    this.fullReset = () => {
        gameData = null;
        gameUI.playersUI.forEach((el) => {
            el.playerDiv.remove();
        });
        gameUI = null;
        // remove event listeners from Dice
        const dice = document.querySelector("#dice");
        const newDice = dice.cloneNode(true);
        dice.replaceWith(newDice);

        modalWelcomeScreen();
    };
}

// =========
// =========
//   UTILS
// =========

function escapeHTMLChars(str) {
    // Escape html characters string
    const tagsToReplace = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
    };
    return str.replace(/[&<>]/g, (tag) => tagsToReplace[tag] || tag);
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hasDuplicateValue(arr, value) {
    return arr.indexOf(value) !== arr.lastIndexOf(value);
}

function pickFunnyUsername() {
    const names = [
        "Generic",
        "Player",
        "Notimer",
        "BadKarma",
        "casanova",
        "OP rah",
        "Something",
        "Everybody",
        "IYELLALOT",
        "heyyou",
        "Babushka",
        "kim chi",
        "iNeed2p",
        "fatBatman",
        "FreeHugz",
        "ima robot",
        "ChopSuey",
        "B Juice",
        "SweetP",
        "PNUT",
        "Snax",
        "Nuggetz",
        "Schmoople",
        "Unic0rns",
        "peap0ds",
        "BabyBluez",
        "MangoGoGo",
        "DirtBag",
        "FurReal",
        "WakeAwake",
        "kokonuts",
    ];
    return names[getRandomNumber(0, names.length - 1)];
}
