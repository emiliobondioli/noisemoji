import './style.css'

import P5 from 'p5'
import { rainbow, short } from './library.js'

const p5 = new P5()
const library = short.reverse()

const container = document.querySelector('#app')
const sample = container.querySelector('#sample')
const sampleBB = sample.getBoundingClientRect()
let bb = container.getBoundingClientRect()
let W, H
let NOISE_SCALE = 60
let USE_MOUSE = true
let buffer = ''
let t = 0
let mouse = { x: 0, y: 0 }
let mouseInc = 0;
let mousedown = false;

document.addEventListener('mousedown', e => mousedown = true)
document.addEventListener('mouseup', e => mousedown = false)
document.addEventListener('touchstart', e => mousedown = true)
document.addEventListener('touchend', e => mousedown = false)
document.addEventListener('mousemove', e => updateMouse(e))
document.addEventListener('touchmove', e => updateMouse(e.touches[0]))
window.addEventListener('resize', init)

function updateMouse(e) {
  mouse = {
    x: e.clientX - bb.x,
    y: e.clientY - bb.y
  }
}


function init() {
  bb = container.getBoundingClientRect()
  W = Math.ceil(bb.width / Math.floor(sampleBB.width / 1.05))
  H = Math.ceil(bb.height / Math.floor(sampleBB.height / 1.25))
  console.log(bb.height, sampleBB.height, H)
}

init()

function updateBuffer() {
  t += 0.003;
  let str = ''
  if(mousedown) mouseInc += 0.01
  else mouseInc -= 0.01
  mouseInc = p5.constrain(mouseInc, 0, 1)
  for (let y = 0; y < H; y++) {
    // str += '<div>'
    for (let x = 0; x < W; x++) {
      const coords = {
        x: map(x, 0, W, 0, bb.width),
        y: map(y, 0, H, 0, bb.height)
      }
      const noise = p5.map(p5.noise(x / NOISE_SCALE, y / NOISE_SCALE, t), 0, 1, 0, 1)

      let offset = 0;
      if (USE_MOUSE) {
        const d = p5.dist(coords.x, coords.y, mouse.x, mouse.y)
        offset = p5.map(d, 0, Math.max(bb.width, bb.height) / 4, 0.5, 0, true) * mouseInc
      }
      const char = library[Math.floor((p5.constrain(noise + offset, 0, 1)) * (library.length - 1))]
      str += char
      // str += `<span>${char}</span>`
    }
    str += '<br/>'
  }
  buffer = str
  sample.innerHTML = buffer
  requestAnimationFrame(updateBuffer)
}

requestAnimationFrame(updateBuffer)