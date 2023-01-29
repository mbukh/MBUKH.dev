"use strict";

// ==============
// ==============
//  Game UI Init
// ==============

function initGameUI() {
    const playersUI = [];
    const diceUI = new DiceUI(MAX_SCORE);
    for (let id = 1; id <= COUNT_PLAYERS; id++) {
        let playerElement = addPlayerSpace(id);
        playersUI.push(new PlayerUI(id, playerElement));
    }
    playersUI.forEach((player) => {
        player.createPath();
        player.setMotionPath();
        player.progressAlongPath(0);
    });
    playersUI[0].playerDiv.classList.remove("inactive");
    initEventListeners(playersUI, diceUI);
    return { playersUI, diceUI };
}

function modalWelcomeScreen() {
    // Better modal https://web.dev/is-it-modal/
    const modal = document.querySelector("#modal");
    const playersNumber = document.querySelector("#modal #players-number");
    const maxScoreNumber = document.querySelector("#modal #max-score");
    const submit = document.querySelector("#modal #start");

    modal.style.display = "block";
    submit.addEventListener("click", (e) => {
        COUNT_PLAYERS = Number.parseInt(playersNumber.value);
        MAX_SCORE = Number.parseInt(maxScoreNumber.value);
        if (COUNT_PLAYERS > 0 && MAX_SCORE > 0) {
            gameUI = initGameUI() || undefined;
            gameData = initGame();
        }
        modal.style.display = "";
    });
}

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

function PlayerUI(uId, playerElement) {
    this.uId = uId;
    this.playerDiv = playerElement; //document.querySelector(`#player${this.uId}`);
    this.svg = this.playerDiv.querySelector("svg");
    this.svgPattern = this.svg.querySelector("path.pattern");
    this.svgPath = this.svg.querySelector("path.line");
    this.svgFinish = this.svg.querySelector("path.finish");
    this.coasters = this.playerDiv.querySelectorAll(".coaster");
    this.name = this.playerDiv.querySelector(".player-control .name");
    this.currentScore = this.playerDiv.querySelector(
        ".player-control .current-score .n"
    );
    this.score = this.playerDiv.querySelector(".player-control .score .n");
    this.wins = this.playerDiv.querySelector(".player-control .wins .n");
    this.W = Number.parseFloat(this.playerDiv.style.width);
    this.H = this.svg.parentElement.offsetHeight;
    this.MIN_ANGLE = 70;
    this.MIN_DISTANCE = Math.min(this.W, this.H) / 15;
    this.MAX_DISTANCE = Math.min(this.W, this.H) / 3;
    this.MAX_TURNS = 1;
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
    this.updateCurrentScore = (n) => (this.currentScore.textContent = n);
    this.updateScore = (n) => (this.score.textContent = n);
    this.updateWins = (n) => (this.wins.textContent = n);
    this.updateUserName = (s) => (this.name.textContent = s);
    this.clearCurrentScore = () => {
        this.currentScore.parentElement.classList.add("clear");
        setTimeout(
            () => this.currentScore.parentElement.classList.remove("clear"),
            2500
        );
    };
    this.loseGame = () => {
        coasterFreeFall(this.coasters);
        pathPlayerLoose(this.svgFinish);
        setTimeout(() => {
            resetGraphics(this);
        }, 2500);
    };
    this.winGame = () => {
        this.progressAlongPath(0);
        this.wins.parentElement.classList.add("update");
        setTimeout(() => {
            this.wins.parentElement.classList.remove("update");
            resetGraphics(this);
        }, 2500);
    };
    this.restartAnimations = () => {
        restartAnimations(this.svg);
        restartAnimations(this.svgFinish);
        restartAnimations(this.svgPath);
        // restartAnimations(...this.coasters);
    };
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
        // restart animation. add a minimum pause to let DOM reset itself
        // setTimeout(() => element.classList.add("coaster"), 0);
        // another way to do it is to get a property from DOM such as:
        // https://stackoverflow.com/questions/60686489/what-purpose-does-void-element-offsetwidth-serve
        c.style.animation = "none";
        void c.offsetWidth;
        c.style.animation = ""; // removes inline, inherits css
    });
}

function coasterFreeFall(coasters) {
    coasters.forEach((el) => {
        const [elLeft, elTop] = getAbsolutePosition(el);
        el.style.position = "fixed";
        [el.style.left, el.style.top] = [elLeft + "px", elTop + "px"];
        el.classList.add("free-fall");
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
    newCoaster.classList.remove(`delayed${player.coasters.length - 1}`);
    newCoaster.classList.add(`delayed${player.coasters.length}`);
    player.coasters[0].parentElement.appendChild(newCoaster);
    player.coasters = player.playerDiv.querySelectorAll(".coaster");
}

function pathPlayerLoose(svgFinish) {
    svgFinish.style.animation = "";
    svgFinish.style.animationPlayState = "running";
}

function pathPlayerReset(svgFinish) {
    svgFinish.style.animationPlayState = "paused";
    svgFinish.style.animation = "none";
}

function resetGraphics(player) {
    player.lastTwoPoints = [];
    player.allPoints = [];
    player.pointsLeft = (player.MAX_TURNS + 1) * 2;
    player.countFailedToGetPointTries = 0;
    player.coasters.forEach((c) => {
        c.classList.remove("free-fall");
        c.style.position = "absolute";
        c.style.top = "0";
        c.style.left = "0";
    });
    player.progressAlongPath(0, "immediate");
    player.createPath();
    player.setMotionPath();
    pathPlayerReset(player.svgFinish);
    player.progressAlongPath(0);
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

function DiceUI(MAX_SCORE) {
    this.dice = document.querySelector("#dice");
    this.diceMaxScore = document.querySelector("#dice .max-score .n");
    this.diceNumbers = document.querySelectorAll("#dice .diceNumber");
    this.restartButton = document.querySelector("#dice #restart");
    this.rollButton = document.querySelector("#dice #roll");
    this.holdButton = document.querySelector("#dice #hold");
    this.diceMaxScore.textContent = MAX_SCORE;
    this.renderDice = (diceNumbers) => {
        this.diceNumbers.forEach((dN, i) => (dN.textContent = diceNumbers[i]));
        this.rollButton.classList.add("wait");
        this.holdButton.classList.add("wait");
        setTimeout(() => {
            this.rollButton.classList.remove("wait");
            this.holdButton.classList.remove("wait");
        }, 500);
    };
    this.hide = () => {
        this.dice.classList.add("hide");
        setTimeout(() => this.dice.classList.remove("hide"), 2500);
    };
    this.clear = () => {
        this.diceNumbers.forEach((dN, i) => (dN.textContent = ""));
    };
}

// =================
// =================
//  Event Listeners
// =================

function initEventListeners(playersUI, diceUI) {
    diceUI.rollButton.addEventListener("click", () =>
        gameData.gameController.nextStep("roll")
    );
    diceUI.holdButton.addEventListener("click", () =>
        gameData.gameController.nextStep("hold")
    );
    diceUI.restartButton.addEventListener("click", () =>
        gameData.gameController.nextStep("fullReset")
    );
}
