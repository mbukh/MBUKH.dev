"use strict";

modalWelcomeScreen();

// ===================
// ===================
//   User Data input
// ===================

function modalWelcomeScreen() {
    // Better modal https://web.dev/is-it-modal/
    const modal = document.querySelector("#modal");
    const submit = document.querySelector("#modal #start");
    const playersNumber = document.querySelector("#modal #players-number");
    const playersAINumber = document.querySelector("#modal #players-ai-number");
    const maxScore = document.querySelector("#modal #max-score");
    maxScore.addEventListener("keydown", (e) => checkInput(e, 50));
    maxScore.addEventListener("change", (e) => checkInput(e, 50));
    playersNumber.addEventListener("keydown", checkPlayersCount);
    playersNumber.addEventListener("change", checkPlayersCount);
    playersAINumber.addEventListener("keydown", checkPlayersCount);
    playersAINumber.addEventListener("change", checkPlayersCount);
    submit.addEventListener("click", handleStart);
    modal.style.display = "flex";

    function handleStart() {
        prepareGameData({
            playersNumber: Number(playersNumber.value),
            playersAINumber: Number(playersAINumber.value),
            maxScore: Number(maxScore.value),
        });
    }
    function checkPlayersCount(e) {
        const playersCount =
            Number(playersNumber.value) + Number(playersAINumber.value);
        if (playersCount <= 0) {
            e.target.value = 1;
        }
    }
    function checkInput(e, defaultValue) {
        if (Number(e.target.value) <= 0) {
            e.target.value = defaultValue;
        }
    }
}

// ==============
// ==============
//  Game UI Init
// ==============

function initGameUI({ maxScore, diceRollCount, countPlayers }) {
    console.log("initGameUI");
    const playersUI = [];
    const diceUI = new DiceUI({
        maxScore,
        diceRollCount,
    });
    for (let id = 1; id <= countPlayers; id++) {
        let playerHTMLElement = createPlayerHTMLElement({
            uId: id,
            countPlayers,
        });
        playersUI.push(new PlayerUI({ uId: id, playerHTMLElement }));
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

function createPlayerHTMLElement({ uId, countPlayers }) {
    const templateDiv = document.querySelector(`#player`);
    const newPlayerDiv = templateDiv.cloneNode(true);
    newPlayerDiv.setAttribute("id", `player${uId}`);
    templateDiv.parentNode.appendChild(newPlayerDiv);
    newPlayerDiv.style.width =
        newPlayerDiv.parentElement.offsetWidth / countPlayers + "px";
    // newPlayerDiv.style.height =
    //     newPlayerDiv.parentElement.offsetHeight / countPlayers + "px";
    newPlayerDiv.style.setProperty(
        "--player-color",
        `var(--color${getRandomNumber(1, 41)})`
    );
    newPlayerDiv.style.setProperty("display", "");
    console.log(`Player HTML element created for player #${uId}`);
    return newPlayerDiv;
}

class PlayerUI {
    constructor({ uId, playerHTMLElement }) {
        this.uId = uId;
        this.playerDiv = playerHTMLElement;
        this.svg = this.playerDiv.querySelector("svg");
        this.svgPattern = this.svg.querySelector("path.pattern");
        this.svgPath = this.svg.querySelector("path.line");
        this.svgFinish = this.svg.querySelector("path.finish");
        this.coasters = this.playerDiv.querySelectorAll(".coaster");
        this.name = this.playerDiv.querySelector(".player-stats .name .s");
        this.description = this.playerDiv.querySelector(
            ".player-stats .description .s"
        );
        this.currentScore = this.playerDiv.querySelector(
            ".player-stats .current-score .n"
        );
        this.score = this.playerDiv.querySelector(".player-stats .score .n");
        this.wins = this.playerDiv.querySelector(".player-stats .wins .n");
        this.W = Number.parseFloat(this.playerDiv.style.width);
        this.H = this.svg.parentElement.offsetHeight;
        this.minAngle = 70;
        this.minDistance = Math.min(this.W, this.H) / 15;
        this.maxDistance = Math.min(this.W, this.H) / 3;
        this.maxTurns = 1;
        this.maxRecursiveCount = 30;
        this.pointsLeft = (this.maxTurns + 1) * 2; // compensate the first and the last stop
        this.countFailedToGetPointTries = 0;
        this.lastTwoPoints = [];
        this.allPoints = [];
        this.svg.style.width = this.W + "px";
        this.svg.style.height = this.H + "px";
        this.percent = 0;
    }
    makeActive = () => this.playerDiv.classList.remove("inactive");
    makeInactive = () => this.playerDiv.classList.add("inactive");
    createPath = () => createPath(this);
    setMotionPath = () => setMotionPath(this);
    progressAlongPath = (percent, immediate) =>
        progressAlongPath(this, percent, immediate);
    setPercent = (percent) => (this.percent = percent);
    addCoaster = () => addCoaster(this);
    setCurrentScore = (n) => (this.currentScore.textContent = n);
    setScore = (n) => (this.score.textContent = n);
    updateWins = (n) => (this.wins.textContent = n);
    setName = (s) => (this.name.textContent = s);
    setDescription = (s) => (this.description.textContent = s);
    clearCurrentScore = () => {
        this.currentScore.parentElement.classList.add("clear");
        setTimeout(
            () => this.currentScore.parentElement.classList.remove("clear"),
            LONG_WAIT_MILLISECONDS
        );
    };
    loseGame = () => {
        coasterFreeFall(this.coasters);
        pathPlayerLoose(this.svgFinish);
        setTimeout(() => {
            this.resetGraphics();
        }, LONG_WAIT_MILLISECONDS);
    };
    winGame = () => {
        this.progressAlongPath(0);
        this.wins.parentElement.classList.add("update");
        setTimeout(() => {
            this.wins.parentElement.classList.remove("update");
            this.resetGraphics();
        }, LONGER_WAIT_MILLISECONDS);
    };
    restartAnimations = () => {
        restartAnimations(this.svg);
        restartAnimations(this.svgFinish);
        restartAnimations(this.svgPath);
        restartAnimations(...this.coasters);
    };
    resizePlayerDiv = () => {
        this.W = this.svg.parentElement.offsetWidth;
        this.H = this.svg.parentElement.offsetHeight;
        this.svg.style.width = this.W + "px";
        this.svg.style.height = this.H + "px";
        this.resetGraphics(true);
    };
    resetGraphics = (onResize = false) => resetGraphics(this, onResize);
}

// ==================
// ==================
// SVG path generator
// https://stackoverflow.com/questions/68512066/creating-random-svg-curves-in-javascript-while-avoiding-sharp-turns
// Even more fun here: https://jsbin.com/fuvomoz/1/edit?js,output
// Beautiful animation https://codepen.io/damongolding/pen/mdBBVWw
// ==================

function createPath(player) {
    const { svgPath, svgPattern, svgFinish, maxTurns, W, H } = player;
    // prettier-ignore
    let pathString = `M ${getPointStr(player)} ${getPointStr(player)} C ${getPointStr(player)} ${getPointStr(player)} ${getPointStr(player)} `;
    for (let i = 0; i < maxTurns - 1; i++) {
        pathString += `S ${getPointStr(player)} ${getPointStr(player)} `;
    }
    svgPath.setAttribute("d", pathString);
    svgFinish.setAttribute("d", `${pathString}`);
    svgPattern.setAttribute(
        "d",
        `${pathString} L ${W} ${H / 2} L ${W} ${H} L 0 ${H} L 0 ${H / 2} z`
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
        maxRecursiveCount,
        minAngle,
        maxDistance,
        minDistance,
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
            player.countFailedToGetPointTries < maxRecursiveCount &&
            (getAngle(...lastTwoPoints, point) < minAngle ||
                getDistance(lastTwoPoints[1], point) < minDistance ||
                getDistance(lastTwoPoints[1], point) > maxDistance)
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
        nextProgress = (player.coasters.length * 5) / player.maxTurns;
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

function resetGraphics(player, onResize = false) {
    player.lastTwoPoints = [];
    player.allPoints = [];
    player.pointsLeft = (player.maxTurns + 1) * 2;
    player.countFailedToGetPointTries = 0;
    player.coasters.forEach((c) => {
        c.classList.remove("free-fall");
        c.style.position = "absolute";
        c.style.top = "0";
        c.style.left = "0";
    });
    if (!onResize) player.progressAlongPath(0, "immediate");
    player.createPath();
    player.setMotionPath();
    pathPlayerReset(player.svgFinish);
    if (onResize) player.progressAlongPath(player.percent);
    else player.progressAlongPath(0);
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

class DiceUI {
    constructor({ maxScore }) {
        this.maxScore = maxScore;
        this.dice = document.querySelector("#dice");
        this.playerTurn = document.querySelector("#dice .player-turn .s");
        this.diceMaxScore = document.querySelector("#dice .max-score .n");
        this.diceNumbers = document.querySelectorAll("#dice .diceNumber");
        this.restartButton = document.querySelector("#dice #restart");
        this.restartConfirmButton = document.querySelector("#dice #confirm");
        this.restartConfirmSpan = document.querySelector("#dice #confirm span");
        this.rollButton = document.querySelector("#dice #roll");
        this.rollCountLeft = document.querySelector("#dice #roll .n");
        this.holdButton = document.querySelector("#dice #hold");
        this.setDiceMaxScore(this.maxScore);
    }
    setDiceMaxScore = (s) => (this.diceMaxScore.textContent = s);
    renderDice = (diceNumbers) => {
        this.diceNumbers.forEach((el, i) => (el.textContent = diceNumbers[i]));
    };
    updatePlayerTurn = (s) => (this.playerTurn.textContent = s);
    updateRollCountLeft = (n) => (this.rollCountLeft.textContent = n);
    hide = () => this.dice.classList.add("hide");
    show = () => this.dice.classList.remove("hide");
    actionsDisable = () => {
        this.rollButton.classList.add("wait");
        this.holdButton.classList.add("wait");
    };
    holdEnable = () => this.holdButton.classList.remove("wait");
    rollEnable = () => this.rollButton.classList.remove("wait");
    clear = () => {
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
        gameController.nextStep("roll")
    );
    // hold
    diceUI.holdButton.addEventListener("click", () =>
        gameController.nextStep("hold")
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
        gameController.nextStep("fullReset");
    });
    // resize windows on action end
    // https://stackoverflow.com/questions/5489946/how-to-wait-for-the-end-of-resize-event-and-only-then-perform-an-action
    // http://jsfiddle.net/mblase75/fq882/197/
    let doit;
    window.addEventListener("resize", () => {
        clearTimeout(doit);
        doit = setTimeout(
            () => playersUI.forEach((player) => player.resizePlayerDiv()),
            300
        );
    });
    makeElementDraggable(diceUI.dice);
}

// ===============
// ===============
//     UI UTILS
// ===============

function removeEventListenersForElement(element) {
    element.replaceWith(element.cloneNode(true));
}

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
