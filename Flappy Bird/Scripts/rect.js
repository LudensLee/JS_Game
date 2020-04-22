class Rect{
  constructor(width,height,left,top,Xspeed,Yspeed,dom){
    this.width = width;
    this.height = height;
    this.Xspeed = Xspeed;
    this.Yspeed = Yspeed;
    this.left = left;
    this.top = top;
    this.dom = dom;
    this.render();
  }
  render(){
    this.dom.style.width = `${this.width}px`;
    this.dom.style.height = `${this.height}px`;
    this.dom.style.left = `${this.left}px`;
    this.dom.style.top = `${this.top}px`;
  }

  move(time){
    const xDis = this.Xspeed * time;
    const yDis = this.Yspeed * time;
    this.left = this.left + xDis;
    this.top = this.top + yDis;
    if(this.reset){
      this.reset();
    }
    this.render();
  }
}