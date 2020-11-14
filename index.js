const hand = document.querySelectorAll('.hand')
const secondHand = document.querySelector('.second-hand')
const minHand = document.querySelector('.min-hand')
const hourHand = document.querySelector('.hour-hand')

function setDate() {
    const now = new Date();
    const seconds = now.getSeconds()
    const secondsDeg = seconds * 6 + 90
    secondHand.style.transform = `rotate(${secondsDeg}deg) scale(1 ,0.8)`;
    const mins = now.getMinutes()
    const minsDeg = mins * 6 + 90
    minHand.style.transform = `rotate(${minsDeg}deg) scale(0.9, 1)`;
    const hrs = now.getHours()
    const hrsDeg = hrs * 360 / 12 + 90
    hourHand.style.transform = `rotate(${hrsDeg}deg) scale(0.6, 1.1)`;
    if (secondsDeg === 90) { hand.forEach((val) => { val.classList.remove('transition') }); }
    else if (secondsDeg === 96) { hand.forEach((val) => { val.classList.add('transition') }); }
}

setInterval(setDate, 1000);
