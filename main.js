import P5 from 'p5'
import { maps } from './library.js'
import './style.scss'

const p5 = new P5();
const container = document.querySelector('#app');
const mapButtons = Array.from(document.querySelectorAll('.map-button'));
const sliders = Array.from(document.querySelectorAll('.slider input'));
const sample = container.querySelector('#sample');
const sampleBB = sample.getBoundingClientRect();
let bb = container.getBoundingClientRect();

// state
let W, H;
let t = 0;
let mouse = { x: 0, y: 0 };
let mouseInc = 0;
let mousedown = false;
let currentMap = maps.base;

const config = {
  scale: 60,
  speed: 0.003,
  radius: 5,
  mouse: true,
  shuffle: true,
}

function setListeners() {
  document.addEventListener('mousedown', e => mousedown = true);
  document.addEventListener('mouseup', e => mousedown = false);
  document.addEventListener('touchstart', e => mousedown = true);
  document.addEventListener('touchend', e => mousedown = false);
  document.addEventListener('mousemove', e => updateMouse(e));
  document.addEventListener('touchmove', e => updateMouse(e.touches[0]));

  mapButtons.forEach(el => {
    el.addEventListener('click', () => setMap(el.dataset.map));
  })

  sliders.forEach(el => {
    el.value = config[el.dataset.param];
    el.addEventListener('input', () => setConfig(el.dataset.param, el.value));
  })

  window.addEventListener('resize', init);
}

function setConfig(key, value) {
  config[key] = parseFloat(value);
}

function setMap(key) {
  currentMap = maps[key];
  mapButtons.forEach(el => {
    el.classList.toggle('active', el.dataset.map === key);
  })
}

function updateMouse(e) {
  if (!mousedown) return;
  mouse = {
    x: e.clientX - bb.x,
    y: e.clientY - bb.y
  }
}

function init() {
  bb = container.getBoundingClientRect()
  W = Math.ceil(bb.width / Math.floor(sampleBB.width / 1.05));
  H = Math.ceil(bb.height / Math.floor(sampleBB.height / 1.25));
}

function update() {
  t += config.speed;
  let str = '';

  if (mousedown) mouseInc += 0.01;
  else mouseInc -= 0.01;
  mouseInc = p5.constrain(mouseInc, 0, 1);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const coords = {
        x: p5.map(x, 0, W, 0, bb.width),
        y: p5.map(y, 0, H, 0, bb.height)
      }
      const noise = p5.noise(x / config.scale, y / config.scale, t);
      if(x === 0 && y === 0) console.log(noise)

      let offset = 0;
      if (config.mouse) {
        const d = p5.dist(coords.x, coords.y, mouse.x, mouse.y)
        offset = p5.map(d, 0, Math.max(bb.width, bb.height) / (10 - config.radius), 1, 0, true) * mouseInc
      }
      
      const coeff = p5.constrain(noise + offset, 0, 1);
      let id = coeff * (currentMap.length - 1);

      if (config.shuffle) {
        const shuffle = p5.noise(y / config.scale, x / config.scale, -t);
        id += -1 + shuffle * 2
      }
      const char = currentMap[Math.floor(id)];
      str += char;
    }
    str += '<br/>';
  }

  sample.innerHTML = str;
  requestAnimationFrame(update);
}

// run
setListeners();
init();
requestAnimationFrame(update);