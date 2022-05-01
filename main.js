/**
 * 절차
 * 1. 이미지의 지정한 부분을 가져오기
 * 2. 이미지의 지정한 부분의 평균 색을 가져오기
 * 3. 글자 색을 평군 색의 보색으로 변경하기
 */

/* 요소 */
let averageRgbColor = {
  r: 0,
  g: 0,
  b: 0,
}
let beforeAverageRgbColor = {
  r: 0,
  g: 0,
  b: 0,
}
let textPositionInfo = { 
  x: 0, 
  y: 0, 
  width: 0, 
  height: 0
}
const imageEl = document.querySelector('img')
const textEl = document.querySelector('.text_wrapper')

/* 함수 */
function setTextColorToComplementaryColor (r, g, b) {
  textEl.style.setProperty('color', `rgb(${255 - r}, ${255 - g}, ${255 - b})`, 'important')
}

function setAverageRgbColor() {
  const rgb = { 
    r: 0,
    g: 0,
    b: 0,
  }

  const { x, y, width, height } = textPositionInfo
  const canvasEl = document.createElement('canvas', { width, height })
  let canvasElWidth, canvasElHeight
  if (Math.abs(width) <= Math.abs(height)) {
    canvasElHeight = imageEl.height
    canvasElWidth = canvasElHeight * width / height
  } else {
    canvasElWidth = imageEl.width
    canvasElHeight = canvasElWidth * height / width
  }
  canvasEl.width = canvasElWidth
  canvasEl.height = canvasElHeight
  
  const canvasImageEl = document.createElement('img')
  canvasImageEl.addEventListener('load', () => {
    const rateWidth = canvasImageEl.width / imageEl.width
    const rateHeight = canvasImageEl.height / imageEl.height
    const context = canvasEl.getContext('2d')
    context.drawImage(
      canvasImageEl, 
      x * rateWidth,
      y * rateHeight, 
      width * rateWidth,
      height * rateHeight,
      (canvasElWidth - canvasElWidth * 0.9) / 2, 
      (canvasElHeight - canvasElHeight * 0.9) / 2, 
      canvasElWidth * 0.9, 
      canvasElHeight * 0.9,
    )

    try {
      data = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
    } catch(e) {
      return defaultRGB
    }

    let count = 0
    const blockSize = 5
    for (let i = 0; i < data.data.length; i += blockSize * 4) {
      count++
      rgb.r += data.data[i]
      rgb.g += data.data[i + 1]
      rgb.b += data.data[i + 2]
    }
    rgb.r = Math.floor(rgb.r / count)
    rgb.g = Math.floor(rgb.g / count)
    rgb.b = Math.floor(rgb.b / count)
    averageRgbColor = rgb 
  })
  canvasImageEl.src = imageEl.getAttribute('src')
}

function initPositionOfText() {
  const textEl = document.querySelector('.text')
  const textRect = textEl.getBoundingClientRect()
  const { x, y, width, height } = textRect
  textPositionInfo = { x, y, width, height }
}

function initImageCanvas() {
  const imageCanvasEl = document.querySelector('.image_section canvas')
  imageCanvasEl.width = imageEl.width
  imageCanvasEl.height = imageEl.height
}

function initInterval() {
  const averageRgbColorUpdateInterval = setInterval(() => {
    setAverageRgbColor()
  }, 3 * 1000)

  const textColorUpdateInterval = setInterval(() => {
    const isDIff = beforeAverageRgbColor.r !== averageRgbColor.r && beforeAverageRgbColor.g !== averageRgbColor.g && beforeAverageRgbColor.b !== averageRgbColor.b
    if(isDIff) {
      beforeAverageRgbColor = averageRgbColor
      setTextColorToComplementaryColor(averageRgbColor.r, averageRgbColor.g, averageRgbColor.b)
    }
  }, 2 * 1000)
}

function init() {
  initImageCanvas()
  initPositionOfText()
  initInterval()
}

/* 실행 */
window.addEventListener('load', () => init())
