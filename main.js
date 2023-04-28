import './style.css'

import P5 from 'p5'
import { rainbow, short } from './library.js'

const p5 = new P5()
const library = short.reverse()

const W = 60
const H = 60
const NOISE_SCALE = 30
const USE_MOUSE = true

let buffer = ''
let bb

const container = document.querySelector('#app')
let t = 0
let mouse = { x: 0, y: 0 }
document.addEventListener('mousemove', e => {
  const bb = container.getBoundingClientRect()
  mouse = {
    x: e.clientX - bb.x,
    y: e.clientY - bb.y
  }
})

function updateBuffer() {
  t += 0.025;
  let str = ''
  bb = container.getBoundingClientRect()
  for (let y = 0; y < H; y++) {
    str += '<div>'
    for (let x = 0; x < W; x++) {
      const coords = {
        x: map(x, 0, W, 0, bb.width),
        y: map(y, 0, H, 0, bb.height)
      }
      const noise = p5.map(p5.noise(x / NOISE_SCALE, y / NOISE_SCALE, t), 0, 1, 0, 1)

      let offset = 0;
      if (USE_MOUSE && mouse.x > 0 && mouse.x < bb.width && mouse.y > 0 && mouse.y < bb.height) {
        const d = p5.dist(coords.x, coords.y, mouse.x, mouse.y)
        offset = p5.map(d, 0, bb.width / 2, 0.5, 0, true)
      }
      const char = library[Math.floor((p5.constrain(noise + offset, 0, 1)) * (library.length-1))]
      str += `<span>${char}</span>`
    }
    str += '</div>'
  }
  buffer = str
  container.innerHTML = buffer
  requestAnimationFrame(updateBuffer)
}

requestAnimationFrame(updateBuffer)