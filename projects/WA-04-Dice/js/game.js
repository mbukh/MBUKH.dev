"use strict";

let COUNT_PLAYERS;
let MAX_SCORE;
let gameUI;
let gameData;

modalWelcomeScreen();

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
        const options = ["fullReset", "roll", "hold", "renameuser"];
        const task = forceTask;
        // || prompt("Next step (" + options.join(", ") + "): ");
        switch (task) {
            case options[0]:
                // full reset
                console.log(task);
                // Modal if a user decides to lose
                // UI ask user to lose?
                if (confirm("You will lose this round.") === false) break;
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
    this.winner = undefined;
    this.looser = undefined;
    this.diceSides = 6;
    this.maxScore = MAX_SCORE;
    this.turn = 0;
    this.dice = [0, 0];
    this.canRollDice = true;
    this.canHold = true;
    this.endGame = false;
    this.setMaxScore = (maxScore) => (this.maxScore = maxScore);
    // this.setDiceSides = () =>
    //     (this.diceSides = prompt("Choose dice (d6, d20): D"));
    this.rollDice = () => {
        if (!this.canRollDice || !this.canHold) return;
        this.canRollDice = false;
        this.dice = [
            getRandomNumber(1, this.diceSides),
            getRandomNumber(1, this.diceSides),
        ];
        if (this.dice[0] === 6 && this.dice.lastIndexOf(6) !== 0) {
            // AT LEAST TWO SIX DICE
            this.clearCurrentScore();
            console.log("Wow! Wow! Wow! Wow! Wow! Wow! Wow! Wow! ");
            gameUI.playersUI[this.turn].clearCurrentScore();
        } else {
            players[this.turn].addDice(this.dice);
        }
        console.log(this.dice);
        gameUI.diceUI.renderDice(this.dice);
        gameUI.playersUI[this.turn].updateCurrentScore(
            players[this.turn].currentScore
        );
        setTimeout(() => (this.canRollDice = true), 500);
    };
    this.clearCurrentScore = () => {
        players[this.turn].clearCurrentScore();
    };
    this.holdScore = () => {
        if (!this.canRollDice || !this.canHold) return;
        this.canHold = false;
        players[this.turn].holdScore();
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
        gameUI.playersUI[this.turn].updateCurrentScore(
            players[this.turn].currentScore
        );
        gameUI.playersUI[this.turn].updateScore(players[this.turn].score);
        gameUI.diceUI.hide();
        gameUI.diceUI.clear();
        // UI Switch user
        setTimeout(() => {
            gameUI.playersUI[this.turn].playerDiv.classList.toggle("inactive");
            this.nextTurn();
            gameUI.playersUI[this.turn].playerDiv.classList.toggle("inactive");
            this.canHold = true;
        }, 2500);
    };
    this.nextTurn = () => (this.turn = (this.turn + 1) % players.length);
    this.playersZeroScore = () => players.forEach((pl) => pl.newGame());
    this.newGame = () => {
        this.winner = undefined;
        this.looser = undefined;
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
        gameUI.playersUI.forEach((el) => el.playerDiv.remove());
        gameUI = null;
        modalWelcomeScreen();
    };
}

// =========
// =========
//   UTILS
// =========

// Escape html characters string
function escapeHTMLChars(str) {
    const tagsToReplace = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
    };
    return str.replace(/[&<>]/g, (tag) => tagsToReplace[tag] || tag);
}
// Random including min and max
// function getRandomNumber(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// =========
// =========
//   Utils
// =========
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    return "@" + names[getRandomNumber(0, names.length - 1)];
}
