const domWrapper = document.querySelectorAll(".wrapper")[0];
const domWrapperStyle = getComputedStyle(domWrapper);
const domWrapperWidth = parseFloat(domWrapperStyle.width);
const domWrapperHeight = parseFloat(domWrapperStyle.height);

const domPipes = document.querySelector(".wrapper #pipes");

class Pipe extends Rect{
  constructor(height,top,xSpeed,dom){
    super(52,height,domWrapperWidth,top,xSpeed,0,dom)
  }
  reset(){
    if(this.left < -this.width){
      this.dom.remove();
    }//当柱子移动出画面后，删除相对应柱子的dom
  }
}


function getRandom(min,max){
  return Math.floor(Math.random() * (max - min) + min);
}


class PipesPair{
  constructor(speed){

    //wrapper的高度 - land的高度 = 上柱子的高度 + 中间间隔 + 下柱子的高度

    this.spaceHeight = domWrapperHeight * 0.3; //上下柱子的中间间隔
    this.minHeight = domWrapperHeight * 0.15; //柱子最小的高度
    this.maxHeight = domWrapperHeight - domLandHeight - this.spaceHeight - this.minHeight; //柱子的最大间隔

    this.upHeight = getRandom(this.minHeight,this.maxHeight);
    this.domPipeUp = document.createElement("div");
    this.domPipeUp.className = "pipe-up";
    this.pipeUp = new Pipe(this.upHeight,0,speed,this.domPipeUp);

    this.downHeight = domWrapperHeight - domLandHeight - this.spaceHeight - this.upHeight;
    this.downTop = this.spaceHeight + this.upHeight;
    this.domPipeDown = document.createElement("div");
    this.domPipeDown.className = "pipe-down";
    this.pipeDown = new Pipe(this.downHeight,this.downTop,speed,this.domPipeDown);

    domPipes.appendChild(this.domPipeUp);
    domPipes.appendChild(this.domPipeDown);

  }

  get deleteFlag(){
    return this.pipeUp.left < -this.pipeUp.width; //判断柱子是否移动出画面
  }

  move(time){
    this.pipeUp.move(time);
    this.pipeDown.move(time);
  }
}

//柱子总是成对出现，批量生成
class PipesPairCreator{
  constructor(delay,speed){
    this.creatorTimer = null;
    this.createDelay = delay; //两对柱子间生成的间隔
    this.speed = speed;
    this.listPairs = [];
  }

  startCreate(){
    if(this.creatorTimer){
      return;
    }
    this.creatorTimer = setInterval(()=>{
      this.listPairs.push(new PipesPair(this.speed));
      for(let i=0 ; i<this.listPairs.length;i++){
        if(this.listPairs[i].deleteFlag){
          this.listPairs.splice(i,1); //柱子移动出画面后，删除相对应的柱子数据
          i--;
        }
      }
    },this.createDelay)
  }

  stopCreate(){
    clearInterval(this.creatorTimer);
    this.creatorTimer = null;
  }
}