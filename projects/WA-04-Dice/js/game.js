"use strict";
// =========
// =========
//   UTILS
// =========
// Node.js prompt fix
import promptSync from "prompt-sync";
if (!prompt) {
    var prompt = promptSync();
}
// Escape html characters string
const escapeHTMLChars = (str) => {
    const tagsToReplace = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
    };
    return str.replace(/[&<>]/g, (tag) => tagsToReplace[tag] || tag);
};
// Random including min and max
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ================
// ================
// Dice Game Engine
// ================

const gameData = initGame();
gameLoop(gameData);

function gameLoop({ game, players, gameController }) {
    const letsPlay = true;
    while (letsPlay) {
        // NEXT GAME ROUTINE
        gameController.getNextStep("restart");
        console.table(players);
        console.table(game);
        while (!game.endGame) {
            // ONE GAME ROUTINE
            gameController.getNextStep();
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

function initGame() {
    const players = [new Player(), new Player("Cool generic username")];
    const game = new Game(players);
    const gameController = new GameController(game);
    return { players, game, gameController };
}

// =========
// =========
//  Classes
// =========

function Player(name) {
    this.name = name || "Ask user for name";
    this.score = 0;
    this.currentScore = 0;
    this.countGamesWon = 0;
    this.setNewName = () =>
        (this.name = escapeHTMLChars(prompt("Please enter name: ")));
    this.newGame = () => {
        this.currentScore = 0;
        this.score = 0;
    };
    this.setDice = (dice) =>
        (this.currentScore += dice.reduce((acc, e) => acc + e));
    this.clearCurrentScore = () => (this.currentScore = 0);
    this.holdScore = () => {
        this.score += this.currentScore;
        this.currentScore = 0;
    };
    this.updateGamesWon = () => (this.countGamesWon += 1);
}

function Game(players) {
    this.players = players;
    this.winner = undefined;
    this.looser = undefined;
    this.diceSides = 6;
    this.maxScore = 100;
    this.turn = 0;
    this.dice = [0, 0];
    this.endGame = false;
    this.setMaxScore = () => (this.maxScore = +prompt("Set top score to: "));
    this.setDiceSides = () =>
        (this.diceSides = prompt("Choose dice (d6, d20): D"));
    this.rollDice = () => {
        this.dice = [
            getRandomNumber(1, this.diceSides),
            getRandomNumber(1, this.diceSides),
        ];
        players[this.turn].setDice(this.dice);
    };
    this.clearCurrentScore = () => {
        players[this.turn].clearCurrentScore();
    };
    this.holdScore = () => {
        players[this.turn].holdScore();
        this.nextTurn();
    };
    this.nextTurn = () => (this.turn = (this.turn + 1) % players.length);
    this.newGame = () => {
        // If a game started punish the resetter
        if (players[this.turn].currentScore > 0) {
            this.looser = players[this.turn];
            this.updateRoundViaLooser();
        }
        players.forEach((pl) => pl.newGame());
        this.winner = undefined;
        this.looser = undefined;
        this.turn = 0;
        this.endGame = false;
    };
    this.updateRoundViaLooser = () => {
        players.forEach((pl) => {
            if (pl !== this.looser) pl.updateGamesWon();
        });
    };
    this.updateRoundViaWinner = () => this.winner.updateGamesWon();
    this.renameUser = () => players[this.turn].setNewName();
}

function GameController(game) {
    this.getNextStep = (forceTask) => {
        const options = ["restart", "roll", "hold", "renameuser"];
        const task =
            forceTask || prompt("Next step (" + options.join(", ") + "): ");
        switch (task) {
            case options[0]:
                // restart
                console.log(task);
                // Modal if a user decides to lose
                if (game.players[game.turn].currentScore > 0) {
                    // UI ask user to lose?
                    if (prompt("You'll lose this round. Sure? y/n: ") === "n")
                        break;
                }
                // MODAL UI SET MAX SCORE
                game.setMaxScore();
                game.newGame();
                // UPDATE STATS
                break;
            case options[1]:
                // roll
                console.log(task);
                game.rollDice();
                // UI ROLL DICE
                if (game.dice[0] === 6 && game.dice.lastIndexOf(6) !== 0) {
                    // AT LEAST TWO SIX DICE
                    console.log("Wow! Wow! Wow! Wow! Wow! Wow! Wow! Wow! ");
                    // UI DISABLE INPUT 1s + MESSAGE
                    game.clearCurrentScore();
                }
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
