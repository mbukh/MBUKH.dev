// ==================
// SVG path generator
// https://stackoverflow.com/questions/68512066/creating-random-svg-curves-in-javascript-while-avoiding-sharp-turns
// Even more fun here: https://jsbin.com/fuvomoz/1/edit?js,output
// Beautiful animation https://codepen.io/damongolding/pen/mdBBVWw
// ==================

let lastTwoPoints = [];

const W = document.documentElement.clientWidth;
const H = document.documentElement.clientHeight;

const MIN_ANGLE = 60;
const MIN_DISTANCE = Math.min(W, H) / 10;
const MAX_DISTANCE = Math.min(W, H) / 4;
const MAX_POINTS = 6;

let svg = document.querySelector("svg");
let path = document.querySelector("path");
let pointsLeft = MAX_POINTS * 2;
let countFailedToGetPointTries = 0;

svg.style.width = W;
svg.style.height = H;

createPath();

function getPoint() {
    let x = getRandomNumber(W * 0.6) + W * 0.2;
    let y = getRandomNumber(H * 0.6) + H * 0.2;
    let point = [x, y];

    if (lastTwoPoints.length < 2) {
        point = [0, H/2];
        lastTwoPoints.push(point);
    } else if (pointsLeft < 1) {
        point = [W, H/2];
        lastTwoPoints.push([W, point]);
    } else {
        if (
            countFailedToGetPointTries < 10 &&
            (getAngle(...lastTwoPoints, point) < MIN_ANGLE ||
                getDistance(lastTwoPoints[1], point) < MIN_DISTANCE ||
                getDistance(lastTwoPoints[1], point) > MAX_DISTANCE)
        ) {
            countFailedToGetPointTries += 1;
            pointsLeft += 1;
            point = getPoint();
        } else {
            countFailedToGetPointTries = 0;
            lastTwoPoints.shift();
            lastTwoPoints.push(point);
        }
    }
    pointsLeft -= 1;
    return point;
}

function pointString() {
    let point = getPoint();
    return `${point[0]} ${point[1]} `;
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

function createPath() {
    let path_string = `M ${pointString()} ${pointString()} C ${pointString()} ${pointString()} ${pointString()}`;

    for (let i = 0; i < MAX_POINTS * 2; i++) {
        path_string += `S ${pointString()} ${pointString()} `;
    }

    path.setAttribute("d", path_string);
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}
