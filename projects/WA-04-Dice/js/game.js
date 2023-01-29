"use strict";

const COUNT_PLAYERS = 2;
const playersUI = initGameUI() || undefined;
const gameData = initGame();

// ==================
// ==================
//  Game Engine Init
// ==================

if (!playersUI) gameLoop(gameData);

function initGame() {
    const players = [new Player(), new Player("Cool generic username")];
    const game = new Game(players);
    const gameController = new GameController(game);
    return { players, game, gameController };
}

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

// =================
// =================
//  Game Controller
// =================

function GameController(game) {
    this.getNextStep = (forceTask) => {
        const options = ["restart", "roll", "hold", "renameuser"];
        const task = forceTask;
        // || prompt("Next step (" + options.join(", ") + "): ");
        switch (task) {
            case options[0]:
                // restart
                console.log(task);
                // Modal if a user decides to lose
                if (game.players[game.turn].currentScore > 0) {
                    // UI ask user to lose?
                    if (confirm("You will lose this round.") === false) break;
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
    this.setMaxScore = (maxScore) => (this.maxScore = maxScore);
    // this.setDiceSides = () =>
    //     (this.diceSides = prompt("Choose dice (d6, d20): D"));
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
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==============
// ==============
//  Game UI Init
// ==============

const playersUI = initGameUI();

function initGameUI() {
    const playersUI = [];
    for (let id = 1; id <= COUNT_PLAYERS; id++) {
        let playerElement = addPlayerSpace(id);
        playersUI.push(new UIPlayer(id, playerElement));
    }
    playersUI.forEach((player) => {
        player.createPath();
        player.setMotionPath();
        player.progressAlongPath(0);
    });
    playersUI[0].playerDiv.classList.remove("inactive");
    return { playersUI };
}

// coasterFreeFall(coasters);
// pathPlayerLoose(player);
// pathPlayerReset(player);
// resetGraphics();

// ==============
// ==============
//  Player Class
// ==============
function addPlayerSpace(uId) {
    const templateDiv = document.querySelector(`#player`);
    const newPlayerDiv = templateDiv.cloneNode(true);
    newPlayerDiv.setAttribute("id", `player${uId}`);
    templateDiv.parentNode.appendChild(newPlayerDiv);
    newPlayerDiv.style.width =
        newPlayerDiv.parentElement.offsetWidth / COUNT_PLAYERS + "px";
    newPlayerDiv.style.setProperty(
        "--player-color",
        `var(--color${getRandomNumber(1, 41)})`
    );
    // newPlayerDiv.style.height =
    //     newPlayerDiv.parentElement.offsetHeight / COUNT_PLAYERS + "px";
    newPlayerDiv.style.setProperty("display", "");
    return newPlayerDiv;
}

function UIPlayer(uId, playerElement) {
    this.uId = uId;
    this.playerDiv = playerElement; //document.querySelector(`#player${this.uId}`);
    this.svg = this.playerDiv.querySelector("svg");
    this.svgPattern = this.svg.querySelector("path.pattern");
    this.svgPath = this.svg.querySelector("path.line");
    this.svgFinish = this.svg.querySelector("path.finish");
    this.coasters = this.playerDiv.querySelectorAll(".coaster");
    this.W = Number.parseFloat(this.playerDiv.style.width);
    this.H = this.svg.parentElement.offsetHeight;
    this.MIN_ANGLE = 70;
    this.MIN_DISTANCE = Math.min(this.W, this.H) / 15;
    this.MAX_DISTANCE = Math.min(this.W, this.H) / 3;
    this.wins = 0;
    this.MAX_TURNS = (this.wins || 0) + 1;
    this.MAX_RECURSIVE_COUNT = 30;
    this.pointsLeft = (this.MAX_TURNS + 1) * 2; // compensate the first and the last stop
    this.countFailedToGetPointTries = 0;
    this.lastTwoPoints = [];
    this.allPoints = [];

    this.svg.style.width = this.W + "px";
    this.svg.style.height = this.H + "px";

    this.createPath = () => createPath(this);
    this.setMotionPath = () => setMotionPath(this);
    this.progressAlongPath = (percent, immediate) =>
        progressAlongPath(this, percent, immediate);
    this.addCoaster = () => addCoaster(this);
}

// ==================
// ==================
// SVG path generator
// https://stackoverflow.com/questions/68512066/creating-random-svg-curves-in-javascript-while-avoiding-sharp-turns
// Even more fun here: https://jsbin.com/fuvomoz/1/edit?js,output
// Beautiful animation https://codepen.io/damongolding/pen/mdBBVWw
// ==================

function createPath(player) {
    const { svgPath, svgPattern, svgFinish, MAX_TURNS, W, H } = player;
    // prettier-ignore
    let path_string = `M ${getPointStr(player)} ${getPointStr(player)} C ${getPointStr(player)} ${getPointStr(player)} ${getPointStr(player)} `;
    for (let i = 0; i < MAX_TURNS - 1; i++) {
        path_string += `S ${getPointStr(player)} ${getPointStr(player)} `;
    }
    svgPath.setAttribute("d", path_string);
    svgFinish.setAttribute("d", `${path_string}`);
    svgPattern.setAttribute(
        "d",
        `${path_string} L ${W} ${H / 2} L ${W} ${H} L 0 ${H} L 0 ${H / 2} z`
    );
}
function getPointStr(player) {
    let point = getPoint(player);
    return `${point[0]} ${point[1]}`;
}
function getPoint(player) {
    const {
        W,
        H,
        lastTwoPoints,
        allPoints,
        MAX_RECURSIVE_COUNT,
        MIN_ANGLE,
        MAX_DISTANCE,
        MIN_DISTANCE,
    } = player;
    let x = getRandomNumber(W * 0.2, W * 0.8);
    let y = getRandomNumber(H * 0.2, H * 0.8);
    let point = [Math.floor(x), Math.floor(y)];

    if (lastTwoPoints.length < 2) {
        // first point
        point = [0, H / 2];
        lastTwoPoints.push(point);
    } else if (player.pointsLeft < 1) {
        // last point
        point = [W, getRandomNumber(H / 4, (H * 3) / 4)];
        lastTwoPoints.push(point);
        allPoints.push(point);
    } else {
        if (
            player.countFailedToGetPointTries < MAX_RECURSIVE_COUNT &&
            (getAngle(...lastTwoPoints, point) < MIN_ANGLE ||
                getDistance(lastTwoPoints[1], point) < MIN_DISTANCE ||
                getDistance(lastTwoPoints[1], point) > MAX_DISTANCE)
        ) {
            player.countFailedToGetPointTries += 1;
            player.pointsLeft += 1;
            point = getPoint(player);
        } else {
            player.countFailedToGetPointTries = 0;
            lastTwoPoints.shift();
            lastTwoPoints.push(point);
            allPoints.push(point);
        }
    }
    player.pointsLeft -= 1;
    return point;
}
function getDistance(pointA, pointB) {
    return Math.sqrt(
        (pointA[0] - pointB[0]) ** 2 + (pointA[1] - pointB[1]) ** 2
    );
}
function getAngle(pointA, pointB, pointC) {
    // angle to pointB
    let a = getDistance(pointA, pointB);
    let b = getDistance(pointB, pointC);
    let c = getDistance(pointC, pointA);
    return Math.acos((a * a + b * b - c * c) / (2 * a * b)) * (180 / Math.PI);
}

// ========================
// ========================
//     COASTER ACTIONS
// ========================

function setMotionPath(player) {
    player.coasters.forEach((el) =>
        el.style.setProperty(
            "--offset-path",
            "'" + player.svgPath.getAttribute("d") + "'"
        )
    );
}

function progressAlongPath(player, percent, immediate = false) {
    const pathLength = player.svgPath.getTotalLength();
    let nextProgress = percent;
    if (nextProgress === 0) {
        nextProgress = (player.coasters.length * 5) / player.MAX_TURNS;
    }
    if (nextProgress >= 100) nextProgress = 99;
    player.coasters.forEach((c) => {
        c.style.setProperty(
            "--old-progress",
            immediate ? percent + "%" : c.style.getPropertyValue("--progress")
        );
        if (immediate) return;

        c.style.setProperty("--progress", nextProgress + "%");
        c.style.animation = "none";
        // minimum pause to let DOM reset itself
        // setTimeout(() => element.classList.add("coaster"), 0);
        // another way to do it is to get a property from DOM such as:
        // https://stackoverflow.com/questions/60686489/what-purpose-does-void-element-offsetwidth-serve
        void c.offsetWidth;
        c.style.animation = ""; // removes inline, inherits css
    });
}

function coasterFreeFall(player) {
    player.coasters.forEach((el) => {
        [elLeft, elTop] = getAbsolutePosition(el);
        el.classList.add("free-fall");
        el.getAnimations().forEach((anim) => (anim.currentTime = 0));
        el.style.position = "fixed";
        [el.style.left, el.style.top] = [elLeft + "px", elTop + "px"];
        el.getAnimations().forEach((anim) => anim.play());
    });
}

function getAbsolutePosition(el) {
    const rect = el.getBoundingClientRect();
    return [rect.left + window.scrollX, rect.top + window.scrollY];
}

// ==========================
// ==========================
//  PATH AND COASTER CONTROL
// ==========================

function addCoaster(player) {
    const newCoaster =
        player.coasters[player.coasters.length - 1].cloneNode(true);
    newCoaster.classList.add(`delayed${player.coasters.length}`);
    player.coasters[0].parentElement.appendChild(newCoaster);
    player.coasters = player.playerDiv.querySelectorAll(".coaster");
}

function pathPlayerLoose(player) {
    player.svgFinish.style.animation = "";
    player.svgFinish.style.animationPlayState = "running";
}

function pathPlayerReset(player) {
    player.svgFinish.style.animationPlayState = "paused";
    player.svgFinish.style.animation = "none";
}

function resetGraphics(player) {
    player.lastTwoPoints = [];
    player.allPoints = [];
    player.pointsLeft = (MAX_TURNS + 1) * 2;
    player.countFailedToGetPointTries = 0;
    progressAlongPath(player.coasters, 0, "immediate");
    createPath(player);
    setMotionPath(player.coasters);
    restartAnimations(player.svg);
    restartAnimations(player.svgPath);
    restartAnimations(...player.coaster);
    pathPlayerReset(player);
}
function restartAnimations(...elements) {
    elements.forEach((el) =>
        el.getAnimations().forEach((anim) => (anim.currentTime = 0))
    );
}

// =========
// =========
//   Dice
// https://codepen.io/Pyremell/pen/eZGGXX/
// =========
const diceButton = document.querySelector("#dice #roll");
const diceNumbers = document.querySelectorAll("#dice .diceNumber");
const dice = {
    sides: 6,
    roll() {
        return Math.floor(Math.random() * this.sides) + 1;
    },
};
//Prints dice roll to the page
function renderRandomDice(e) {
    if (e.target.classList.contains("inactive")) return;
    diceNumbers.forEach((dN) => (dN.textContent = dice.roll()));
    e.target.classList.add("inactive");
    setTimeout(() => e.target.classList.remove("inactive"), 1000);
}
diceButton.addEventListener("click", renderRandomDice);

// =========
// =========
//   Utils
// =========
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
