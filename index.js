const domClock = selectDomElements('circleClockSeconds, circleClockMinutes')
const domTimer = selectDomElements('input, form, timerDiv, circleTimer')
const domTime = selectDomElements('secHand, minHand, hourHand, hrsMins, dayNum, dayName, month, year')
domTime.hands = document.querySelectorAll('.hand')


// Animated SVG for seconds
const clockSeconds = new Clock(domClock.circleClockSeconds, {
    onTick(calc, currentSeconds) {
        this.counter = this.seconds

        // Customize colors        /e.g. 80 + (calc * 72)
        let hue = calc * 360;
        this.circle.setAttribute('stroke', `hsla(${hue}, 100%, 30%, 100%)`)
    },
})
clockSeconds.start()


// Animated SVG for minutes
const clockMinutes = new Clock(domClock.circleClockMinutes, {
    onTick(calc, currentMinutes) {
        this.counter = this.minutes

        // Customize colors        
        let hue = calc * 360;
        this.circle.setAttribute('stroke', `hsla(${hue}, 100%, 40%, 50%)`)
    },
})
clockMinutes.start()


// Animated timer. Countdown starts when input is sent.
const countdown = new Countdown(domTimer, {
    onTick(calc, counter) {

        // Customize colors 
        let hue = calc * 360;
        this.circle.setAttribute('stroke', `hsla(${hue}, 100%, 50%, 30%)`)
    },
})