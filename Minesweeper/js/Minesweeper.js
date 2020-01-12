function minesweeper(tr,td,mineNum){
  this.tr = tr;//行数
  this.td = td;//列数
  this.mineNum = mineNum;//地雷数
  this.squares = [];//存放每个格子的信息，例如是否时地雷，坐标多少，数字是多少
  this.tds = [];//存放所有td的dom
  this.surplusMine = mineNum;//剩余的地雷
  this.allRight = false;//游戏结果
  this.parent = document.querySelector(".game-zone");
  this.init();
}

minesweeper.prototype.init = function(){
  this.createMine();//随机创建地雷的坐标
  this.updatePromptValue();//根据地雷坐标更新周围的数字
  this.createGameZone();//绘制相对应的格子
}

minesweeper.prototype.createMine=function(){
  var n = 0;
  var square = new Array(this.tr*this.td)
  for (var i=0;i<square.length;i++){
    square[i]=i;
  }
  square.sort(function(){return 0.5-Math.random()});
  var mineLocation =  square.slice(0,this.mineNum);//根据地雷数目截取随机数打乱后的数组
  for (var i=0;i<this.tr;i++){
    this.squares[i]=[];
    for(var j=0;j<this.td;j++){
      if (mineLocation.indexOf(n++)!=-1){
        this.squares[i][j]={type:"mine",x:j,y:i};
      }else{
        this.squares[i][j]={type:"number",x:j,y:i,value:0};
      }
    }
  }
}

minesweeper.prototype.updatePromptValue=function(){
  for (var i=0;i<this.tr;i++){
    for (var j=0;j<this.td;j++){
      var target = this.squares[i][j]
      if(target.type=="mine"){
        /*
              x-1,y-1        x,y-1      x+1,y-1
              x-1,y          x,y        x+1,y
              x-1,y+1        x,y+1      x+1,y+1
        */
       for(var x=target.x-1;x<=target.x+1;x++){
        for(var y=target.y-1;y<=target.y+1;y++){
          if(
            x<0||//不能超出游戏区域左边
            y<0||//不能超出游戏区域上边
            x>this.td-1||//不能超出游戏区域右边
            y>this.tr-1||//不能超出游戏区域下边
            (x==target.x && y==target.y)||//不能等于自己
            this.squares[y][x].type=="mine"//选中的格子不能是地雷
          ){
            continue;
          }
          this.squares[y][x].value+=1;//把条件以外的格子本身的数字+1
        }
       }
      }
    }
  }




}

minesweeper.prototype.createGameZone = function(){
  var This = this;//用This保存本身的this
  var table = document.createElement("table");
  for (var i=0;i<this.tr;i++){
    var domTr = document.createElement("tr");
    this.tds[i]=[];
    for(var j=0;j<this.td;j++){
      var domTd = document.createElement("td")
      domTd.pos=[i,j]//存取每个td的行列数
      domTd.onmousedown = function(){
        This.play(event,this);
      }//This为外部this，this为domTd调用onmousedown时自身的this
      if(this.squares[i][j].type=="mine"){
        domTd.className="mine";//如果是地雷，把该td加上mine的样式
      }
      if(this.squares[i][j].type=="number"){
        domTd.innerHTML=this.squares[i][j].value;
      }
      this.tds[i][j]=domTd;
      domTr.appendChild(domTd);//把生成的Td加入到Tr中
    }
    table.appendChild(domTr);//把全部生成的Tr加入Table中
  }
  this.parent.oncontextmenu=function(){
    return false;
  }//取消鼠标右键菜单
  this.parent.appendChild(table);//把Table加入Tgame-zone中
}

minesweeper.prototype.play = function(ev,obj){
  if(ev.which==1){
    console.log(obj);
  }
}

var test = new minesweeper(28,28,99);