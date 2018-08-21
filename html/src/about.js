import {on} from 'delegated-events';

function toggle(value, a, b) {
  return value === a ? b : a;
}

function setupHumburger() {
  document.querySelector("#humburger").onclick = event => {
    document.querySelector('#dropdown').classList.toggle("show");
  };
}

window.onload = () => {
  setupHumburger();
};
