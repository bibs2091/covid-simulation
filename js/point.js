class Point {
    constructor(id, infected = false, quarantine_prob = 0) {
        this.id = id //declare id
        this.quarantine = this.quarantined(quarantine_prob)
        this.plane = $("div#plane") //retrieve the div where we do the simulation
        var maxX = this.plane.width() - 15 //minus the size of the ball to not get too close to the wall 
        var maxY = this.plane.height() - 15
        this.x = util.getRandomInt(0, maxX) //init the ball value in the x axis 
        this.y = util.getRandomInt(0, maxY) //init the ball value in the y axis

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
        return util.getRandomInt(min, max)
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
    quarantined(quarantine = 0.5) {
        return 1 - (Math.random() >= quarantine);
    }
    remove() {
        $("#" + this.id).remove()
    }
}