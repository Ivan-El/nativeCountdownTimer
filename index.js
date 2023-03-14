const inputEl = document.querySelector('input');
const buttonEl = document.querySelector('button');
const timerEl = document.querySelector('span');
const remainingCircle = document.querySelector('#timer-path-remaining');
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
const COLOR_CODES = {
  info: {
    color: 'green',
  },
  warning: {
    color: 'orange',
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: 'red',
    threshold: ALERT_THRESHOLD,
  },
};
let timeLimit, timePassed, timeLeft, interval;

const fillNull = (num) => (num >= 10 ? `${num}` : `0${num}`);

const formatTime = (time) => {
  const hours = fillNull(Math.floor(time / 3600));
  const minutes = fillNull(Math.floor((time - hours * 3600) / 60));
  const sec = fillNull(time - hours * 3600 - minutes * 60);

  return `${hours}:${minutes}:${sec}`;
};

const setRemainingPathColor = (timeLeft) => {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    remainingCircle.classList.remove(warning.color);
    remainingCircle.classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    remainingCircle.classList.remove(info.color);
    remainingCircle.classList.add(warning.color);
  }
};

const calculateTimeFraction = () => {
  const rawTimeFraction = timeLeft / timeLimit;
  return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
};

const setCircleDasharray = () => {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} ${FULL_DASH_ARRAY}`;
  remainingCircle.setAttribute('stroke-dasharray', circleDasharray);
};

const createTimerAnimator = () => {
  return (seconds) => {
    if (seconds) {
      interval = setInterval(() => {
        timePassed += 1;
        timeLeft = timeLimit - timePassed;
        timerEl.innerHTML = formatTime(timeLeft);

        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        if (timeLeft === 0) clearInterval(interval);
      }, 1000);
    }
  };
};

const animateTimer = createTimerAnimator();

const startTimer = () => {
  if (inputEl.value) {
    interval && clearInterval(interval);
    const seconds = Number(inputEl.value);
    timeLimit = seconds;
    timePassed = 0;
    timeLeft = timeLimit;
    remainingCircle.classList.remove(COLOR_CODES.warning.color);
    remainingCircle.classList.remove(COLOR_CODES.alert.color);
    remainingCircle.classList.add(COLOR_CODES.info.color);
    animateTimer(seconds);
    inputEl.value = '';
  }
};

const onKeyDown = (evt) => {
  if (evt.key === 'Enter') startTimer();
};

inputEl.addEventListener('keydown', onKeyDown);

inputEl.addEventListener('input', (e) => {
  inputEl.value = e.target.value.replace(/[^0-9]/g, '');
});

buttonEl.addEventListener('click', startTimer);

