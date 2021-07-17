const tutorialWidth = 730
const tutorialHeight = 110

const t0Points = [
  [{x: 0, y:0}, {x: 80, y:150}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}]
]

const t1Points = [
  [{x: 0, y:0}, {x: 160, y:105}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}]
]

const t2Points = [
  [{x: 0, y:0}, {x: 88, y:53}, {x: 174, y:203}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}]
]

const t3Points = [
  [{x: 0, y:0}, {x: 55, y:81}, {x: 205, y:175}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}],
  [{x: 0, y:0}, {x: 255, y:255}]
]

const t0Texts = [
  "トーンカーブは写真の明るさや色合いを調整するツールです。 まずは、トーンカーブの線を右上にドラッグしてみます。",
  "トーンカーブの線をドラッグすると点が追加されます。 点を上向きに動かすと、写真が明るくなります", 
  "次は、点を逆方向に動かして、暗くしてみます。 点を選択して、Deleteキーを押すと点を削除できます。", 
  "チュートリアルはこれで終わりです。 トーンカーブを調整して、右半分の写真を左側の写真に近づけましょう！"
]

const t1Texts = [
  "2点をS字に配置して，コントラストをあげます。 （線をドラッグすると点を追加，Deleteキーで点を削除できます。）", 
  "S字を逆向きにすると，コントラストが下がります。 線をドラッグすると点を追加，Deleteキーで点を削除できます。"
]

const t2Texts = [
  "R, G, Bのタブをクリックして，それぞれの色を調整します。 線をドラッグすると点を追加，Deleteキーで点を削除できます。"
]


class Tutorial {
  constructor(pos, width, height, level) {
    this.level = level
    this.texts = [t0Texts,  t1Texts, t2Texts][this.level]
    this.pos = pos
    this.width = width
    this.height = height
    this.title = "Tutorial " + (level + 1)
    this.currentPage = 0
    
    
    this.loading = createDiv("")
    this.loading.class("loader-inner")
    this.loading.class("ball-pulse")
    this.loading.child(createDiv(""))
    this.loading.child(createDiv(""))
    this.loading.child(createDiv(""))
    this.loading.position(offsetX + dx + 170, offsetY +  dy + 60 + 140)
    this.loading.hide()
    this.toneCurveGui = new ToneCurveGui({ x: 430 + dx, y: 70 + dy}, 280)
    
    
    //this.showNext = function() 
    this.nullFunc = function() {
    }
    
    let me = this
    this.nextButton = new Button(
      "NEXT", 
      {x: this.pos.x + this.width - 140, y: this.pos.y + 30 }, 
      110,
      this.nullFunc, 
      function(){
        me.showNext(me)
      }
      
    )
    this.nextButton.bg = "#0A84FF"
    this.nextButton.hover = "#44A1FF"
    if (this.texts.length == 1) {
      this.nextButton.label = "START"
    }
    this.toneCurveGui.draw()
    this.load(this)
  }
  
  load(me) {
    me.loading.show()
    loadImage("https://source.unsplash.com/collection/8515895/400x300", res => {
      me.startImg = copyImage(res)
      me.editImg = copyImage(res)
      //editImage(me.luts, me.img, me.startImg)
      me.loading.hide()
      me.drawImage(me)
    })
  }
  
  drawImage(me) {
    if (!me.startImg) {
      return
    }
    let rgbLut = me.toneCurveGui.rgbLut
    let rLut = me.toneCurveGui.rLut
    let gLut = me.toneCurveGui.gLut
    let bLut = me.toneCurveGui.bLut
    let luts = [rgbLut, rLut, gLut, bLut]
    let offset = 60
    
    editImage(luts, me.startImg, me.editImg)
    image(me.editImg, dx, offset + dy, 400, 300)
      
    strokeWeight(10)
    noFill()
    stroke("#131415")
    rect(dx - 5, offset - 5 + dy, 410, 310, 8)
    noStroke()
    strokeWeight(1) 
  }
  
  showNext(me) {
      this.toneCurveGui.reset()
      if (me.currentPage + 1 > me.texts.length - 1) {
        isTutorial = false
        background("#131415")
        drawImage()
        drawUI()
      } else if (me.currentPage + 1 == me.texts.length - 1) {
        me.nextButton.label = "START"
        me.currentPage += 1
        //this.load(me)
      } else {
        me.currentPage += 1
        //this.load(me)
      }
  }
  
  draw() {
    //background("#131415")
    this.texts = [t0Texts,  t1Texts, t2Texts][this.level]
    noStroke()
    fill("#2E2F30")
    rect(this.pos.x, this.pos.y, this.width, this.height, 9)
    fill("#FFFFFF")
    textFont('Helvetica', 16)
    textAlign(LEFT, TOP)
    text(this.title, this.pos.x + 20, this.pos.y + 18)
    
    fill("#939393")
    text(this.texts[this.currentPage], this.pos.x + 20, this.pos.y + 45, 450)
    this.nextButton.draw()
    this.toneCurveGui.draw()
    this.drawGuideIfNeeded()
    
  }
    
  drawGuideIfNeeded() {
    let needGuide = 
        (this.level == 0 && this.currentPage == 0) ||
        (this.level == 0 && this.currentPage == 2) || 
        (this.level == 1)
    
    if (!needGuide) {
      return
    }
      
    let ansPoints
    if        (this.level == 0 && this.currentPage == 0) {
      ansPoints = t0Points
    } else if (this.level == 0 && this.currentPage == 2) {
      ansPoints = t1Points
    } else if (this.level == 1 && this.currentPage == 0) {
      ansPoints = t2Points
    } else if (this.level == 1 && this.currentPage == 1) {
      ansPoints = t3Points
    }
    this.toneCurveGui.ansPoints = ansPoints
    let ansLuts = LutUtil.createLuts(ansPoints)
    this.toneCurveGui.ansLuts = ansLuts
    this.toneCurveGui.drawAnsx()
  }
  
  mouseClicked() {
    this.nextButton.mouseClicked()
    this.toneCurveGui.mouseClicked()
  }
    
  mousePressed() {
    this.toneCurveGui.mousePressed()
    this.drawImage(this)
  }
    
  mouseDragged() {
    this.toneCurveGui.mouseDragged()
    this.drawImage(this)
  }
  
  mouseReleased() {
    this.toneCurveGui.mouseReleased()
    this.drawImage(this)
  }
    
  keyPressed() {
    this.toneCurveGui.keyPressed()
    this.drawImage(this)
  }
    
  keyReleased() {
    this.drawImage(this)
  }
}