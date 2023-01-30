"use strict";

modalWelcomeScreen();

function modalWelcomeScreen() {
    // Better modal https://web.dev/is-it-modal/
    const modal = document.querySelector("#modal");
    const submit = document.querySelector("#modal #start");
    submit.addEventListener("click", initializeGame);
    modal.style.display = "flex";
}

function initializeGame() {
    const playersNumber = document.querySelector("#modal #players-number");
    const maxScoreNumber = document.querySelector("#modal #max-score");
    COUNT_PLAYERS = Number.parseInt(playersNumber.value);
    MAX_SCORE = Number.parseInt(maxScoreNumber.value);
    if (COUNT_PLAYERS > 0 && MAX_SCORE > 0) {
        gameUI = initGameUI() || null;
        gameData = initGame();
    }
    modal.style.display = "";
    gameData.gameController.nextStep("startGame");
}

// ==============
// ==============
//  Game UI Init
// ==============

function initGameUI() {
    console.log("initGameUI");
    const playersUI = [];
    const diceUI = new DiceUI(MAX_SCORE);
    for (let id = 1; id <= COUNT_PLAYERS; id++) {
        let playerElement = createPlayerHTMLElement(id);
        playersUI.push(new PlayerUI(id, playerElement));
    }
    playersUI.forEach((player) => {
        player.createPath();
        player.setMotionPath();
        player.progressAlongPath(0);
    });
    initEventListeners(playersUI, diceUI);
    return { playersUI, diceUI };
}

// ==============
// ==============
//  Player Class
// ==============

function createPlayerHTMLElement(uId) {
    const templateDiv = document.querySelector(`#player`);
    const newPlayerDiv = templateDiv.cloneNode(true);
    newPlayerDiv.setAttribute("id", `player${uId}`);
    templateDiv.parentNode.appendChild(newPlayerDiv);
    newPlayerDiv.style.width =
        newPlayerDiv.parentElement.offsetWidth / COUNT_PLAYERS + "px";
    // newPlayerDiv.style.height =
    //     newPlayerDiv.parentElement.offsetHeight / COUNT_PLAYERS + "px";
    newPlayerDiv.style.setProperty(
        "--player-color",
        `var(--color${getRandomNumber(1, 41)})`
    );
    newPlayerDiv.style.setProperty("display", "");
    console.log(`Player HTML element created for player #${uId}`);
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
    this.name = this.playerDiv.querySelector(".player-control .name .s");
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

    this.makeActive = () => this.playerDiv.classList.remove("inactive");
    this.makeInactive = () => this.playerDiv.classList.add("inactive");
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
            LONG_WAIT_MILLISECONDS
        );
    };
    this.loseGame = () => {
        coasterFreeFall(this.coasters);
        pathPlayerLoose(this.svgFinish);
        setTimeout(() => {
            resetGraphics(this);
        }, LONG_WAIT_MILLISECONDS);
    };
    this.winGame = () => {
        this.progressAlongPath(0);
        this.wins.parentElement.classList.add("update");
        setTimeout(() => {
            this.wins.parentElement.classList.remove("update");
            resetGraphics(this);
        }, LONGER_WAIT_MILLISECONDS);
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
    this.playerTurn = document.querySelector("#dice .player-turn .s");
    this.diceMaxScore = document.querySelector("#dice .max-score .n");
    this.diceNumbers = document.querySelectorAll("#dice .diceNumber");
    this.restartButton = document.querySelector("#dice #restart");
    this.restartConfirmButton = document.querySelector("#dice #confirm");
    this.restartConfirmSpan = document.querySelector("#dice #confirm span");
    this.rollButton = document.querySelector("#dice #roll");
    this.holdButton = document.querySelector("#dice #hold");
    this.diceMaxScore.textContent = MAX_SCORE;
    this.renderDice = (diceNumbers) => {
        this.diceNumbers.forEach((el, i) => (el.textContent = diceNumbers[i]));
    };
    this.updatePlayerTurn = (s) => (this.playerTurn.textContent = s);
    this.hide = () => this.dice.classList.add("hide");
    this.show = () => this.dice.classList.remove("hide");
    this.actionsEnabled = () => {
        this.rollButton.classList.remove("wait");
        this.holdButton.classList.remove("wait");
    };
    this.actionsDisabled = () => {
        this.rollButton.classList.add("wait");
        this.holdButton.classList.add("wait");
    };
    this.rollEnabled = () => this.rollButton.classList.remove("wait");
    this.clear = () => {
        this.diceNumbers.forEach((number) => (number.textContent = ""));
    };
}

// =================
// =================
//  Event Listeners
// =================

function initEventListeners(playersUI, diceUI) {
    // roll
    diceUI.rollButton.addEventListener("click", () =>
        gameData.gameController.nextStep("roll")
    );
    // hold
    diceUI.holdButton.addEventListener("click", () =>
        gameData.gameController.nextStep("hold")
    );
    // restart confirm
    diceUI.restartButton.addEventListener("click", () =>
        diceUI.restartConfirmButton.classList.toggle("activated")
    );
    diceUI.restartButton.addEventListener("mouseout", () =>
        diceUI.restartConfirmButton.classList.remove("activated")
    );
    diceUI.restartConfirmSpan.addEventListener("mouseover", () =>
        diceUI.restartConfirmButton.classList.add("activated")
    );
    diceUI.restartConfirmSpan.addEventListener("mouseout", () =>
        diceUI.restartConfirmButton.classList.remove("activated")
    );
    diceUI.restartConfirmSpan.addEventListener("click", () => {
        diceUI.restartConfirmButton.classList.remove("activated");
        gameData.gameController.nextStep("fullReset");
    });

    makeElementDraggable(diceUI.dice);
}

// ===============
// ===============
//     UI UTILS
// ===============

function makeElementDraggable(element) {
    // Make the DIV element draggable both mouse & touch :
    // https://www.w3schools.com/howto/howto_js_draggable.asp
    // https://stackoverflow.com/questions/56703458/how-to-make-a-draggable-elements-for-touch-and-mousedrag-events
    let [pos1, pos2, pos3, pos4] = [0, 0, 0, 0];
    let x, y;
    element.onmousedown = dragMouseDown;
    element.ontouchstart = dragMouseDown; //added touch event
    function dragMouseDown(e) {
        e = e || window.event;
        // e.preventDefault();
        //Get touch or click position
        //https://stackoverflow.com/a/41993300/5078983
        if (
            e.type == "touchstart" ||
            e.type == "touchmove" ||
            e.type == "touchend" ||
            e.type == "touchcancel"
        ) {
            let evt =
                typeof e.originalEvent === "undefined" ? e : e.originalEvent;
            let touch = evt.touches[0] || evt.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (
            e.type == "mousedown" ||
            e.type == "mouseup" ||
            e.type == "mousemove" ||
            e.type == "mouseover" ||
            e.type == "mouseout" ||
            e.type == "mouseenter" ||
            e.type == "mouseleave"
        ) {
            x = e.clientX;
            y = e.clientY;
        }
        // get the mouse cursor position at startup:
        pos3 = x;
        pos4 = y;
        document.onmouseup = closeDragElement;
        document.ontouchend = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        document.ontouchmove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        // e.preventDefault();
        //Get touch or click position
        //https://stackoverflow.com/a/41993300/5078983
        if (
            e.type == "touchstart" ||
            e.type == "touchmove" ||
            e.type == "touchend" ||
            e.type == "touchcancel"
        ) {
            let evt =
                typeof e.originalEvent === "undefined" ? e : e.originalEvent;
            let touch = evt.touches[0] || evt.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (
            e.type == "mousedown" ||
            e.type == "mouseup" ||
            e.type == "mousemove" ||
            e.type == "mouseover" ||
            e.type == "mouseout" ||
            e.type == "mouseenter" ||
            e.type == "mouseleave"
        ) {
            x = e.clientX;
            y = e.clientY;
        }
        // calculate the new cursor position:
        pos1 = pos3 - x;
        pos2 = pos4 - y;
        pos3 = x;
        pos4 = y;
        // set the element's new position:
        element.style.top = element.offsetTop - pos2 + "px";
        element.style.left = element.offsetLeft - pos1 + "px";
    }
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.ontouchcancel = null; //added touch event
        document.ontouchend = null; //added touch event
        document.onmousemove = null;
        document.ontouchmove = null; //added touch event
    }
}
