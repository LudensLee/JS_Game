//write by ludens
function minesweeper(tr,td,mineNum){
  this.tr = tr;//行数
  this.td = td;//列数
  this.mineNum = mineNum;//地雷数
  this.squares = [];//存放每个格子的信息，例如是否时地雷，坐标多少，数字是多少
  this.tds = [];//存放所有td的dom
  this.surplusMine = mineNum;//剩余的地雷
  this.allRight = false;//游戏结果
  this.parent = document.querySelector(".game-zone");
  this.mineNumDom = document.querySelector(".mine-num");
  this.mineNumDom.innerHTML= this.surplusMine;
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
        this.squares[i][j]={type:"mine",x:j,y:i,flag:false};
      }else{
        this.squares[i][j]={type:"number",x:j,y:i,flag:false,value:0};
      }
    }
  }
}

minesweeper.prototype.returnAroundLocal=function(target){
  var arrayAroundLocal = [];
  var target = target;
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
      arrayAroundLocal.push([y,x]);//将周围格子的坐标存储起来
    }
  }
  return arrayAroundLocal;
}

minesweeper.prototype.updatePromptValue=function(){
  var arrayAroundLocal = [];
  for (var i=0;i<this.tr;i++){
    for (var j=0;j<this.td;j++){
      var target = this.squares[i][j]
      if(target.type=="mine"){
       arrayAroundLocal = this.returnAroundLocal(target);
        for (var k = 0;k<arrayAroundLocal.length;k++){
          this.squares[arrayAroundLocal[k][0]][arrayAroundLocal[k][1]].value+=1;//把条件以外的格子本身的数字+1
        }}}}
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
      this.tds[i][j]=domTd;//把生成的每个domtd通过行列存起来
      domTr.appendChild(domTd);//把生成的Td加入到Tr中
    }
    table.appendChild(domTr);//把全部生成的Tr加入Table中
  }
  this.parent.oncontextmenu=function(){
    return false;
  }//取消鼠标右键菜单
  this.parent.innerHTML="";//每次都把gamezone的内容清理，以免叠加
  this.parent.appendChild(table);//把Table加入Tgame-zone中
}

minesweeper.prototype.play = function(ev,obj){
  var This = this;
  var listColor = ["zero","one","two","three","four","five","six","seven"]//根据下标去获取相对应value的css
  var x = obj.pos[0];
  var y = obj.pos[1];
  var clickSquareInfo = this.squares[x][y];//被点击的td的信息
  var clickSquareDom = this.tds[x][y];//被点击的td的dom
  if(ev.which==1 && obj.className!="flag"){
    if (clickSquareInfo.type =="number"){
      if (clickSquareInfo.value !=0){
      clickSquareDom.innerHTML = clickSquareInfo.value;
      clickSquareDom.className = listColor[clickSquareInfo.value];//如果点击到的类型是数字且不为0，就显示相对应数字，且更新css
      }else{
        clickSquareDom.innerHTML = "";//如果点击到的类型是数字且为0，就只更新css
      }
      foundZero(clickSquareInfo);//去找附近的value为0的square
    function foundZero(target){
      var arrayAroundLocal = This.returnAroundLocal(target);//得到目标格子周围的坐标
      for (var k=0;k<arrayAroundLocal.length;k++){
        var squareX = arrayAroundLocal[k][0];
        var squareY = arrayAroundLocal[k][1];
        var squareValue = This.squares[squareX][squareY].value;
        This.tds[squareX][squareY].className = listColor[squareValue];//根据value给格子加入css
        if(squareValue == 0){
          This.tds[squareX][squareY].innerHTML ="";
          if(!This.tds[squareX][squareY].check){
            This.tds[squareX][squareY].check = true;//给格子添加check属性，如果有被查找过，就不再去递归
            foundZero(This.squares[squareX][squareY]);
          }
        }else{
        This.tds[squareX][squareY].innerHTML = squareValue;//value不是0的时候为到达边界，不再去调用foundzero
      }}
    }
    }else{
      this.gameOver(obj);//点到了地雷直接game over
    }
  }
  if(ev.which=3){
    var listResult = [];
    if(obj.className && obj.className!="flag"){
      return;//如果点到的有classname且不是flag的就返回
    }
    obj.className = obj.className == "flag"?"":"flag";//flag的选择与取消
    this.squares[obj.pos[0]][obj.pos[1]].flag = true;//为选中的格子增加被标记的属性
    if(obj.className == "flag"){
      this.mineNumDom.innerHTML= --this.surplusMine;//如果点击为flag状态，剩余雷数便-1
    }else{
      this.mineNumDom.innerHTML= ++this.surplusMine;//如果取消flag状态，剩余雷数便+1
    }
    if (this.surplusMine ==0){
      this.allRight = true;
      for (var i =0;i<this.tr;i++){
        for (var j=0;j<this.td;j++){
          this.tds[i][j].onmousedown = null;//剩余雷数为0时取消点击事件
          if(this.squares[i][j].type=="mine"){
            if(!this.squares[i][j].flag){
              this.allRight = false;//当有一个地雷格子没有被flag标记时，游戏结果为fail
            }}}}
      if (this.allRight){
        alert("GAME CLEAR");
      }else{
        this.gameOver();
      }
    }
    }
  }

minesweeper.prototype.gameOver = function(clickTd){
  for(var i=0;i<this.tr;i++){
    for(var j=0;j<this.td;j++){
      if(this.squares[i][j].type =="mine"){
        this.tds[i][j].className = "mine";
      }
      this.tds[i][j].onmousedown = null;
    }
  }
  if(clickTd){
    clickTd.style.backgroundColor="#f00";
}
alert("GAME FAIL");
}

var btns = document.querySelectorAll(".menu button");
var ln = 0;
var mine = null;
var gameInfo=[[9,9,10],[16,16,40],[28,28,99]];
for (let i=0;i<btns.length-1;i++){
  btns[i].onclick=function(){
    btns[ln].className = "";
    this.className = "active";
    ln = i;
    mine = new minesweeper(...gameInfo[i]);
    mine.init();
  }
}
btns[0].onclick();
btns[3].onclick=function(){
  mine.init();
};

