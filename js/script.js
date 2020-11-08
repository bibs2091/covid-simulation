//necesarry functions
function initSimulation(pointsNum = 10,quarantinedProbability = probs) { //init simulation function
    let points = [] //array of the balls 
    let infected = util.getRandomInt(0, pointsNum) //choose which ball is infected intially
    for (var i = 0; i < pointsNum; i++) {
        point = new Point(i,false,quarantinedProbability)
        if (i == infected) {
            point.infecte()
        }
        points.push(point); //add to the array
    }
    return points
}

async function startSimulation(points) { //start simulation function
    infected = new Set(); // a set to not include duplicates
    let wwait = 0 //to avoid very slow speed when big balls numbers
    while (loop == true) { //run non stop
        for (var i = 0; i < points.length; i++) {
            points[i].move(points[i].angle) //move the point i with the angle initialized in the class

            //loop over the balls to check if any infected ball touched non infected ball
            for (var j = i + 1; j < points.length; j++) {
                if (points[i].infected == true || points[j].infected == true) { //if one of the balls is infected
                    let dis = util.distance(points[i].x, points[j].x, points[i].y, points[j].y) //calculate the distance between the j th ball and the ith ball 
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
            k.labels.push(k.labels.length)
            k.datasets[0].data.push(infected.size)
            myChart.update()
            await util.sleep(speed); //sleep for x ms to the next balls move
        }

    }
}

//restart function
async function restart(){
    loop = false; //stop looping
    for (var i = 0; i < points.length; i++) {
        points[i].remove()
        del = false
    }
    await util.sleep(50); //sleep for x ms to the next balls move
    points = initSimulation(balls)
    loop = true;
    startSimulation(points)
}

//chartjs
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
var ctx = $('#myChart');
var myChart = new Chart(ctx, {
    type: 'line',
    data: k,
    options: {
        legend: {
            display: false,
        },
        backgroundColor: 'rgba(0, 255, 255, 0.8)'
    }

});
 //variabels
var speed = 20
var loop = true //to continue the simulation
var balls = 10
var probs = 0
$(document).ready(function () {
    //listeners
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
        await util.sleep(50); //sleep for x ms to the next balls move
        //init with new balls value
        balls = $(this).val()
        points = initSimulation($(this).val())
        loop = true;
        k.labels = [0]
        k.datasets[0].data = [0]
        myChart.update()
        startSimulation(points)
    });
    $('#probsRange').on('change', async function () {
        loop = false; //stop looping

        //delete all existing balls
        for (var i = 0; i < points.length; i++) {
            points[i].remove()
            del = false
        }
        await util.sleep(50); //sleep for x ms to the next balls move
        //init with new balls value
        probs = $(this).val()
        points = initSimulation(balls,probs)
        loop = true;
        k.labels = [0]
        k.datasets[0].data = [0]
        myChart.update()
        startSimulation(points)
    });
    
    $('#restart').on('click',  function () {
        restart()
    });
    
    
});

//start here
var points = initSimulation(balls)
startSimulation(points)