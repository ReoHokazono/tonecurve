const PointsType = {
  doubleCurve: Symbol(),
  invDoubleCurve: Symbol(), 
  singleCurve: Symbol(), 
  dark: Symbol(), 
  light: Symbol(),
  darkLight: Symbol()
}

class PointsMaker {
  constructor() {
    this.linePoints = [{x: 0, y: 0}, {x: 255, y:255}]
    this.allPointsType = [
      PointsType.doubleCurve, 
      PointsType.invDoubleCurve, 
      PointsType.singleCurve, 
      PointsType.dark, 
      PointsType.light, 
      PointsType.darkLight
    ]
    
    this.firstPointsType = [
      PointsType.doubleCurve, 
      PointsType.invDoubleCurve, 
      //PointsType.singleCurve, 
    ]
    
    this.secondPointsType = [
      PointsType.dark, 
      PointsType.light, 
      PointsType.darkLight
    ]
  }
  
  static createInvPoints(pointsArray) {
    let invPoints = []
    for (let i = 0; i < pointsArray.length; i++) {
      let inv = []
      for (let j = 0; j < pointsArray[i].length; j++) {
        inv[j] = { 
          x: pointsArray[i][j].y,
          y: pointsArray[i][j].x
        }
      }
      invPoints[i] = inv
    }
    return invPoints
  }
  
  randomPoints(level) {
    switch (level) {
      // level 0 ---------
      case 0:
        let c0 = this.generatePoints(true, true)
        let c1 = this.linePoints
        return [c0, c1, c1, c1]
       // level 1 ---------
      case 1:
        let c2 = this.generatePoints(true, false)
        let c3 = this.linePoints
        return [c2, c3, c3, c3]
       // level 2 ---------
      case 2:
        let c4 = this.generatePoints(true, false)
        
        let idx0 = random([1, 2, 3])
        let c5 = idx0 == 1 ? 
            this.generatePoints(true, true) : this.linePoints
        let c6 = idx0 == 2 ? 
            this.generatePoints(true, true) : this.linePoints
        let c7 = idx0 == 3 ? 
            this.generatePoints(true, true) : this.linePoints
        return [c4, c5, c6, c7]
      // level 3 ---------
      case 3:
        let c8 = this.generatePoints(true, false)
        
        let idx1 = random([1, 2, 3])
        let c9 = idx1 == 1 ? 
            this.linePoints : this.generatePoints(true, true)
        let c10 = idx1 == 2 ? 
            this.linePoints : this.generatePoints(true, true)
        let c11 = idx1 == 3 ? 
            this.linePoints : this.generatePoints(true, true)
        return [c8, c9, c10, c11]
      case 4:
        let c12 = this.generatePoints(true, false)
        
        let idx2 = random([1, 2, 3])
        let c13 = idx2 == 1 ? 
            this.generatePoints(true, false) : this.linePoints
        let c14 = idx2 == 2 ? 
            this.generatePoints(true, false) : this.linePoints
        let c15 = idx2 == 3 ? 
            this.generatePoints(true, false) : this.linePoints
        return [c12, c13, c14, c15]
    }
  }
  
  generatePoints(isSingleElement, isOnePoint) {
    
    if ( isOnePoint ) {
      let c = this.singleCurvePoint()
          return [{x: 0, y: 0}, c, {x: 255, y: 255}]
    }
    if (isSingleElement) {
      let pointsType = random(this.firstPointsType)
      switch (pointsType) {
        case PointsType.doubleCurve:
          let c0 = this.doubleCurvePoints(false)
          return [
            {x: 0, y: 0}, c0[0], c0[1], {x: 255, y: 255}
          ]
        case PointsType.invDoubleCurve:
          let c1 = this.doubleCurvePoints(true)
          return [
            {x: 0, y: 0}, c1[0], c1[1], {x: 255, y: 255}
          ]
        case PointsType.singleCurve:
          let c2 = this.singleCurvePoint()
          return [{x: 0, y: 0}, c2, {x: 255, y: 255}]
        case PointsType.dark:
          return this.cornerPoints(PointsType.dark)
        case PointsType.light:
          return this.cornerPoints(PointsType.light)
        case PointsType.darkLight:
          return this.cornerPoints(PointsType.darkLight)
      }
    } else {
      let first = random(this.firstPointsType)
      let second = random(this.secondPointsType)
          
      let points = this.cornerPoints(second)
      
      switch (first) {
        case PointsType.doubleCurve:
          let c0 = this.doubleCurvePoints(false)
          return [points[0], c0[0], c0[1], points[1]]
        case PointsType.invDoubleCurve:
          let c1 = this.doubleCurvePoints(true)
          return [points[0], c1[0], c1[1], points[1]]
        case PointsType.singleCurve:
          let c2 = this.singleCurvePoint()
          return [points[0], c2, points[1]]
      }
    }
  }
  
  doubleCurvePoints(isInv) {
    let d1 = 63
    let d2 = 191
    let a1 = isInv ? random(PI * 5 / 4, PI * 9 / 4) : random(PI / 4, PI * 5 / 4)
    let r1 = random(15, 45)
    
    let x1 = round(d1 + r1*cos(a1))
    let y1 = round(d1 + r1*sin(a1))
    let p1 = { x: x1, y: y1 }
    
    let a2 = isInv ? random(PI / 4, PI * 5 / 4) : random(PI * 5 / 4, PI * 9 / 4)
    let r2 = random(15, 45)
    
    let x2 = round(d2 + r2*cos(a2))
    let y2 = round(d2 + r2*sin(a2))
    let p2 = { x: x2, y: y2 }
    
    return [p1, p2]
  }
  
  singleCurvePoint() {
    let a = random(
      [random(PI / 2, PI), random(PI * 3 / 2, TWO_PI)]
    )
    let r = random(30, 60)
    let d = 127
    let x = round(d + r*cos(a))
    let y = round(d + r*sin(a)) 
    return { x: x, y: y }
  }

  cornerPoint(isDark) {
    let v1 = round(random(0, 60))
    let v2 = round(random(20, 60))
    let randBool = random([true, false])
    let x = randBool ? v1 : v2
    let y = randBool ? v2 : v1
    if (isDark) {
      return { x: x, y: y}
    } else {
      return { x: 255 - x, y:255 - y }
    }
  }
  
  cornerPoints(pointsType) {
    switch (pointsType) {
      case PointsType.dark:
        let light = { x: 255, y:255 }
        return [this.cornerPoint(true), light]
      case PointsType.light:
        let dark = { x: 0, y: 0 }
        return [dark, this.cornerPoint(false)]
      case PointsType.darkLight:
        return  [this.cornerPoint(true), this.cornerPoint(false)]
    }
  }
}