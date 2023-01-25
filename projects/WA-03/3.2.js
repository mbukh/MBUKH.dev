// Ex3.2 - People on the Bus
// Number of people in the bus
// There is a bus moving in the city, and it takes and drop some people in each bus stop.
// You are provided with a list (or array) of integer arrays (or tuples).
// Each integer array has
// two items which represent number of people get into bus (The first item) and
// number of people get off the bus (The second item) in a bus stop.
// Your task is to return number of people who are still in the bus after the last bus station (after the last array).
// Even though it is the last bus stop, the bus is not empty and some people are still in the bus,
// and they are probably sleeping there :D
// Take a look on the test cases.
// Please keep in mind that the test cases ensure that the number of people in the bus is always >= 0.
// So the return integer can't be negative.
// The second value in the first integer array is 0, since the bus is empty in the first bus stop.

function getLastBusStopPeople(busStops) {
    if (
        busStops[0][1] !== 0 ||
        busStops[0][busStops.length - 1] === 0 ||
        busStops.some((b) => !Number.isInteger(b[0]) || !Number.isInteger(b[1]))
    )
        return "incorrect input array";
    // test cases ensure that the number of people in the bus is always >= 0
    return busStops.reduce((acc, cur) => acc + cur[0] - cur[1], 0);
}

// Tests
let res;
res = getLastBusStopPeople([
    [0, 5],
    [7, 4],
    [10, 5],
    [0, 0],
]); //=
console.log(res);

res = getLastBusStopPeople([
    [5, 0],
    [7, 4],
    [10, 5],
    [0, 10],
]); //=
console.log(res);
