//helper functions
class helper {
    constructor() {}
    sleep(ms) { //sleep for a duration
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getRandomInt(min = 0, max) { // random integer between two numbers
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    distance(x1, x2, y1, y2) { //encludian distance between two points
        let a = x1 - x2;
        let b = y1 - y2;
        return Math.sqrt(a * a + b * b);
    }
}

util = new helper()