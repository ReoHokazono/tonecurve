function limitPoint(point, max, min) {
  return { x: limitNum(point.x, max.x, min.x), y: limitNum(point.y, max.y, min.y) }
}

function limitNum(n, max, min) {
  return Math.min(Math.max(n, min), max)
}

function createDefaultLut() {
  let lut = []
  for ( let i = 0; i < 256; i++) {
    lut [i] = i
  }
  return lut
}

class Util {
  constructor(pos, size){
    this.pos = pos
    this.size = size
  }
  
  toMain(point) {
    let mx = this.pos.x + point.x / 255 * this.size
    let my = this.pos.y + this.size*(1 - point.y/255)
    return { x: mx, y: my }
  }
  
  toLocal(point) {
    let lx = (255 / this.size) * (point.x - this.pos.x)
    let ly = (255 / this.size) * (this.pos.y + this.size - point.y)
    return { x: lx, y: ly }
  }
}
  
class ToneCurve {
  constructor(pos, size) {
    this.isHidden = false
    this.pos = pos
    this.size = size
    this.controlPoints = [
      new ControlPoint({x: 0, y: 0}, this.pos, this.size),
      new ControlPoint({x: 255, y: 255}, this.pos, this.size)
    ]
    
    this.controlLine = new ControlLine(this.pos, this.size, this.controlPoints)
    this.util = new Util(this.pos, this.size)
    this.isControlPointDragging = false
  }
  
  reset() {
    this.controlPoints = [
      new ControlPoint({x: 0, y: 0}, this.pos, this.size),
      new ControlPoint({x: 255, y: 255}, this.pos, this.size)
    ]
    this.controlLine = new ControlLine(this.pos, this.size, this.controlPoints)
  }
  
  draw() {
    if (this.isHidden) {
      return
    }
    this.controlLine.draw()
    this.controlLine.update()

    for(let i = 0; i < this.controlPoints.length; i++) {
      if ( i > 0 ) {
        this.controlPoints[i].xMinLimit = this.controlPoints[i - 1].center.x + 4
      }
    
      if ( i < this.controlPoints.length - 1) {
        this.controlPoints[i].xMaxLimit = this.controlPoints[i + 1].center.x - 4
      }
      this.controlPoints[i].draw()
      this.controlPoints[i].update()
    }
  }
  
  drawBg() {
    noStroke()
    fill("#454545")
    square(this.pos.x, this.pos.y, this.size, 3)
    noFill()
    stroke("#000000")
  }
  
  keyPressed() {
    if (this.isHidden) {
      return
    }
    if (keyCode == "8") {
      for(let i = 0; i < this.controlPoints.length; i++) {
        let controlPoint = this.controlPoints[i]
        if (controlPoint.isSelected && i != 0 && i!= this.controlPoints.length - 1) {
          this.controlPoints.splice(i, 1)
        }
      }
    }
  }
  
  mouseReleased() {
    if (this.isHidden) {
      return
    }
      
    this.isControlPointDragging  = false
  }
  
  mouseDragged() {
    if (this.isHidden) {
      return
    }
      
    for(let i = 0; i < this.controlPoints.length; i++) {
      let controlPoint = this.controlPoints[i]
      controlPoint.isSelected = false
    }
  
    for(let i = 0; i < this.controlPoints.length; i++) {
      let controlPoint = this.controlPoints[i]
      if (controlPoint.isHovering) {
        controlPoint.isSelected = true
        this.isControlPointDragging = true
        break
      }
    }
  }
    
  mousePressed() {
    if (this.isHidden) {
      return
    }
      
    for(let i = 0; i < this.controlPoints.length; i++) {
      let controlPoint = this.controlPoints[i]
      controlPoint.isSelected = false
    }
  
    for(let i = 0; i < this.controlPoints.length; i++) {
      let controlPoint = this.controlPoints[i]
      if (controlPoint.isHovering) {
        controlPoint.isSelected = true
        this.isControlPointDragging = true
        break
      }
    }  
  
    if (!this.isControlPointDragging && this.controlLine.isOnMidLine) {
      this.addControlPoint()
    }
  }
  
  drawLutLine(lut, color) {
    if (this.isHidden) {
      return
    }
    for(let i = 0; i < lut.length - 1; i++) {
      
      stroke(color)
      let p0 = { x: i, y: lut[i] }
      let p1 = { x: i+1, y: lut[i+1] }
      let mp0 = this.util.toMain(p0)
      let mp1 = this.util.toMain(p1)
      line(mp0.x, mp0.y, mp1.x, mp1.y)
      
    }
    stroke("#000000")
  }
    
  drawAnsLine(luts, isRgb) {
    if (this.isHidden) {
      return
    } 
  }
    
  drawAnsPoints(points) {
    fill("#8E8E93")
    noStroke()
    if (this.isHidden) {
      return
    }
    for( let i = 0; i < points.length; i++) {
      let m0 = this.util.toMain(points[i])
      circle(m0.x, m0.y, 8)
    }
  }
    
  addControlPoint() {
    this.localMouse = this.util.toLocal({ x:mouseX, y: mouseY })
    for (let i = 0; i < this.controlPoints.length - 1; i++) {
      let x0 = this.controlPoints[i].center.x
      let x1 = this.controlPoints[i+1].center.x
      let currentX = this.localMouse.x
      let newPoint = new ControlPoint(this.localMouse, this.pos, this.size)
      if (currentX > x0 && currentX < x1) {
        this.controlPoints.splice(i+1, 0, newPoint)
      }
    }
  }
  
}

class ControlLine {
  constructor(pos, size, controlPoints) {
    this.lut = createDefaultLut()
    this.top = new Array(256)
    this.bottom = new Array(256)
    this.padding = 8
    this.util = new Util(pos, size)
    this.controlPoints = controlPoints
  }
  
  draw() {
    if (this.controlPoints.length == 2) {
      this.drawMidLine()
    } else {
      this.drawMidCurve()
    }
    
    this.drawDarkLine()
    this.drawLightLine()
    //this.drawLut()
  }

  update() {
    this.localMouse = this.util.toLocal({ x:mouseX, y: mouseY })
    let isOnDarkLine = 
        this.localMouse.x >= 0 && 
        this.localMouse.x <= this.controlPoints[0].center.x && 
        this.localMouse.y >= this.controlPoints[0].center.y - this.padding && 
        this.localMouse.y <= this.controlPoints[0].center.y + this.padding
    if ((isOnDarkLine && mouseIsPressed) || this.isDarkLineDragging && mouseIsPressed) {
      this.controlPoints[0].center.y = this.localMouse.y
      this.isDarkLineDragging = true
    } else {
      this.isDarkLineDragging = false
    }

    let last =this.controlPoints.length - 1
    let isOnLightLine = 
        this.localMouse.x >= this.controlPoints[last].center.x && 
        this.localMouse.x <= 255 && 
        this.localMouse.y >= this.controlPoints[last].center.y - this.padding && 
        this.localMouse.y <= this.controlPoints[last].center.y + this.padding
    if ((isOnLightLine && mouseIsPressed) || this.isLightLineDragging && mouseIsPressed) {
      this.controlPoints[last].center.y = this.localMouse.y
      this.isLightLineDragging = true
    } else {
      this.isLightLineDragging = false
    }
    if (this.localMouse.x >= 0 && this.localMouse.x <= 255) {
      let y = this.lut[round(this.localMouse.x)]
    this.isOnMidLine = 
        this.localMouse.x > this.controlPoints[0].center.x &&
        this.localMouse.x < this.controlPoints[last].center.x && 
        this.localMouse.y >= y - this.padding &&
        this.localMouse.y <= y + this.padding
    }   
  }
  
  drawLut() {
    for(let i = 0; i < this.lut.length; i++) {
      let p0 = { x: i, y: this.lut[i] }
      let p1 = { x: i, y: 0 }
      let mp0 = this.util.toMain(p0)
      let mp1 = this.util.toMain(p1)
      line(mp0.x, mp0.y, mp1.x, mp1.y)
    }
  }
  
  drawDarkLine() {
    let p0 = { x: 0, y: this.controlPoints[0].center.y }
    let p1 =  this.controlPoints[0].center
    let mp0 = this.util.toMain(p0)
    let mp1 = this.util.toMain(p1)
    line(mp0.x, mp0.y, mp1.x, mp1.y)
    
    let points = round(p1.x) + 1
    for (let i = 0; i < points; i++) {
      this.lut[i] = round(this.controlPoints[0].center.y)
    }
  }
  
  drawLightLine() {
    let last = this.controlPoints.length - 1 
    let p0 = { x: 255, y: this.controlPoints[last].center.y }
    let p1 =  this.controlPoints[last].center
    let mp0 = this.util.toMain(p0)
    let mp1 = this.util.toMain(p1)
    line(mp0.x, mp0.y, mp1.x, mp1.y)
    let points = 255 - round(p1.x) + 1 
    for (let i = 0; i < points; i++) {
      this.lut[i + round(p1.x)] = round(this.controlPoints[last].center.y)
    }
  }
  
  drawMidLine() {
    let p0 =  this.controlPoints[0].center
    let p1 =  this.controlPoints[1].center
    let mp0 = this.util.toMain(p0)
    let mp1 = this.util.toMain(p1)
    line(mp0.x, mp0.y, mp1.x, mp1.y)
    
    let points = round(p1.x) - round(p0.x) - 1
    let a = (p1.y - p0.y) / (p1.x - p0.x)
    for (let i = 0; i < points; i++) {
      let index = round(p0.x) + 1 + i
      this.lut[index] = round(a*(index - p0.x) + p0.y)
    }
  }
  
  drawMidCurve() {
    let xs = []
    let ys = []
    for (let i = 0; i < this.controlPoints.length; i++) {
      let d = this.controlPoints[i].center
      xs[i] = d.x
      ys[i] = d.y
    }
    const spline = new Spline(xs, ys)
    const points = xs[xs.length - 1] - xs[0] - 1
    for (let i = 0; i < points; i++) {
      let x0 = xs[0] + i
      let x1 = xs[0] + i + 1
      let y0 = limitNum(spline.at(x0), 255, 0)
      let y1 = limitNum(spline.at(x1), 255, 0)
      let m0 = this.util.toMain({ x:x0, y:y0 })
      let m1 = this.util.toMain({ x:x1, y:y1 })
      line(m0.x, m0.y, m1.x, m1.y)
      this.lut[round(x1)] = round(y1)
    }
  }
}

class ControlPoint {
  constructor(point, pos, s) {
    this.center = point
    this.size = 8
    this.padding = 4
    this.isDragging = false
    this.isHovering = false
    this.xMaxLimit = 255
    this.xMinLimit = 0
    
    this.max = { x: this.xMaxLimit, y: 255}
    this.min = { x: this.xMinLimit, y: 0}
    this.isSelected = false
    this.util = new Util(pos, s)
  }
  
  draw() {
    
    this.center = limitPoint(this.center, this.max, this.min)
    this.mainCenter = this.util.toMain(this.center)
    
    if (this.isSelected) {
      fill(20)
    } else {
      noFill()
    }
    square(this.mainCenter.x - this.size / 2, this.mainCenter.y - this.size / 2, this.size, 2)
    
  }
  
  update() {
    this.maxX = this.center.x + this.size / 2 + this.padding
    this.minX = this.center.x - this.size / 2 - this.padding
    
    this.maxY = this.center.y + this.size / 2 + this.padding
    this.minY = this.center.y - this.size / 2 - this.padding
    
    this.localMouse = this.util.toLocal({ x:mouseX, y: mouseY })
    this.isHovering = 
      this.localMouse.x <= this.maxX && 
      this.localMouse.x >= this.minX && 
      this.localMouse.y <= this.maxY && 
      this.localMouse.y >= this.minY
    
    this.max = { x: this.xMaxLimit, y: 255}
    this.min = { x: this.xMinLimit, y: 0}
    
    this.isClicked = mouseX == pmouseX && mouseY == pmouseY

    
    if ((this.isHovering && mouseIsPressed) || 
       (this.isDragging && mouseIsPressed)) {
      this.center = limitPoint(this.localMouse, this.max, this.min)
      this.isDragging = true
    } else {
      this.isDragging = false
    }
  }
}