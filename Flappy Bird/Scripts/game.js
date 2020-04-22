class Game {
  constructor() {
    this.speed = -20; //每次向左运动的像素距离
    this.time = 30 / 1000; //Interval的间隔时间
    this.sky = new Sky(this.speed);
    this.land = new Land(this.speed);
    this.pipesPair = new PipesPairCreator(1500, this.speed);
    this.bird = new Bird();
    this.timer = null;
    this.gameOver = false; //game over的flag
    this.regEvent();
  }


  isHit(rect1, rect2) {
    let rectX1 = rect1.left + rect1.width / 2; //第一个矩形的x中心点
    let rectY1 = rect1.top + rect1.height / 2; //第一个矩形的y中心点
    let rectX2 = rect2.left + rect2.width / 2; //第二个矩形的x中心点
    let rectY2 = rect2.top + rect2.height / 2; //第二个矩形的y中心点
    let disX = Math.abs(rectX1 - rectX2); //取得两个x中心点的距离绝对值
    let disY = Math.abs(rectY1 - rectY2); //取得两个y中心点的距离绝对值
    if (disX <= (rect1.width + rect2.width) / 2 && disY <= (rect1.height + rect2.height) / 2) {
      return true;
    }
    return false;
  }

  isGameOver() {
    if (this.bird.top >= this.bird.maxTop) {
      this.gameOver = true;
    }
    for (let i = 0; i < this.pipesPair.listPairs.length; i++) {
      const pipeUp = this.pipesPair.listPairs[i].pipeUp;
      const pipeDown = this.pipesPair.listPairs[i].pipeDown;
      if (this.isHit(pipeUp, this.bird) || this.isHit(pipeDown, this.bird)) {
        this.gameOver = true;
      }
    }
    return this.gameOver;
  }

  startGame() {
    if (this.timer) {
      return;
    }
    if (this.gameOver) {
      window.location.reload();//如果game over了就刷新页面重制游戏

    }
    this.pipesPair.startCreate();
    this.timer = setInterval(() => {
      this.sky.move(this.time);
      this.land.move(this.time);
      this.pipesPair.listPairs.forEach(pair => {
        pair.move(this.time);
      });
      this.bird.startSwinging();
      this.bird.move(this.time);
      if (this.isGameOver()) {
        this.stopGame();
      }
    }, this.time);
  }

  stopGame() {
    this.pipesPair.stopCreate();
    this.bird.stopSwinging();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  regEvent() {
    window.onkeydown = ev => {
      if (ev.key === "Enter") {
        if (this.timer) {
          this.stopGame();
        } else {
          this.startGame();
        }
      }
    }
    domWrapper.addEventListener("click", () => {
      this.bird.jump();
    })
  }
}


const g = new Game();
