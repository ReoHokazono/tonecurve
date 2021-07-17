class Ring {
  constructor(pos, width) {
    this.strokeWeight = 25
    this.pos = pos
    this.width = width
    this.xc = pos.x + width / 2
    this.yc = pos.y + width / 2
    this.val = 0
    this.sval = 0
    this.textVal = 0
    this.duration = 3
    this.e = new p5.Ease()
    this.ratio = 0
  }
  
  draw() {
    if (this.val <= 0) {
      this.val = 0.001
    }
    
    if (this.val >= 1) {
      this.val = 0.99
    }
    
    if (this.val != this.sval) {
      this.ratio += this.duration / frameRate()
      this.sval = this.sval + (this.val - this.sval) * this.e.exponentialInOut(this.ratio)
      
      if (this.e.exponentialInOut(this.ratio) >= 0.99) {
        this.ratio = 0
        this.sval = this.val
      }
      
    }
    //this.sval = this.val
    fill("#2E2F30")
    noStroke()
    circle(this.xc, this.yc, this.width + this.strokeWeight + 20)
    stroke("#0A84FF")
    noFill()
    strokeWeight(this.strokeWeight)
    strokeCap(ROUND)

    let rad = (this.sval + 0.01) * TWO_PI
    
    
    arc(this.xc, this.yc, this.width, this.width, -1 * HALF_PI, -1 * HALF_PI + rad)
    strokeWeight(1)
    //this.updateText()
  }
  
  updateText() {
    noStroke()
    fill("#FFFFFF")
    textFont('Helvetica', 40)
    textAlign(CENTER, CENTER)
    this.textVal = round(this.sval * 100)
    if (this.textVal == 99) {
      this.textVal = 100
    }
    text(this.textVal, this.xc, this.yc)
  }
  
}