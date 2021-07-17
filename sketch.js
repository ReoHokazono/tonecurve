let img
let startImg
let editImg
let luts
let rgbLut = []
let rLut = []
let gLut = []
let bLut = []
let toneCurveGui
let pointsMaker
let ansPoints 
let ansLuts
let invLuts
let imgW
let imgH
let lutCompare
let reloadButton
let ansButton
let nextButton
let menuButton

let pg
let loading

const frameWidth = 950
const frameHeight = 560

let dx = 5
let dy = 5
let currentLevel = 0
let levelPlay = 0

let offsetX = 0
let offsetY = 0

let footer

let imageUrls =  ["https://source.unsplash.com/collection/1353633/400x300", "https://source.unsplash.com/collection/590343/400x300"]
let imageUrlIndex = 0

let photoTypeSelect
let levelSelect
let levelBar
let crop = 200

let isTutorial = true
let tutorial

let popover
let timeoutID
let hideTimeoutID

let showPopover = function() {
  popover[0].show()
  hideTimeoutID = setTimeout(hidePopover, 3000) 
}

let hidePopover = function() {
  popover[0].hide()
}

let reloadImage = function(){
  if (!isTutorial) {
    loading.show()
  }
  
  nextButton.val = 0
  lutCompare.reset()
  toneCurveGui.reset()
  ansPoints = pointsMaker.randomPoints(currentLevel)
  ansLuts = LutUtil.createLuts(ansPoints)
  invLuts = LutUtil.createInvLuts(ansLuts)
  toneCurveGui.ansPoints = ansPoints
  toneCurveGui.ansLuts = ansLuts
  toneCurveGui.drawAns = false
  lutCompare.calcInit(ansLuts)
  imageUrlIndex = imageUrlIndex == 0 ? 1 : 0
  loadImage(imageUrls[imageUrlIndex], res => {
    loading.hide()
    nextButton.val = 0.3
    img = res
    startImg = copyImage(res)
    editImg = copyImage(res)
    editImage(invLuts, img, startImg)
    if (!isTutorial) {
      drawImage()
      
      clearTimeout(timeoutID)
      timeoutID = setTimeout(showPopover, 90000)
    }
    
  })
}

let nextPlay = function() {
  levelBar.countup()
  levelPlay += 1
  if (levelPlay == 3 && currentLevel != 4) {
    levelPlay = 0
    currentLevel += 1
    let str = "Level " + (currentLevel + 1)
    levelSelect.selected(str)
    if (currentLevel < 3) {
      background("#131415")
      tutorial = new Tutorial({x: dx, y: dy + 418}, 725, 110, currentLevel)
      isTutorial = true
    }
  }
  ansButton.level = currentLevel
  if(levelPlay == 2 && currentLevel == 4) {
    nextButton.label = "GOAL"
  } else {
    nextButton.label = "NEXT"
  }
  
  if(levelPlay == 3 && currentLevel == 4) {
    swal({
      text: "Level 5までクリアしました！🎉 右側のメニューから、画像の種類とレベルを自由に選んでプレイできます。",
         })
  } else {
  }
  reloadImage()
}

let drawAns = function() {
  toneCurveGui.drawAnsx()
}

let showTutorial = function() {
  background("#131415")
      tutorial = new Tutorial({x: dx, y: dy + 418}, 725, 110, currentLevel > 2 ? 2 : currentLevel)
      isTutorial = true
}

let nullfunc = function() {
}

function setup() {
  pg = createGraphics(400, 300)
  createCanvas(frameWidth, frameHeight)
  background("#131415")
  
  //dx = 0.5*(windowWidth - frameWidth)
  //dy = 0.5*(windowHeight - frameHeight)
 
  createFooter()
  
  offsetX = (windowWidth - width) / 2 
  offsetY = (windowHeight - height) / 2 - (68+15) * 0.5
  
  setupLoadingUI()
  
  toneCurveGui = new ToneCurveGui({ x: 430 + dx, y: 70 + dy}, 280)
  toneCurveGui.draw()
  
  lutCompare = new LutCompare()
  pointsMaker = new PointsMaker()
    
  setupButtons()
  
  tutorial = new Tutorial({x: dx, y: dy + 418}, 725, 110, 0)
  
  
}

function setupButtons(){
  nextButton = new NextButton("NEXT", { x:415 + dx, y:420 + dy }, 310, nextPlay)
  reloadImage()
  levelBar = new LevelBar({x: dx, y: 20 + dy}, 725)
  reloadButton = new ReloadButton("", { x:735 + dx, y:55 + dy }, 40 , nullfunc, reloadImage)
  reloadButton.loadIcon()
  ansButton = new HintButton("", { x:735 + dx, y:105 + dy }, 40 , showTutorial, drawAns)
  
  menuButton  = new MenuButton("", { x:735 + dx, y:155 + dy }, 40)
}

function createFooter() {
  footer = createDiv(`<p>Photos by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a></p><p>Icons by <a href="https://icons8.com" target="_blank" rel="noopener noreferrer">Icons8</a></p><p><a href="https://note.com/hokazono_reo/n/nee8f76c11979" target="_blank" rel="noopener noreferrer">このウェブサイトについて</a></p><p>© 2020 Reo Hokazono. All Rights Reserved.</p>`)
  footer.class("footer")
}

function setupLoadingUI() {
  loading = createDiv("")
  loading.class("loader-inner")
  loading.class("ball-pulse")
  loading.child(createDiv(""))
  loading.child(createDiv(""))
  loading.child(createDiv(""))
  loading.position(offsetX + dx + 170,offsetY +  dy + 60 + 140)
  loading.hide()
}

function levelSelected() {
  let val = levelSelect.value()
  switch (val) {
    case "Level 1":
      currentLevel = 0
      break
    case "Level 2":
      currentLevel = 1
      break
    case "Level 3":
      currentLevel = 2
      break
    case "Level 4":
      currentLevel = 3
      break
    case "Level 5":
      currentLevel = 4
      break
  }
  levelBar.setLevel(currentLevel)
  reloadImage()
}

function selectionChanged() {
  let item = photoTypeSelect.value()
  for (let i = 0; i < photoTypes.length; i++) {
    if (photoTypes[i].label == item) {
      imageUrls = photoTypes[i].id
    }
  }
  reloadImage()
}


function draw() {
  if (isTutorial) {
    tutorial.draw()
  } else {
    nextButton.draw()
  }
}
  
function drawUI() {
  toneCurveGui.draw()
  reloadButton.draw()
  ansButton.draw()
  
  levelBar.draw()
  menuButton.draw()
  reloadButton.drawMenu()
  ansButton.drawMenu()
  menuButton.drawMenu()
}

function drawImage() {
  rgbLut = toneCurveGui.rgbLut
  rLut = toneCurveGui.rLut
  gLut = toneCurveGui.gLut
  bLut = toneCurveGui.bLut
  luts = [rgbLut, rLut, gLut, bLut]
  let ave = LutUtil.averageLuts(luts, invLuts)
  if (img) {
    let width = img.width
    let height = img.height
    imgW = width
    imgH = height
    let displayWidth = 400
    
    pg.image(img, 0, 0, 400, 300)
    
    let offset = 60
    editImage(ave, img, editImg)
    image(editImg, dx, offset + dy, 400, 300)
    let c = pg.get(0, 0, crop, 300)
    image(c, dx, offset + dy, crop, 300)

    strokeWeight(10)
    noFill()
    stroke("#131415")
    rect(dx - 5, offset - 5 + dy, 410, 310, 8)
    noStroke()
    strokeWeight(1) 
  }
}

function keyPressed() {
  if (isTutorial) {
    tutorial.keyPressed() 
  } else {
    toneCurveGui.keyPressed() 
  }
}

function keyReleased() {
  if (isTutorial) {
    tutorial.keyReleased()
  } else {
    drawUI()
    drawImage()
    nextButton.val = lutCompare.compare(ansLuts, luts)
  }
  
}

function mouseMoved() {
  if (isTutorial) {
  } else {
    drawUI()
    let isOnImg = 
      mouseX > dx &&
      mouseX < dx + 400 && 
      mouseY > dy + 30 &&
      mouseY < dy + 330
    if (isOnImg) {
      crop = mouseX - dx
      drawImage()
    } else if (crop != 200){
      crop = 200
      drawImage()
    }
  }
}

function mouseReleased() {
  if (isTutorial) {
    tutorial.mouseReleased()
  } else {
    toneCurveGui.mouseReleased()
    drawImage()
    nextButton.val = lutCompare.compare(ansLuts, luts)
    drawUI()
  }
  
}

function mouseDragged() {
  if (isTutorial) {
    tutorial.mouseDragged()
  } else {
    toneCurveGui.mouseDragged()
    drawUI()
    drawImage()
  }
}
  
function mousePressed() {
  if (isTutorial) {
    tutorial.mousePressed()
  } else {
    toneCurveGui.mousePressed()
    drawUI()
  }
  
}

function mouseClicked(){
  if (isTutorial) {
    tutorial.mouseClicked()
  } else {
    toneCurveGui.mouseClicked()
    reloadButton.mouseClicked()
    nextButton.mouseClicked()
    ansButton.mouseClicked()
    
    drawUI()
  } 
}

function windowResized() {
  offsetX = (windowWidth - width) / 2
  offsetY = (windowHeight - height) / 2 - (68+15) * 0.5
  loading.position(offsetX + dx + 170,offsetY +  dy + 60 + 140)
  menuButton.updateSelectPos()
  // dx = 0.5*(windowWidth - frameWidth)
  // dy = 0.5*(windowHeight - frameHeight)
  // resizeCanvas(windowWidth, windowHeight)
  // background("#131415")
  // if (!isTutorial) {
  //   drawUI()
  //   drawImage()
  // }
}

function copyImage(source) {
  let target = createImage(source.width, source.height)
  source.loadPixels()
  target.loadPixels()
  for (let i = 0; i < 4 * source.width *source.height; i+= 4) {
    target.pixels[i] = source.pixels[i]
    target.pixels[i + 1] = source.pixels[i + 1]
    target.pixels[i + 2] = source.pixels[i + 2]
    target.pixels[i + 3] = source.pixels[i + 3]
  }
  source.updatePixels()
  target.updatePixels()
  return target
}

function editImage(lut, source, target) {
  source.loadPixels()
  target.loadPixels()
  for (let i = 0; i < 4 * source.width * source.height; i+= 4) {
    target.pixels[i] = lut[1][source.pixels[i]]
    target.pixels[i + 1] = lut[2][source.pixels[i + 1]]
    target.pixels[i + 2] = lut[3][source.pixels[i + 2]]
    
    target.pixels[i] = lut[0][target.pixels[i]]
    target.pixels[i + 1] = lut[0][target.pixels[i + 1]]
    target.pixels[i + 2] = lut[0][target.pixels[i + 2]]
  }

  source.updatePixels()
  target.updatePixels()
}