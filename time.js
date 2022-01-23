class Time {
    // Starting counter, used for starting animation
    counter = 1;
    isOn = false;

    constructor(callbacks) {
        // OPTIONAL - if object with callbacks exist
        if (callbacks) {
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onTimeZero = callbacks.onTimeZero;
            this.onTimeLeft = callbacks.onTimeLeft;
        }
    };
    setDate = () => {
        const { secHand, minHand, hourHand, hrsMins, hands, dayNum, dayName, month, year } = domTime;
        const now = new Date();
        const seconds = now.getSeconds()
        const secondsDeg = seconds * 6 + 90
        secHand.style.transform = `rotate(${secondsDeg}deg) scale(1 ,0.8)`;
        const minutes = now.getMinutes()
        const minsDeg = minutes * 6 + 90
        minHand.style.transform = `rotate(${minsDeg}deg) scale(0.9, 1)`;
        const hrs24 = now.getHours()
        const hrs12 = Number(now.toLocaleString('pl-PL', { hour: 'numeric', hour12: 'true' }).slice(0, 2))
        const hrsDeg = hrs12 / 12 * 360 + 90

        hourHand.style.transform = `rotate(${hrsDeg}deg) scale(0.6, 1.1)`;
        if (secondsDeg === 90) hands.forEach((val) => val.classList.remove('transition'));
        else if (secondsDeg === 96) hands.forEach((val) => val.classList.add('transition'));
        hrsMins.innerText = `${('0' + hrs24).slice(-2)}:${('0' + minutes).slice(-2)}`

        //DATE
        dayNum.innerText = now.getDate();
        dayName.innerText = now.toLocaleString('eng', { weekday: 'long' })
        month.innerText = now.toLocaleString('eng', { month: 'long' })
        year.innerText = now.getFullYear();

        this.seconds = seconds;
        this.minutes = minutes;
        this.hours = hrs12;
    }
    start = () => {
        this.setDate()
        if (this.onStart) { this.onStart(this.counter) }
        if (!this.isOn) {
            this.isOn = !this.isOn
            setInterval(this.tick, 1000)
            this.boxShadow = '0 0 6px BlueViolet'
        }
    }
    getPerimeter = (circleDOM) => {
        const perimeter = circleDOM.getAttribute('r') * 2 * Math.PI;
        circleDOM.setAttribute('stroke-dasharray', perimeter)
        return perimeter
    }
}



class Clock extends Time {
    constructor(circle, counter, callbacks) {
        super(counter, callbacks)
        this.circle = circle;
    }
    tick = () => {
        this.setDate()
        let calc = (60 - this.counter) / 60;

        // Option, e.g. customize hue
        if (this.onTick) this.onTick(calc, this.counter)

        // Draw svg stroke
        this.perimeter = this.getPerimeter(this.circle)
        this.circle.setAttribute('stroke-dashoffset', ((60 - this.counter) / 60 * this.perimeter) + this.perimeter)

        if (this.counter >= 60) this.counter = 0
    }
}


class Countdown extends Time {
    isOn = false;
    inputIsValid = true;
    isCountMinutes = true;

    constructor(domTimer, callbacks) {
        super(callbacks)
        this.input = domTimer.input;
        this.form = domTimer.form;
        this.timer = domTimer.timerDiv;
        this.circle = domTimer.circleTimer;

        // EVENTS
        this.input.addEventListener('input', this.changeTime)
        this.form.addEventListener('submit', this.onSubmit)
    };

    start = () => {
        if (this.onStart) { this.onStart(this.counter) }
        if (!this.isOn) {
            this.isOn = !this.isOn
            this.input.value = this.counter;
            this.id = setInterval(this.tick, 1000)
            this.boxShadow = 'inset -1px -1px 3px -1px grey'
        }
    }
    pause = () => {
        clearInterval(this.id)
        this.isCountMinutes = true;
        this.isOn = false;
    }

    tick = () => {
        this.setDate()
        const { input, timeLeft, circle } = this;
        this.counter = timeLeft;

        // Show timeLeft on input
        input.value = this.counter

        // Draw svg stroke
        const perimeter = this.getPerimeter(circle)
        this.circle.setAttribute('stroke-dashoffset', (this.counter / 60 * perimeter) + perimeter)

        // Different degree calculations depending if timer shows (hours, minutes or seconds)
        if (this.isCountMinutes) {
            this.degree = (this.minutes / 60 * 360) + (this.counter / 60 * 360)
        }
        else if (this.isCountHours) {
            const countHours = Math.floor(this.counter / 60)
            this.degree = (this.hours / 12 * 360) + (countHours / 12 * 360)
            circle.setAttribute('stroke-dashoffset', (countHours / 12 * perimeter) + perimeter)
        }
        if (this.isCountMinutes || this.isCountHours) {
            circle.style.transform = `rotate(${-90 + this.degree}deg) scale(0.82) translate(50%)`
        }

        // Option, e.g. customize hue
        let calc = (60 - this.counter) / 60;
        if (this.onTick) this.onTick(calc, this.counter)

        if (this.counter <= 0) this.timeZero()
    }
    timeZero() {
        this.isCountMinutes = true;
        clearInterval(this.id);
        this.isOn = false;
        this.boxShadow = 'inset 0 0 2px deeppink'

        // OPTIONAL callback
        if (this.onTimeZero) this.onTimeZero()
    }
    changeTime = () => {
        // Counting is paused when user changing input
        this.pause();

        const inputValue = Number(this.input.value)

        // Maximum number of minutes is set for 720 (12 hours)
        if (inputValue > 720) {
            this.counter = 720
            this.inputIsValid = true;
        }
        else if (inputValue) {
            this.counter = inputValue
            this.inputIsValid = true;
        }
        else {
            // Thin pink border when user enter invalid input
            if (this.input.value.length) {
                this.boxShadow = '0 0 3px 1px DeepPink'
            }
            this.inputIsValid = false;
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        if (this.inputIsValid) {
            this.start()
            this.input.blur()
        }
        // Thick pink border when user tries to send (invalid or empty) input
        else { this.boxShadow = '0 0 2px 2px DeepPink' }
    }
    get timeLeft() {
        // If (count is < 1) then show seconds, if (count is > 60) then show hours, otherwise show minutes
        // Minutes -> Hours
        if (this.counter > 60) {
            this.isCountHours = true;
            this.isCountMinutes = false;
        }
        // Hours -> Minutes
        else if (this.isCountHours && this.counter <= 60) {
            this.isCountHours = false;
            this.isCountMinutes = true;
        }
        // Minutes -> Seconds
        else if (this.isCountMinutes && this.counter == 1) {
            this.isCountMinutes = false;
            this.isCountHours = false;
            this.counter = 60;
            this.circle.style.transform = `rotate(-90deg) scale(0.82) translate(50%)`
        }

        if (!this.isCountMinutes && !this.isCountHours) this.counter--
        else if ((this.isCountMinutes || this.isCountHours) && this.seconds === 0) this.counter--
        return this.counter;
    }
    // CSS
    set boxShadow(shadow) {
        this.input.style.boxShadow = shadow;
        this.timer.style.boxShadow = shadow;
    }
}