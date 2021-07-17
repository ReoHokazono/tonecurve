class LevelBar {
  constructor(pos, width) {
    this.pos = pos
    this.width = width
    this.height = 20
    this.yc = this.pos.y + this.height / 2
    this.labelWidth = 50
    this.barsWidth = width - this.labelWidth
    this.levelCount = 5
    this.margin = 12
    this.barWidth = 
      this.barsWidth / this.levelCount - this.margin
    
    this.cl = 0
    this.cr = 0
    this.statuses = []
    for (let i = 0; i < this.levelCount; i++) {
      this.statuses[i] = [0, 0, 0]
    }
    this.statuses[this.cl][this.cr] = 1
    
    this.levels = []
    for(let i = 0; i < this.levelCount; i++) {
      let x = 
          this.pos.x + 
          this.labelWidth + 
          ( i + 1 ) * this.margin + 
          i *  this.barWidth
      let level = i + 1
      this.levels[i] = new Level(x, this.yc, this.barWidth, level, this.statuses[i])
    }
    
  }
  
  setLevel(level) {
    this.cl = level
    this.cr = 0
    for (let i = 0; i < this.levelCount; i++) {
      this.statuses[i] = [0, 0, 0]
    }
    
    for (let i = 0; i < level; i++) {
      this.statuses[i] = [2, 2, 2]
    }
    this.statuses[this.cl][this.cr] = 1
  }
  
  draw() {
    fill("#939393")
    textFont('Helvetica', 18)
    textAlign(LEFT, CENTER)
    text("Level", this.pos.x, this.yc)
    
    for(let i = 0; i < this.levels.length; i++) {
      this.levels[i].status = this.statuses[i]
      this.levels[i].draw()
    }
  }
  
  countup() {
    
    if (this.statuses[4][2] == 2) {
      return
    }
    this.statuses[this.cl][this.cr] = 2
    if( this.cr == 2 && this.cl != 4 ) {
      this.cr = 0
      this.cl += 1
    } else {
      this.cr += 1
    }
    this.statuses[this.cl][this.cr] = 1
  }
}

class Level {
  constructor(x, yc, width, level, status) {
    this.x = x
    this.width = width
    this.yc = yc
    this.level = level 
    this.status = status
    this.barsWidth = width * 0.8
    this.textWidth = width - this.barsWidth
    this.barWidth = this.barsWidth / this.status.length
    this.barHeight = 15
    this.corner = 6
    this.colors = ["#2E2F30" ,"#5B81A8", "#0A84FF"]
  }
  
  draw() {
    fill("#939393")
    textFont('Helvetica', 18)
    textAlign(RIGHT, CENTER)
    text(this.level, this.x, this.yc, this.textWidth)
    
    for(let i = 0; i < this.status.length; i++) {
      let x0 = this.x + this.textWidth + i * this.barWidth
      let y = this.yc - this.barHeight / 2
      noStroke()
      fill(this.colors[this.status[i]])
      if (i == 0) {
        rect(x0, y, this.barWidth - 0.5, this.barHeight, 6, 0, 0, 6)
      } else if (i == this.status.length - 1) {
        rect(x0 + 0.5, y, this.barWidth - 0.5, this.barHeight, 0, 6, 6, 0)
      } else {
        rect(x0 + 0.5, y, this.barWidth - 1, this.barHeight)
      }
      noFill()
    }
  }
}