'use strict';

const clockface = document.querySelector('.js-clockface');
const startBtn = document.querySelector('.js-start');
const stopBtn = document.querySelector('.js-stop');
const lapBtn = document.querySelector('.js-lap');
const list = document.querySelector('.js-laps');

class Timer {
  constructor({ onTick }) {
    // onTick: updateClockface - передается функция. 
    // Объект настроек для обновления показаний таймера.
    stopBtn.disabled=true;
    this.startTime = null;
    this.deltaTime = null;
    this.isActive = false;
    this.timerId = null;
    this.onTick = onTick;
  }

  start() {
    if (!this.isActive) {
      this.isActive = true;
      this.startTime = Date.now() - this.deltaTime;

      this.timerId = setInterval(() => {
        const currentTime = Date.now();
        this.deltaTime = currentTime - this.startTime;

        let time = new Date(this.deltaTime);
        let min = time.getMinutes();
        let sec = time.getSeconds();
        let ms = Number.parseInt(time.getMilliseconds() / 100);

        if (min < 10) {
          min = '0' + min;
        }
        if (sec < 10) {
          sec = '0' + sec;
        }
        console.log('Таймер обновляется раз в 100мс');
        startBtn.textContent = `Pause`;
        stopBtn.disabled=false;
        stopBtn.style.background='red';
        lapBtn.style.background='yellow';
        this.onTick({ min, sec, ms });

      }, 100);
    }
     else {
        this.isActive = false;
        clearInterval(this.timerId);
        startBtn.textContent = `Continue`;
    }   
  }
  lap(){
    const listItems = document.createElement('li');
    listItems.textContent = clockface.textContent;
    list.append(listItems);
  }
  stop() {
    this.isActive = false;
    clearInterval(this.timerId);
    this.timerId = null;
    this.startTime = null;
    this.deltaTime = 0;
    startBtn.textContent = `Start`;
    stopBtn.disabled=true;
    stopBtn.style.background='';
     lapBtn.style.background='';
    const laps = document.querySelectorAll('li');
    laps.forEach((elem) => elem.remove());

    this.onTick({ min: "00", sec: "00", ms: 0 });
  }
}

const timer = new Timer({
  onTick: updateClockface,
});

startBtn.addEventListener('click', timer.start.bind(timer));
lapBtn.addEventListener('click', timer.lap.bind(timer));
stopBtn.addEventListener('click', timer.stop.bind(timer));

updateClockface({ min: "00", sec: "00", ms: 0 });

function updateClockface({ min, sec, ms }) {

clockface.textContent = `${min}:${sec}.${ms}`;
}
