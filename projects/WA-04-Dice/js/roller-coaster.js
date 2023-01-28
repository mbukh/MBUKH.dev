// ==================
// ==================
// SVG path generator
// https://stackoverflow.com/questions/68512066/creating-random-svg-curves-in-javascript-while-avoiding-sharp-turns
// Even more fun here: https://jsbin.com/fuvomoz/1/edit?js,output
// Beautiful animation https://codepen.io/damongolding/pen/mdBBVWw
// ==================

let lastTwoPoints = [];
let allPoints = [];
const svg = document.querySelector("svg");
const svgPattern = svg.querySelector("path#pattern");
const svgPath = svg.querySelector("path#line");
const svgFinish = svg.querySelector("path#finish");
const [W, H] = [svg.parentElement.offsetWidth, svg.parentElement.offsetHeight];
const MIN_ANGLE = 70;
const MIN_DISTANCE = Math.min(W, H) / 15;
const MAX_DISTANCE = Math.min(W, H) / 3;
const MAX_TURNS = getRandomNumber(5, 10);
const MAX_RECURSIVE_COUNT = 30;

let pointsLeft = (MAX_TURNS + 1) * 2; // compensate the first and the last stop
let countFailedToGetPointTries = 0;

svg.style.width = W;
svg.style.height = H;
createPath();

function createPath() {
    let path_string = `M ${pointString()} ${pointString()} C ${pointString()} ${pointString()} ${pointString()} `;
    for (let i = 0; i < MAX_TURNS - 1; i++) {
        path_string += `S ${pointString()} ${pointString()} `;
    }
    svgPath.setAttribute("d", path_string);
    svgPattern.setAttribute(
        "d",
        `${path_string} L ${W} ${H / 2} L ${W} ${H} L 0 ${H} L 0 ${H / 2} z`
    );
    svgFinish.setAttribute("d", `${path_string}`);
}
function pointString() {
    let point = getPoint();
    return `${point[0]} ${point[1]}`;
}
function getPoint() {
    let x = getRandomNumber(W * 0.2, W * 0.8);
    let y = getRandomNumber(H * 0.2, H * 0.8);
    let point = [Math.floor(x), Math.floor(y)];

    if (lastTwoPoints.length < 2) {
        // first point
        point = [0, H / 2];
        lastTwoPoints.push(point);
    } else if (pointsLeft < 1) {
        // last point
        point = [W, getRandomNumber(H / 4, (H * 3) / 4)];
        lastTwoPoints.push(point);
        allPoints.push(point);
    } else {
        if (
            countFailedToGetPointTries < MAX_RECURSIVE_COUNT &&
            isNotProperPoint(lastTwoPoints, point)
        ) {
            countFailedToGetPointTries += 1;
            pointsLeft += 1;
            point = getPoint();
        } else {
            countFailedToGetPointTries = 0;
            lastTwoPoints.shift();
            lastTwoPoints.push(point);
            allPoints.push(point);
        }
    }
    pointsLeft -= 1;
    return point;
}
function isNotProperPoint(lastTwoPoints, point) {
    return (
        getAngle(...lastTwoPoints, point) < MIN_ANGLE ||
        getDistance(lastTwoPoints[1], point) < MIN_DISTANCE ||
        getDistance(lastTwoPoints[1], point) > MAX_DISTANCE
    );
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
function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ======================
// ======================
// Set the path to follow
// ======================
const motionDemo = document.querySelectorAll(".motion-demo");
setMotionPath();
function setMotionPath() {
    motionDemo.forEach((el) =>
        el.style.setProperty(
            "--offset-path",
            "'" + svgPath.getAttribute("d") + "'"
        )
    );
}
let progress = +getComputedStyle(motionDemo[0]).getPropertyValue("--progress");

// ========================
// ========================
// Move along the path by %
// ========================

progressAlongPath(20);

function progressAlongPath(percent, immediate = false) {
    let nextProgress = percent;
    console.log(nextProgress);
    if (nextProgress === 0) nextProgress = 2;
    if (nextProgress >= 100) nextProgress = 99;
    if (immediate) {
        document.querySelectorAll(".motion-demo").forEach((el) => {
            el.style.setProperty("--old-progress", percent + "%");
            el.style.setProperty("--progress", nextProgress + "%");
        });
        return;
    }
    document.querySelectorAll(".motion-demo").forEach((el) => {
        el.style.setProperty(
            "--old-progress",
            el.style.getPropertyValue("--progress")
        );
        el.style.setProperty("--progress", nextProgress + "%");
        el.style.animation = "none";
        // minimum pause to let DOM reset itself
        // setTimeout(() => element.classList.add("motion-demo"), 0);
        // another way to do it is to get a property from DOM such as:
        // https://stackoverflow.com/questions/60686489/what-purpose-does-void-element-offsetwidth-serve
        void el.offsetWidth;
        el.style.animation = ""; // removes inline, inherits css
    });
}

// ===========
// ===========
//    RESET
// ===========

function reset() {
    lastTwoPoints = [];
    allPoints = [];
    pointsLeft = (MAX_TURNS + 1) * 2;
    countFailedToGetPointTries = 0;
    progressAlongPath(0, "immediate");
    createPath();
    setMotionPath();
    restartAnimations(svg);
    restartAnimations(svgPath);
    restartAnimations(...motionDemo);
}

function restartAnimations(...elements) {
    elements.forEach((el) =>
        el.getAnimations().forEach((anim) => {
            anim.cancel();
            anim.play();
        })
    );
}

// OK {
// svgFinish.style.animationPlayState= 'paused';
// }
// badThing {
// svgFinish.style.animationPlayState= 'running';
// }
