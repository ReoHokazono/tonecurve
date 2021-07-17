class LutUtil {
  static averageLuts(a, b) {
    let luts = []
    for (let i = 0; i < a.length; i++) {
      luts[i] = LutUtil.averageLut(a[i], b[i])
    }
    return luts
  }
  
  static averageLut(a, b) {
    let ave = []
    for ( let i = 0; i < 256; i++) {
      ave [i] =  round(0.5*(a[i] + b[i]))
    }
    return ave
  }
  
  static createLuts(pointsArray) {
    let luts = []
    for (let i = 0; i < pointsArray.length; i++) {
      luts[i] = LutUtil.createLut(pointsArray[i])
    }
    return luts
  }
  
  static createInvLuts(luts) {
    let invLuts = []
    for(let i = 0; i < luts.length; i++) {
      invLuts[i] = LutUtil.createInvLut(luts[i])
    }
    return invLuts
  }
  
  static createInvLut(lut) {
    let inv = []
    for ( let i = 0; i < 256; i++) {
      inv [i] = i*2 - lut[i]
    }
    return inv
  }
  
  static createDefaultLut() {
    let lut = []
    for ( let i = 0; i < 256; i++) {
      lut [i] = i
    }
    return lut
  }
  
  static createDefaultLuts() {
    return [LutUtil.createDefaultLut(),
            LutUtil.createDefaultLut(),
            LutUtil.createDefaultLut(),
            LutUtil.createDefaultLut()
           ]
  }
  
  static createLut(points) {
    let first = points[0]
    let last = points[points.length - 1]
    let n1 = round(first.x) + 1
    let lut = new Array(256)
    for (let i = 0; i < n1; i++) {
      lut[i] = round(first.y)
    }
    
    if (points.length == 2) {
      let n2 = round(last.x) - round(first.x) - 1
      let a = (last.y - first.y) / (last.x - first.x)
      for (let i = 0; i < n2; i++) {
        let index = round(first.x) + 1 + i
        lut[index] = round(a*(index - first.x) + first.y)
      }
    } else {
      let xs = []
      let ys = []
      for (let i = 0; i < points.length; i++) {
        xs[i] = points[i].x
        ys[i] = points[i].y
      }
      const spline = new Spline(xs, ys)
      const n2 = xs[xs.length - 1] - xs[0] - 1
      for (let i = 0; i < n2; i++) {
        let x0 = xs[0] + i
        let x1 = xs[0] + i + 1
        let y0 = limitNum(spline.at(x0), 255, 0)
        let y1 = limitNum(spline.at(x1), 255, 0)
        lut[round(x1)] = round(y1)
      }
    }
    
    let n3 = 255 - round(last.x) + 1 
    for (let i = 0; i < n3; i++) {
      lut[i + round(last.x)] = round(last.y)
    }
    
    return lut
  }
  
  static compare(a, b) {
    let sum = 0
    
    let a1 = [[], [], [], []]
    let b1 = [[], [], [], []]
    let diff = []
    for (let i = 0; i < 256; i++) {
      a1[0][i] = a[0][i] - i
      a1[1][i] = a[1][i] - i
      a1[2][i] = a[2][i] - i
      a1[3][i] = a[3][i] - i
      
      b1[0][i] = b[0][i] - i
      b1[1][i] = b[1][i] - i
      b1[2][i] = b[2][i] - i
      b1[3][i] = b[3][i] - i
    }
    
    for (let i = 0; i < 256; i++) {
      sum += abs(a[0][i] - b[0][i])
      sum += abs(a[1][i] - b[1][i])
      sum += abs(a[2][i] - b[2][i])
      sum += abs(a[3][i] - b[3][i])
    }    
    //console.log(1 - sum / (256 * 4 * 255))
  }
}