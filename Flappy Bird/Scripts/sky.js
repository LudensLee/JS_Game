const domSky = document.querySelector(".wrapper #sky");
const domSkyStyle = getComputedStyle(domSky);
const domSkyWidth = parseFloat(domSkyStyle.width);
const domSkyHeight = parseFloat(domSkyStyle.height);

class Sky extends Rect{
  constructor(speed){
    super(domSkyWidth,domSkyHeight,0,0,speed,0,domSky);
  }
  reset(){
     if(Math.abs(this.left) >= domSkyWidth/2){
       this.left = 0;
     } //当sky的left过一半时重制为0，避免背景无bg覆盖
   }
}


