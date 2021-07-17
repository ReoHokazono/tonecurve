class LutCompare {
  constructor() {
    this.fix = 1.15
    this.init = 0
  }
  
  reset() {
    this.init = 0
  }
  
  calcInit(a) {
    let sum = 0
    let b = LutUtil.createDefaultLuts()
    for (let i = 0; i < 256; i++) {
      sum += abs(a[0][i] - b[0][i])
      sum += abs(a[1][i] - b[1][i])
      sum += abs(a[2][i] - b[2][i])
      sum += abs(a[3][i] - b[3][i])
    }
    
    this.init = 1 - sum / (256 * 4 * 255)
  }
  
  compare(a, b) {
    let sum = 0

    
    for (let i = 0; i < 256; i++) {
      sum += abs(a[0][i] - b[0][i])
      sum += abs(a[1][i] - b[1][i])
      sum += abs(a[2][i] - b[2][i])
      sum += abs(a[3][i] - b[3][i])
    }    
    let v = 1 - sum / (256 * 4 * 255)
    let sim = 0.3 + 0.7*this.fix*(v - this.init) / (1 - this.init)
    //return sim
    return sim > 0.9 ? 1 : sim
  }
}