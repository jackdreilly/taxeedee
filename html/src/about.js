import {on} from 'delegated-events';

function toggle(value, a, b) {
  return value === a ? b : a;
}

function setupHumburger() {
  on('click', '#humburger', event => {
    const humburger = document.querySelector("#dropdown");
    humburger.style.display = toggle(humburger.style.display, "none", "block");
  });
}

window.onload = () => {
  setupHumburger();
};
