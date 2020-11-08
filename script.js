class Point {
    constructor(id, infected = false, quarantine_prob = 0) {
        this.id = id //declare id
        this.quarantine = this.quarantined(quarantine_prob)
        this.plane = $("div#plane") //retrieve the div where we do the simulation
        var maxX = this.plane.width() - 15 //minus the size of the ball to not get too close to the wall 
        var maxY = this.plane.height() - 15
        this.x = getRandomInt(0, maxX) //init the ball value in the x axis 
        this.y = getRandomInt(0, maxY) //init the ball value in the y axis

        this.display() //show the ball
        this.angle = this.direction() //init the ball's angle
        this.infected = infected
        if (infected == true) {
            this.infecte() //infect the ball
        }
    }
    //show the ball in the place with the init x and y
    display() {
        this.circle = $("<div class='circle' id='" + this.id + "'></div>")
        this.circle.css({
            bottom: this.y,
            left: this.x
        })
        //append circle to the plane
        this.circle.appendTo(this.plane)
    }

    //change the color of the ball in case it's an infected case
    infecte() {
        $("#" + this.id).addClass("infected").attr('infected', 'true');
        this.infected = true
        this.angle = this.angle + 5
        this.move(this.angle)

    }

    //random direction angle
    direction(min = 0, max = 360) {
        return getRandomInt(min, max)
    }

    //change the position of the ball depending on the angle
    move(angle) {
        if (this.quarantine == false) {
            // border right
            if (this.x > (this.plane.width() - 17)) {
                this.angle = this.direction(90, 270)
            }
            // border left
            else if (this.x < 0) {
                this.angle = this.direction(0, 90)
            }
            // border top
            else if (this.y > (this.plane.height() - 17)) {
                this.angle = this.direction(0, 180)
            }
            // border bottom
            else if (this.y < 0) {
                this.angle = this.direction(180, 360)
            }

            //what pixel to go to
            let rads = angle * Math.PI / 180
            let vx = Math.cos(rads)
            let vy = Math.sin(rads)
            this.x += vx
            this.y -= vy

            //change the position in css
            $("#" + this.id).css({
                bottom: Math.floor(this.y),
                left: Math.floor(this.x)
            })
        }
    }
    quarantined(quarantine = 0.5){
        return 1 - (Math.random() >= quarantine);  
    }
    remove() {
        $("#" + this.id).remove()
    }
}


//helper functions

function sleep(ms) { //sleep for a duration
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(min = 0, max) { // random integer between two numbers
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function distance(x1, x2, y1, y2) { //encludian distance between two points
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}

function initSimulation(pointsNum = 10) { //init simulation function
    let points = [] //array of the balls 
    let infected = getRandomInt(0, pointsNum) //choose which ball is infected intially
    for (var i = 0; i < pointsNum; i++) {
        point = new Point(i)
        if (i == infected) {
            point.infecte()
        }
        points.push(point); //add to the array
    }
    return points
}



k = {
    labels: [0],
    datasets: [{
        label: "infected",
        fillColor: "rgba(220,0,0,0.2)",
        strokeColor: "rgba(220,0,0,0.2)",
        pointColor: "rgba(220,0,0,0.2)",
        pointStrokeColor: "#f00",
        data: [0]
    }, ]
};
var speed = 20
var loop = true //to continue the simulation
var balls = 10
var ctx = $('#myChart');

var myChart = new Chart(ctx, {
    type: 'line',
    data: k,
    options: {
        width: "200px",
        backgroundColor: 'rgba(0, 255, 255, 0.8)'
    }

});
async function startSimulation(points) { //start simulation function
    infected = new Set(); // a set to not include duplicates
    let wwait = 0 //to avoid very slow speed when big balls numbers
    while (loop == true) { //run non stop
        for (var i = 0; i < points.length; i++) {
            points[i].move(points[i].angle) //move the point i with the angle initialized in the class

            //loop over the balls to check if any infected ball touched non infected ball
            for (var j = i + 1; j < points.length; j++) {
                if (points[i].infected == true || points[j].infected == true) { //if one of the balls is infected
                    let dis = distance(points[i].x, points[j].x, points[i].y, points[j].y) //calculate the distance between the j th ball and the ith ball 
                    if (dis <= 15) { //if they are touching each others infect the others if they aren't already infected
                        points[j].infecte()
                        points[i].infecte()
                        //add the new infected ball to the set
                        infected.add(i);
                        infected.add(j);
                    }
                }
            }
        }
        wwait += 1
        if (wwait == 3) { //to avoid very slow speed when big balls numbers
            wwait = 0
            await sleep(speed); //sleep for x ms to the next balls move
        }
        k.labels.push(k.labels.length)
        k.datasets[0].data.push(infected.size)
        myChart.update()
    }



}

$(document).ready(function () {
    $('input[type=range]#speedRange').on('input', function () {
        speed = Math.abs($(this).val() - 45);
    });

    $('#ballsRange').on('change', async function () {
        loop = false; //stop looping

        //delete all existing balls
        for (var i = 0; i < points.length; i++) {
            points[i].remove()
            del = false
        }

        await sleep(50); //sleep for x ms to the next balls move
        //init with new balls value
        balls = $(this).val()
        points = initSimulation($(this).val())
        loop = true;
        k.labels = [0]
        k.datasets[0].data = [0]
        myChart.update()
        startSimulation(points)
    });

    $('#restart').on('click', async function () {
        loop = false; //stop looping
        for (var i = 0; i < points.length; i++) {
            points[i].remove()
            del = false
        }
        await sleep(50); //sleep for x ms to the next balls move
        points = initSimulation(balls)
        loop = true;
        startSimulation(points)
    });

    var points = initSimulation(balls)
    startSimulation(points)
});