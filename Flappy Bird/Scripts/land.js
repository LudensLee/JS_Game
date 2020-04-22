const domLand = document.querySelector(".wrapper #land");
const domLandStyle = getComputedStyle(domLand);
const domLandWidth = parseFloat(domLandStyle.width);
const domLandHeight = parseFloat(domLandStyle.height);
const domLandTop = parseFloat(domLandStyle.top);


class Land extends Rect{
  constructor(speed){
    super(domLandWidth,domLandHeight,0,domLandTop,speed,0,domLand);
  }
  reset(){
    if(Math.abs(this.left) >= domLandWidth/2){
      this.left = 0;
    }//当land的left过一半时重制为0，避免背景无bg覆盖
  }
}