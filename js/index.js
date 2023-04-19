let eggList = [];
let rectList = [];

let eggImg;

let rect1 = {
  x: null,
  y: null,
  width: 417,
  height: 151,
};

let rect2 = {
  x: null,
  y: null,
  width: 454,
  height: 148,
};

function preload() {
  eggImg = loadImage("assets/egg.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  // rectMode(CENTER);
  background("#FFE3C1");

  rect1.x = int(width * 0.57);
  rect1.y = int(height * 0.26);

  rect2.x = int(width * 0.16);
  rect2.y = int(height * 0.57);

  rectList[0] = rect1;
  rectList[1] = rect2;

  myInit();
}

function myInit() {
  background("#FFE3C1");
  eggList = [];
  for (let i = 0; i < 300; i++) {
    drawEgg();
  }
}

function drawEgg() {
  const rate = random(1.5, 2.5);
  const eggWidth = int(eggImg.width / rate);
  const eggHeight = int(eggImg.height / rate);

  // 绘制圆形
  let newEgg = {
    x: int(random(width)),
    y: int(random(height)),
    eggWidth: int(eggWidth),
    eggHeight: int(eggHeight),
    maxR: max(int(eggWidth / 2), int(eggHeight / 2)),
  };

  // 检查是否与已有圆形相交
  let overlapping = false;
  for (let i = 0; i < eggList.length; i++) {
    let other = eggList[i];
    let d = dist(newEgg.x, newEgg.y, other.x, other.y);
    if (d < newEgg.maxR + other.maxR) {
      overlapping = true;
      break;
    }
  }

  for (let i = 0; i < rectList.length; i++) {
    const other = rectList[i];
    if (
      newEgg.x + newEgg.maxR >= other.x &&
      newEgg.x - newEgg.maxR <= other.x + other.width &&
      newEgg.y + newEgg.maxR >= other.y &&
      newEgg.y - newEgg.maxR <= other.y + other.height
    ) {
      overlapping = true;
      break;
    }
  }

  // 如果不相交则添加到已绘制的圆形数组中并绘制
  push();
  if (!overlapping) {
    translate(newEgg.x, newEgg.y);
    eggList.push(newEgg);
    rotate(random(TWO_PI));
    image(eggImg, 0, 0, newEgg.eggWidth, newEgg.eggHeight);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  myInit();
}

function mouseMoved() {
  if (random() < 0.033) {
    myInit();
  }
}
