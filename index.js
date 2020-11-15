const dom = {}

function selectDomElements(string) {
    const arr = string.replace(/\s/g, '').split(',')
    arr.forEach((val) => (dom[val] = document.querySelector(`.${val}`)));
}

selectDomElements('secHand, minHand, hourHand, hrsMins, dayNum, dayName, month, year')
const hand = document.querySelectorAll('.hand')


function setDate() {
    const now = new Date();
    const seconds = now.getSeconds()
    const secondsDeg = seconds * 6 + 90
    dom.secHand.style.transform = `rotate(${secondsDeg}deg) scale(1 ,0.8)`;
    const mins = now.getMinutes()
    const minsDeg = mins * 6 + 90
    dom.minHand.style.transform = `rotate(${minsDeg}deg) scale(0.9, 1)`;
    const hrs = now.getHours()
    const hrsDeg = hrs * 360 / 12 + 90
    dom.hourHand.style.transform = `rotate(${hrsDeg}deg) scale(0.6, 1.1)`;
    if (secondsDeg === 90) { hand.forEach((val) => { val.classList.remove('transition') }); }
    else if (secondsDeg === 96) { hand.forEach((val) => { val.classList.add('transition') }); }
    dom.hrsMins.innerText = `${('0' + hrs).slice(-2)}:${('0' + mins).slice(-2)}`

    //DATE
    dom.dayNum.innerText = now.getDate();
    dom.dayName.innerText = now.toLocaleString('eng', { weekday: 'long' })
    dom.month.innerText = now.toLocaleString('eng', { month: 'long' })
    dom.year.innerText = now.getFullYear();
}

setInterval(setDate, 1000);
