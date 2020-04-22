const domBird = document.querySelector(".wrapper #bird");
const domBirdStyle = getComputedStyle(domBird);
const domBirdWidth = parseFloat(domBirdStyle.width);
const domBirdHeight = parseFloat(domBirdStyle.height);
const domBirdLeft = parseFloat(domBirdStyle.left);
const domBirdTop = parseFloat(domBirdStyle.top);



class Bird extends Rect{
  constructor(){
    super(domBirdWidth,domBirdHeight,domBirdLeft,domBirdTop,0,0,domBird);
    this.swingMode = 0;
    this.swingTimer = null;
    this.g = 0.5; //小鸟掉落的像素，模拟重力速度
    this.maxTop = domWrapperHeight - domLandHeight - domBirdHeight;
  }

  jump(){
    this.Yspeed = -50;
  }

  move(time){
    this.Yspeed += this.g; //模拟因重力下降
    super.move(time);

  }
  render(){
    if(this.top >= (this.maxTop)){
      this.top = (this.maxTop);
    }
    else if(this.top<=0){
      this.top = 0;
    } //限定小鸟的活动范围
    super.render();
  }

  startSwinging(){
    if(this.swingTimer){
      return;
    }
    this.swingTimer = setInterval(()=>{
      this.swingMode++;
      this.dom.className = `swing${this.swingMode % 3}`;
    },400); //每隔400ms，改变一次小鸟的翅膀位置
  }
  stopSwinging(){
    clearInterval(this.swingTimer);
    this.swingTimer = null;
  }
}