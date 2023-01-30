"use strict";

const LONGER_WAIT_MILLISECONDS = 3500;
const LONG_WAIT_MILLISECONDS = 2500;
const SHORT_WAIT_MILLISECONDS = 300;
const DICE_ROLL_COUNT = 5;

let gameUI;
let gameData;
let gameController;

// =====================
// =====================
//   Data input Handle
// =====================

function prepareGameData({ playersNumber, playersAINumber, maxScore }) {
    if (playersNumber + playersAINumber > 0 && maxScore > 0) {
        gameUI = initGameUI({
            maxScore: maxScore,
            countPlayers: playersNumber + playersAINumber,
        });
        gameData = initGame({
            maxScore: maxScore,
            playersNumber: playersNumber,
            playersAINumber: playersAINumber,
        });
        gameController = new GameController(gameData.game);
    }
    modal.style.display = "";
    gameController.nextStep("startGame");
}

// ==================
// ==================
//  Game Engine Init
// ==================

// Disable text version if UI is available
// if (!gameUI.playersUI) gameLoop(gameData);

function initGame({ maxScore, playersNumber, playersAINumber }) {
    const players = [];
    for (let id = 0; id < playersNumber; id++) {
        const name = pickFunnyUsername();
        players.push(new Player(name));
        gameUI.playersUI[id].updateUserName(players[id].name);
    }
    // AI
    for (let id = playersNumber; id < playersNumber + playersAINumber; id++) {
        const name = pickNameAI();
        players.push(new AIPlayer(name));
        gameUI.playersUI[id].updateUserName(players[id].name);
    }
    gameUI.diceUI.updateRollCountLeft(DICE_ROLL_COUNT);

    console.log(gameUI.playersUI);
    console.log(players);
    const game = new Game({ players, maxScore });
    return { game, players };
}

// =================
// =================
//  Game Controller
// =================

class GameController {
    constructor(game) {
        this.game = game;
    }
    options = [
        "fullReset",
        "roll",
        "hold",
        "renameUser",
        "startGame",
        "rollAI",
        "holdAI",
    ];
    nextStep = (task) => {
        switch (task) {
            case this.options[0]:
                // full reset
                console.log(task);
                this.game.fullReset();
                break;
            case this.options[1]:
                // roll
                console.log(task);
                this.game.rollDice();
                break;
            case this.options[2]:
                // hold
                console.log(task);
                this.game.holdScore();
                break;
            case this.options[3]:
                // rename user
                console.log(task);
                this.game.renameUser();
                break;
            case this.options[4]:
                // start game
                console.log(task);
                this.game.start();
                break;
            case this.options[5]:
                // rollAI
                console.log(task);
                this.game.rollDice("AI");
                break;
            case this.options[6]:
                // holdAI
                console.log(task);
                this.game.holdScore("AI");
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

class Player {
    constructor(name) {
        this.name = name || "Ask user for name";
    }
    score = 0;
    currentScore = 0;
    wins = 0;
    setNewName = () =>
        (this.name = escapeHTMLChars(prompt("Please enter name: ")));
    newGame = () => {
        this.currentScore = 0;
        this.score = 0;
    };
    addDice = (dice) => {
        this.currentScore += dice.reduce((acc, e) => acc + e);
    };
    clearCurrentScore = () => (this.currentScore = 0);
    holdScore = () => {
        this.score += this.currentScore;
        this.currentScore = 0;
    };
    updateGamesWon = () => (this.wins += 1);
}

class Game {
    constructor({ players, maxScore }) {
        this.players = players;
        this.maxScore = maxScore;
    }
    winner = null;
    looser = null;
    turn = 0;
    rollCount = 5;
    diceCount = 2;
    diceSides = 6;
    dice = [];
    canHold = false;
    canRoll = true;
    endGame = false;
    start = () => {
        this.turn = 0;
        gameUI.playersUI[this.turn].makeActive();
        gameUI.diceUI.updatePlayerTurn(this.players[this.turn].name);
    };
    setMaxScore = (maxScore) => (this.maxScore = maxScore);
    // setDiceSides = () =>
    //     (this.diceSides = prompt("Choose dice (d6, d20): D"));
    clearCurrentScore = () => {
        this.players[this.turn].clearCurrentScore();
        // UI
        gameUI.playersUI[this.turn].clearCurrentScore();
    };
    rollDice = (playerType = "human") => {
        // if human overrides AI disable it
        if (
            this.players[this.turn] instanceof AIPlayer &&
            playerType !== "AI"
        ) {
            this.players[this.turn].aiTurnOff();
            console.log("Human override");
        }
        if (!this.canRoll) return;
        this.canHold = false;
        this.rollCount -= 1;
        this.dice = Array.from({ length: this.diceCount }, () =>
            getRandomNumber(1, this.diceSides)
        );
        if (hasDuplicateValue(this.dice, 6)) {
            this.clearCurrentScore();
            this.rollCount += 1;
            console.log("Wow! Wow! Wow! Wow! Wow! Wow! Wow! Wow! ");
        } else {
            // update current score
            this.players[this.turn].addDice(this.dice);
        }
        this.canHold = this.players[this.turn].currentScore > 0;
        this.canRoll = this.rollCount > 0;
        console.log(`Player #${this.turn}: ${this.dice}`);
        // UI
        gameUI.diceUI.renderDice(this.dice);
        gameUI.playersUI[this.turn].updateCurrentScore(
            this.players[this.turn].currentScore
        );
        gameUI.diceUI.updateRollCountLeft(this.rollCount);
        gameUI.diceUI.actionsDisable();
        setTimeout(() => {
            if (this.canHold) gameUI.diceUI.holdEnable();
            if (this.rollCount > 0) gameUI.diceUI.rollEnable();
        }, SHORT_WAIT_MILLISECONDS);
    };
    holdScore = (playerType = "human") => {
        // if human overrides AI disable it
        if (this.players[this.turn] instanceof AIPlayer) {
            this.players[this.turn].aiTurnOff();
            if (playerType !== "AI") console.log("Human override");
        }
        const nextPlayerName = this.players[this.whoseNextTurn()].name;
        let timeout = LONG_WAIT_MILLISECONDS;
        if (!this.canHold) return;
        this.players[this.turn].holdScore();
        this.resetRollCount();
        // WIN - LOSE conditions
        this.looser = this.players.find((pl) => pl.score > this.maxScore);
        this.winner = this.players.find((pl) => pl.score === this.maxScore);
        this.endGame = this.looser || this.winner;
        if (this.endGame) this.allPlayersResetScore();
        if (this.looser) {
            this.updateRoundViaLooser();
            timeout = LONGER_WAIT_MILLISECONDS;
        } else if (this.winner) this.updateRoundViaWinner();
        // UI Update Users
        if (!this.endGame) {
            // normal gameplay
            gameUI.playersUI[this.turn].progressAlongPath(
                (this.players[this.turn].score * 100) / (this.maxScore + 0.01)
            );
        } else {
            // loose
            if (this.looser) {
                gameUI.playersUI[this.turn].loseGame();
                this.players.forEach((pl, i) => {
                    if (pl !== this.looser) {
                        gameUI.playersUI[i].maxTurns += 1;
                        gameUI.playersUI[i].winGame();
                        gameUI.playersUI[i].addCoaster();
                        gameUI.playersUI[i].updateWins(this.players[i].wins);
                    }
                });
            } else if (this.winner) {
                gameUI.playersUI[this.turn].maxTurns += 1;
                gameUI.playersUI[this.turn].addCoaster();
                gameUI.playersUI[this.turn].winGame();
                gameUI.playersUI[this.turn].updateWins(
                    this.players[this.turn].wins
                );
            }
            this.newGame();
        }
        // UI Update score
        gameUI.playersUI[this.turn].updateCurrentScore(0);
        gameUI.playersUI[this.turn].updateScore(this.players[this.turn].score);
        gameUI.diceUI.actionsDisable();
        gameUI.diceUI.hide();
        gameUI.diceUI.updatePlayerTurn(nextPlayerName);
        gameUI.diceUI.updateRollCountLeft(this.rollCount);
        gameUI.diceUI.clear();
        console.log(`wait for ${timeout}`);
        // Timeout Switch user: UI & GAME
        setTimeout(() => {
            gameUI.playersUI[this.turn].makeInactive();
            gameUI.playersUI[this.whoseNextTurn()].makeActive();
            gameUI.diceUI.show();
            gameUI.diceUI.rollEnable();
            this.nextTurn();
        }, timeout);
        this.canHold = false;
    };
    nextTurn = () => {
        // Switch turn
        this.turn = (this.turn + 1) % this.players.length;
        console.log(`turn by player #${this.turn}`);
        // turn on AI
        if (this.players[this.turn] instanceof AIPlayer)
            this.players[this.turn].aiTurnOn();
    };
    whoseNextTurn = () => (this.turn + 1) % this.players.length;
    allPlayersResetScore = () => this.players.forEach((pl) => pl.newGame());
    resetRollCount = () => {
        this.rollCount = DICE_ROLL_COUNT;
        this.canRoll = true;
    };
    newGame = () => {
        this.winner = null;
        this.looser = null;
        this.endGame = false;
    };
    updateRoundViaLooser = () => {
        // i would change this behavior
        // when one looses other continue their ways
        this.players.forEach((pl, i) => {
            if (pl !== this.looser) pl.updateGamesWon();
        });
        console.log("Looser");
    };
    updateRoundViaWinner = () => {
        this.winner.updateGamesWon();
        console.log("Looser");
    };
    renameUser = () => {
        this.players[this.turn].setNewName();
    };
    fullReset = () => {
        gameData = null;
        gameUI.playersUI.forEach((el) => {
            el.playerDiv.remove();
        });
        gameUI = null;
        // remove event listeners from Dice
        // const dice = document.querySelector("#dice");
        // const newDice = dice.cloneNode(true);
        // dice.replaceWith(newDice);
        modalWelcomeScreen();
    };
}

class AIPlayer extends Player {
    constructor(name) {
        super(name);
        console.log("AI player created");
    }
    aiTurnOff = () => {
        this.enable = false;
        console.log("AI deactivation");
    };
    aiTurnOn = () => {
        this.enable = true;
        console.log("AI activation");
        // gameUI.diceUI.actionsDisable();
        setTimeout(this.play, this.fakeHumanTimeout());
    };
    play = () => {
        const aiLoop = setInterval(() => {
            if (!this.enable) {
                clearInterval(aiLoop);
                return;
            }
            this.nextMove();
        }, this.fakeHumanTimeout());
    };
    nextMove = () => {
        if (this.shouldRoll()) this.roll();
        else this.hold();
    };
    hold = () => {
        if (!this.enable) return;
        gameController.nextStep("holdAI");
    };
    roll = () => {
        if (!this.enable) return;
        gameController.nextStep("rollAI");
    };
    shouldRoll = () => {
        if (gameData.game.rollCount <= 0) return false;
        if (this.decideToRoll()) return true;
    };
    decideToRoll = () => {
        // Biased random : more dice points - less probability to roll;
        const maxDiceValue = gameData.game.diceSides * gameData.game.diceCount;
        const biasedThreshold = getRandomBiasedNumber(
            1 * gameData.game.diceCount,
            maxDiceValue
        );
        const totalScore = this.currentScore + this.score;
        return totalScore < gameData.game.maxScore - biasedThreshold;
    };
    fakeHumanTimeout = () =>
        SHORT_WAIT_MILLISECONDS + getRandomBiasedNumber(300, 1500, 1200);
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

function getRandomBiasedNumber(min, max, bias = max, influence = 1) {
    const rand = getRandomNumber(min, max);
    const mix = Math.random() * influence;
    return Math.round(rand * (1 - mix) + bias * mix);
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

function pickNameAI() {
    const names = [
        "Sophia", // real life robot
        "Rachael", // Blade Runner
        "GERTY", // Moon (2009)
        "Quorra", // Tron: Legacy
        "Data", // Star Trek: First Contact
        "TARS", // Interstellar
        "Bishop", // Aliens
        "David", // Prometheus + AI (Spielberg)
        "Edward", // Edward Scissorhands
        "Robby", // Forbidden Planet
        "C3PO", // Star Wars
        "R2D2", // Star Wars
        "Maschinenmensch", // Metropolis
        "Agent Smith", // The Matrix
        "Ava", // Ex Machina
        "T-800", // Terminator 2
        "Wall-E", // Wall-E
        "Ash", // Alien
        "Roy Batty", // Blade Runner
        "Samantha", // Her
        "HAL 9000", // 2001: A Space Odyssey
        "NS-4", // I, Robot
        "NS-5", // I, Robot
        "Mother", // Raised by Wolves + I Am Mother
    ];
    return names[getRandomNumber(0, names.length - 1)];
}
