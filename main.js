var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//描画処理では毎回記入
canvas.width = 480;
//canvas.height = 550;//553でぎちぎち
canvas.height = 320;
var ballRadius = 10;//円の半径
var x = canvas.width / 2;//ボールのx座標
var y = canvas.height - 30;//ボールのy座標
var dx = 2;//ずらす座標の値
var dy = -2;
//バー（パドル）の座標と高さ横幅を定義
var paddleHeight = 10;   // パドルの高さ
var paddleWidth = 75;    // パドルの横幅
var paddleX = (canvas.width - paddleWidth) / 2; // 横位置（中央スタート）
var paddleY = canvas.height - paddleHeight;
//左右キーのイベント変数デフォではfalse
var leftPressed = false;
var rightPressed=false;
var over = document.getElementById("GAMEOVER")
//ブロックの設計図
const brickRowCount = 3;//ブロックが縦に3つ
const brickColumnCount = 5;//ブロックが横に5つ
const brickWidth = 75;//ブロックが横75px
const brickHeight = 20;//ブロックが縦に10px
const brickPadding = 10;//10px感覚で離す
const brickOffsetTop = 30;//ブロック全体上から30px動かして書く
const brickOffsetLeft = 30;//ブロック全体左から30px動かして書く

const bricks = [];//3行5列のブロックを作るための

var SCORE = 0;//スコアを管理する変数
var Lives=3;
var SCOREelement=document.getElementById("SCORE");//SCOREドキュメントのidを取得
var LivesEelement=document.getElementById("Lives");//上と変わらん
var WIN = document.getElementById("GAMECLEAR")//GAMECLEARのIDを取得

let mouseLeftPressed = false;//左マウスのキーが押されたの真理値を保持するデフォでfalse

for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };//数値で状態を扱うためにstatusという変数に1を入れるこれを
  }
}

//キーを押したり離したりで定義したキーの論理を変化する関数を実行
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.addEventListener("mousemove", mouseMoveHandler, false);

//マウスが押されたキーの情報1,2によってキーの変数をtureに
document.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    mouseLeftPressed = true;
  }
});

document.addEventListener("mouseup",(e) =>{
  if (e.button === 0) {
    mouseLeftPressed=false;
  }
 });//

document.addEventListener("dblclick",(e)=>{
  e.preventDefault();
});

document.addEventListener("selectstart",(e)=>{
  e.preventDefault();
});
//左右矢印キーがどちらか押されている間左右キーのイベント変数のどちらかをtrueに
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

//左右矢印キーがどちらか離されている間左右キーのイベント変数のどちらかをtrueに
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (mouseLeftPressed){
    paddleX = relativeX - paddleWidth / 2;
    if (paddleX<0) {
      paddleX=0;
    }//右の座標をはみ出ないようにする
    if (paddleX+paddleWidth>canvas.width) {
      paddleX=canvas.width-paddleWidth;
    }//左のブロックをはみ出ないように
    }
  }

//(b.x, b.y) ┌──────────────┐
          // │              │
           //│   ブロック    │
           //│              │
           //└──────────────┘
          //b.x+width     //b.y+height
           //● ←ボール中心 (x, y)

//(b.x, b.y) ┌──────────────┐
           //│      ●       │ ←この状態なら当たり
           //│              │
           //│              │
           //└──────────────┘
//ボールのx,yの座標とブロックのx,yの座標加えてブロックのx,y足すブロックの縦横の長さ
//配列をbに格納する
//加えてb.statusを0にする
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if(b.status === 1){
      if (
        x > b.x && 
        x < b.x + brickWidth && 
        y > b.y && 
        y < b.y + brickHeight
      ) {
        dy = -dy;
        b.status=0;
         SCORE ++; //数値の加算処理
        SCOREelement.textContent=SCORE;//スコアの数値を更新表示
      
        if(SCORE>=brickRowCount*brickColumnCount){
        WIN.style.display="block"
        clearInterval(interval);
        setTimeout(()=>{
          document.location.reload();
        },5000);
      }
    }
    }
  }
}
}
// 円を軌道？座標？をずらしてすこしづつ描画する関数
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

//バー(パドル)の視覚化する関数
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

//((ブロックの行数×ブロックの長さ+ブロックの間隔))の座標
//((ブロックの列数×ブロックの高さ+ブロックの間隔))の座標
//繰り返しでブロックを作るかつ各座標も配列に格納する
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1){
      var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
      var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
     }
    }
  }
}


function draw() {
  //一度画面全体をまっさらに
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  //右端と左端の向かう座標の反転
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  //上端の座標の反転下端の場合GAMR OVER
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      Lives--;
      LivesEelement.textContent=Lives;
      if(!Lives){
      over.style.display = "block"//隠したGAME OVERを表示
      clearInterval(interval); // Needed for Chrome to end game
      setTimeout(() => {
        document.location.reload();
      }, 2000);//2秒後再読み込み 
    }  else  {
      x = canvas.width/2;
        y = canvas.height-30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width-paddleWidth)/2;
    }
    }
  }
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  x += dx;  
  y += dy;
}

var interval = setInterval(draw, 10);//10ミリ秒ごとにdraw実行の処理の場所を格納
//スマホ,タブレット対応
function resizeCanvas() {
  if(window.innerWidth<=600){
    canvas.width=window.innerWidth*0.95;
    canvas.height=window.innerHeight*0.6;
  }else{
    canvas.width=480;
    canvas.height=320;
  }
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
