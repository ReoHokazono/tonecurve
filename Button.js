class ReloadButton {
  constructor(label, pos, width, pressing, clicked) {
    this.label = label
    this.pos = pos
    this.width = width
    this.height = 40
    this.pressing = pressing
    this.clicked = clicked  
    this.bg = "#454545"
    this.hover = "#5F5F5F"
    
    this.menuPos = { x: this.pos.x + this.width * 0.3,
               y: this.pos.y + this.width / 2
             }
    this.menuWidth = 178
    this.menuHeight = 80
    this.isHovering = false
  }
  
  loadIcon() {
    loadImage("icons/reload.png", res => {
      this.icon = res
    })
  }
  
  isOnButton() {
    let isOnButton = 
        mouseX >= this.pos.x && 
        mouseX <= this.pos.x + this.width && 
        mouseY >= this.pos.y && 
        mouseY <= this.pos.y + this.height
    return isOnButton
  }
  
  isOnMenu() {
    let isOnMenu = 
        mouseX >= this.menuPos.x && 
        mouseX <= this.menuPos.x + this.menuWidth && 
        mouseY >= this.menuPos.y && 
        mouseY <= this.menuPos.y + this.menuHeight
    return isOnMenu
  }
  
  drawMenu() {
    if (!this.isHovering) {
      return 
    }
    stroke("#8D8D8D")
    strokeWeight(1)
    fill("#2E2F30")
    rect(this.menuPos.x, this.menuPos.y, this.menuWidth, this.menuHeight, 5)
    
    fill("#FFFFFF")
    textFont('Helvetica', 16)
    textAlign(LEFT, TOP)
    text("問題を変更", this.menuPos.x + 10,  this.menuPos.y + 20)
    
    fill("#939393")
    text("レベルはそのままです", this.menuPos.x + 10, this.menuPos.y + 45, 144, 144)

  }
  
  hide() {
    noStroke()
    fill("#131415")
    rect(this.pos.x - 2, this.pos.y -2, this.width + 4, this.height + 4)
  }
  
  draw() {
    noStroke()
    fill("#131415")
    rect(this.menuPos.x - 2, this.menuPos.y - 2, this.menuWidth + 4, this.menuHeight + 4)
    textFont('Helvetica', 16)
    textAlign(CENTER, CENTER)
    if (this.isOnButton() && mouseIsPressed) {
      this.pressing()
    }
    
    fill(this.isOnButton() ? this.hover : this.bg)
    rect(this.pos.x, this.pos.y, this.width, this.height, 5)
    fill("#FFFFFF")
    
    if (this.icon) {
      image(this.icon, this.pos.x + 7.5, this.pos.y + 7.5, 25, 25)
    }
    text(this.label, this.pos.x, this.pos.y + this.height*0.5, this.width)
    
    if (this.isOnButton() || this.isHovering) {
      this.isHovering = this.isOnMenu() || this.isOnButton()
      //this.drawMenu()
    }
  }
  
  mouseClicked(){
    if (this.isOnButton()) {
      this.clicked()
    }
  }
}

class Button {
  constructor(label, pos, width, pressing, clicked) {
    this.label = label
    this.pos = pos
    this.width = width
    this.height = 40
    this.pressing = pressing
    this.clicked = clicked  
    this.bg = "#454545"
    this.hover = "#5F5F5F"
    
  }
  
  loadIcon() {
    loadImage("icons/reload.png", res => {
      this.icon = res
    })
  }
  
  isOnButton() {
    let isOnButton = 
        mouseX >= this.pos.x && 
        mouseX <= this.pos.x + this.width && 
        mouseY >= this.pos.y && 
        mouseY <= this.pos.y + this.height
    return isOnButton
  }
  
  hide() {
    noStroke()
    fill("#131415")
    rect(this.pos.x - 2, this.pos.y -2, this.width + 4, this.height + 4)
  }
  
  draw() {
    textFont('Helvetica', 16)
    textAlign(CENTER, CENTER)
    if (this.isOnButton() && mouseIsPressed) {
      this.pressing()
    }
    noStroke()
    fill(this.isOnButton() ? this.hover : this.bg)
    rect(this.pos.x, this.pos.y, this.width, this.height, 5)
    fill("#FFFFFF")
    
    if (this.icon) {
      image(this.icon, this.pos.x + 7.5, this.pos.y + 7.5, 25, 25)
    }
    text(this.label, this.pos.x, this.pos.y + this.height*0.5, this.width)
  }
  
  mouseClicked(){
    if (this.isOnButton()) {
      this.clicked()
    }
  }
}  

class NextButton {
  constructor(label, pos, width, clicked) {
    this.label = label
    this.pos = pos
    this.width = width
    this.height = 40
    this.clicked = clicked  
    this.bg = "#0A84FF"
    this.hover = "#44A1FF"
    this.val = 0
    this.sval = 0
    this.duration = 3
    this.e = new p5.Ease()
    this.ratio = 0
  }
  
  isOnButton() {
    let isOnButton = 
        mouseX >= this.pos.x && 
        mouseX <= this.pos.x + this.width && 
        mouseY >= this.pos.y && 
        mouseY <= this.pos.y + this.height
    return isOnButton
  }
  
  hide() {
    noStroke()
    fill("#131415")
    rect(this.pos.x - 2, this.pos.y -2, this.width + 4, this.height + 4)
  }
  
  draw() {
    if (this.val <= 0) {
      this.val = 0.001
    }
    
    if (this.val > 1) {
      this.val = 1
    }
    
    if (this.val != this.sval) {
      this.ratio += this.duration / frameRate()
      this.sval = this.sval + (this.val - this.sval) * this.e.exponentialInOut(this.ratio)
      
      if (this.e.exponentialInOut(this.ratio) >= 0.99) {
        this.ratio = 0
        this.sval = this.val
      }
      
    }
    
    noStroke()
    if (this.sval > 0.95) {
      fill(this.isOnButton() ? this.hover : this.bg)
    rect(this.pos.x, this.pos.y, this.width, this.height, 5)
      
    } else {
      fill("#454545")
      rect(this.pos.x, this.pos.y, this.width, this.height, 5)
      fill("#5B81A8")
      rect(this.pos.x, this.pos.y, this.width * this.sval, this.height, 5, 0, 0, 5)
      
    }
    noFill()
    strokeWeight(10)
    stroke("#131415")
    rect(this.pos.x - 5, this.pos.y - 5, this.width + 10, this.height + 10, 10, 0, 0, 10)
    if (this.sval > 0.95) {
      fill("#FFFFFF")
    } else {
      fill("#C3C3C3")
    }
    strokeWeight(1)
    noStroke()
    textFont('Helvetica', 20)
    textAlign(CENTER, CENTER)
    
    text(this.label, this.pos.x, this.pos.y + this.height*0.5, this.width)
    
    
  }
  
  mouseClicked(){
    if (this.isOnButton() && this.sval > 0.95) {
      this.clicked()
    }
  }
}

const hintsText = [
  "点を1つ追加して 調整してください", 
  "2点必要です", 
  "R,G,Bごとのトーン カーブも調整します", 
  "R,G,Bごとのトーン カーブも調整します", 
  "R,G,Bごとのトーン カーブも調整します。 2点必要なときも あります"
]

class HintButton {
  constructor(label, pos, width, showTutorial, showAns) {
    loadImage("icons/help.png", res => {
      this.icon = res
    })
    
    this.label = label
    this.pos = pos
    this.width = width
    this.height = 40
    this.bg = "#454545"
    this.hover = "#5F5F5F"
    this.menuPos = { x: this.pos.x + this.width * 0.3,
               y: this.pos.y + this.width / 2
             }
    this.menuWidth = 178
    this.menuHeight = 240
    this.level = 0
    this.toDrawMenu = false
    
    this.nullFunc = function() { }
    
    let p0 = { x:this.menuPos.x + 18, y: this.menuPos.y + 130 }
    this.tutorialButton = new Button("チュートリアル", p0, 144, this.nullFunc, showTutorial)
    
    let p1 = { x:this.menuPos.x + 18, y: this.menuPos.y + 180 }
    this.ansButton = new Button("答えを表示", p1, 144, showAns, this.nullFunc)
    this.isHovering = false
    
    this.hoverDiv = createDiv()
    this.hoverDiv.position(offsetX + this.pos.x + 20, offsetY + this.pos.y)
    this.hoverDiv.id("hinthover")
    
    popover = tippy('#hinthover', {
      content: "ヒントや答えを確認できます",
      animation: 'shift-away'
    })
    
  }
  
  showPopover() {
    console.log("show")
    console.log(popover)
    popover[0].show()
  }
  
  isOnButton() {
    let isOnButton = 
        mouseX >= this.pos.x && 
        mouseX <= this.pos.x + this.width && 
        mouseY >= this.pos.y && 
        mouseY <= this.pos.y + this.height
    return isOnButton
  }
  
  isOnMenu() {
    let isOnMenu = 
        mouseX >= this.menuPos.x && 
        mouseX <= this.menuPos.x + this.menuWidth && 
        mouseY >= this.menuPos.y && 
        mouseY <= this.menuPos.y + this.menuHeight
    return isOnMenu
  }
  
  hide() {
    noStroke()
    
    fill("#131415")
    rect(this.pos.x - 2, this.pos.y -2, this.width + 4, this.height + 4)
  }
  
  draw() {
    fill("#131415")
    rect(this.menuPos.x - 2, this.menuPos.y - 2, this.menuWidth + 4, this.menuHeight + 4)
    textFont('Helvetica', 16)
    textAlign(CENTER, CENTER)
    
    noStroke()
    fill(this.isOnButton() ? this.hover : this.bg)
    rect(this.pos.x, this.pos.y, this.width, this.height, 5)
    fill("#FFFFFF")
    if (this.icon) {
      image(this.icon, this.pos.x + 7.5, this.pos.y + 7.5, 25, 25)
    }
    //text(this.label, this.pos.x, this.pos.y + this.height*0.5, this.width)
    
    if (this.isOnButton() || this.isHovering) {
      this.isHovering = this.isOnMenu() || this.isOnButton()
      //this.drawMenu()
    }
  }
  
  drawMenu() {
    if (!this.isHovering) {
      return 
    }
    stroke("#8D8D8D")
    strokeWeight(1)
    fill("#2E2F30")
    rect(this.menuPos.x, this.menuPos.y, this.menuWidth, this.menuHeight, 5)
    
    fill("#FFFFFF")
    textFont('Helvetica', 16)
    textAlign(LEFT, TOP)
    text("ヒント", this.menuPos.x + 18,  this.menuPos.y + 20)
    
    fill("#939393")
    text(hintsText[this.level], this.menuPos.x + 18, this.menuPos.y + 45, 144, 144)
    this.tutorialButton.draw()
    this.ansButton.draw()
    
  }
  
  mouseClicked() {
    if (this.isHovering){
      this.tutorialButton.mouseClicked()
    }
  }
}

class MenuButton {
  constructor(label, pos, width) {
    this.label = label
    this.pos = pos
    this.width = width
    this.height = 40
    this.bg = "#454545"
    this.hover = "#5F5F5F"
    this.menuPos = { x: this.pos.x + this.width * 0.3,
               y: this.pos.y + this.width / 2
             }
    this.menuWidth = 174
    this.menuHeight = 190

    this.isHovering = false
    this.setupSelect()
    
    
    loadImage("icons/dots.png", res => {
      this.icon = res
    })
    
  }
  
  setupSelect() {
    photoTypeSelect = createSelect()
    photoTypeSelect.position(offsetX + this.menuPos.x + 10, offsetY + this.menuPos.y - 60) //45
    for (let i = 0; i < photoTypes.length; i++) {
      photoTypeSelect.option(photoTypes[i].label)
    }
    photoTypeSelect.selected(photoTypes[2].label)
    photoTypeSelect.changed(selectionChanged)
    photoTypeSelect.hide()
    
    
    levelSelect = createSelect()
    levelSelect.position(offsetX + this.menuPos.x + 10, offsetY + this.menuPos.y + 25)
    levelSelect.option("Level 1")
    levelSelect.option("Level 2")
    levelSelect.option("Level 3")
    levelSelect.option("Level 4")
    levelSelect.option("Level 5")
    levelSelect.selected("Level 1")
    levelSelect.changed(levelSelected)
    levelSelect.hide()
  }
  
  isOnButton() {
    let isOnButton = 
        mouseX >= this.pos.x && 
        mouseX <= this.pos.x + this.width && 
        mouseY >= this.pos.y && 
        mouseY <= this.pos.y + this.height
    return isOnButton
  }
  
  updateSelectPos() {
    photoTypeSelect.position(offsetX + this.menuPos.x + 18, offsetY + this.menuPos.y - 60)
    levelSelect.position(offsetX + this.menuPos.x + 18, offsetY + this.menuPos.y + 25)
  }
  
  isOnMenu() {
    let isOnMenu = 
        mouseX >= this.menuPos.x && 
        mouseX <= this.menuPos.x + this.menuWidth && 
        mouseY >= this.menuPos.y && 
        mouseY <= this.menuPos.y + this.menuHeight
    return isOnMenu
  }
  
  hide() {
    noStroke()
    
    fill("#131415")
    rect(this.pos.x - 2, this.pos.y -2, this.width + 4, this.height + 4)
  }
  
  draw() {
    fill("#131415")
    rect(this.menuPos.x - 2, this.menuPos.y - 2, this.menuWidth + 4, this.menuHeight + 4)
    textFont('Helvetica', 16)
    textAlign(CENTER, CENTER)
    
    noStroke()
    fill(this.isOnButton() ? this.hover : this.bg)
    rect(this.pos.x, this.pos.y, this.width, this.height, 5)
    fill("#FFFFFF")
    //text(this.label, this.pos.x, this.pos.y + this.height*0.5, this.width)
    if (this.icon) {
      image(this.icon, this.pos.x + 5, this.pos.y + 5, 30, 30)
    }
    if (this.isOnButton() || this.isHovering) {
      this.isHovering = this.isOnMenu() || this.isOnButton()
      this.drawMenu()
      photoTypeSelect.show()
      levelSelect.show()
    } else {
      photoTypeSelect.hide()
      levelSelect.hide()
    }
  }
  
  drawMenu() {
    if (!this.isHovering) {
      return 
    }
    stroke("#8D8D8D")
    strokeWeight(1)
    fill("#2E2F30")
    rect(this.menuPos.x, this.menuPos.y, this.menuWidth, this.menuHeight, 5)
    
    fill("#FFFFFF")
    textFont('Helvetica', 16)
    textAlign(LEFT, TOP)
    text("写真の種類", this.menuPos.x + 10,  this.menuPos.y + 20)
   
    text("レベルを選択", this.menuPos.x + 10,  this.menuPos.y + 105)
    
  }
}