let centerFlower;

let bgFlowList = [];

const flowColors = [
  { form: "#BA093433", to: "#FF00D600" },
  { form: "#FF7B0133", to: "#FFC70000" },
  { form: "#01A4FF33", to: "#42FF0000" },
];

function setup() {
  createCanvas(windowWidth, windowHeight).parent("bg");
  for (let i = 0; i < 6; i++) {
    const FLOWER_COLOR = random(flowColors);
    bgFlowList.push(
      new Flow(
        createVector(
          random([random(0, width / 2 - 150), random(width / 2 + 150, width)]),
          random([
            random(0, height / 2 - 150),
            random(height / 2 + 150, height),
          ])
        ),
        int(random(6, 10)),
        FLOWER_COLOR.form,
        FLOWER_COLOR.to,
        random(60, 100)
      )
    );
  }

  centerFlower = new Flow(
    createVector(width / 2, height / 2 - 100),
    10,
    "#D855BA",
    "#FF00D600",
    230
  );
}

function draw() {
  background("#ffe1e8");

  for (let f of bgFlowList) {
    f.draw();
  }

  centerFlower.draw();

  if (centerFlower.petalList.length <= 0) {
    document.getElementById("tips").style.top = 0;
    document.getElementById("tips").style.bottom = 0;
    document.getElementById("tips").style.margin = "auto 0";
  }

  if (mouseIsPressed) {
    const _p = [];
    for (let i = 0; i < centerFlower.petalList.length; i++) {
      push();
      translate(width / 2, height / 2 - 100);
      const petal = centerFlower.petalList[i];
      const pRotate = createVector(-petal.len / 2 - petal.offset, 0);
      pRotate.rotate(petal.a);
      const mousePos = createVector(
        mouseX - width / 2,
        mouseY - height / 2 + 100
      );
      const d = mousePos.dist(pRotate);
      if (d <= petal.h / 2) {
        _p.push({
          d: d,
          index: i,
        });
      }
      pop();
    }
    _p.sort((a, b) => a.d - b.d);
    if (_p[0]) {
      centerFlower.petalList[_p[0].index].fallOff();
    }
  }
}

class Petal {
  constructor(pos, a, fromColor, toColor, len, h) {
    this.pos = pos;
    this.a = a;
    this.fromColor =
      color(
        red(fromColor),
        green(fromColor),
        blue(fromColor),
        alpha(fromColor)
      ) || color("#000000");
    this.toColor =
      color(red(toColor), green(toColor), blue(toColor), alpha(toColor)) ||
      color("#ffffff");
    this.len = len || 300;
    this.h = h || 200;

    this.isAlive = true;
    this.t = 0;
    this.isFall = false;

    this.offset = h * 0.28;
  }

  draw() {
    push();

    translate(this.pos.x, this.pos.y);
    rotate(this.a);
    const list1 = [];
    const list2 = [];

    translate(-this.len / 2 - this.offset, 0);

    const step = PI / 180;
    const a = this.len / 2;
    const b = this.h / 2;
    for (let angle = 0; angle <= PI; angle += step) {
      const x = a * cos(angle);
      const y = b * sin(angle);
      list1.push({ x, y });
    }

    for (let angle = PI; angle <= TWO_PI; angle += step) {
      const x = a * cos(angle);
      const y = b * sin(angle);
      list2.push({ x, y });
    }

    list2.reverse();

    for (let i = 0; i < list1.length; i++) {
      const p1 = list1[i];
      const p2 = list2[i];
      stroke(
        lerpColor(
          this.fromColor,
          this.toColor,
          map(i, 0, list1.length / 2, 1, 0)
        )
      );
      strokeWeight(5);
      line(p1.x, p1.y, p2.x, p2.y);
    }

    pop();
  }

  update() {
    if (this.isFall) {
      this.t++;
      this.offset += 1;

      if (this.t >= 200) {
        this.isAlive = false;
        document.getElementById("value").innerHTML =
          centerFlower.petalList.length % 2 ? "LOVES" : "Doesn’t LOVE";
      }
    }
  }

  fallOff() {
    this.isFall = true;
    this.fromColor.setAlpha(20);
    this.toColor.setAlpha(20);
  }
}

class Flow {
  constructor(pos, petalCount, fromColor, toColor, r) {
    this.pos = pos;
    this.petalCount = petalCount;
    this.fromColor = fromColor;
    this.toColor = toColor;

    this.r = r;

    this.petalList = [];
    this.init();

    this.lastIndex = petalCount - 1;
  }

  init() {
    const fromColor = color(this.fromColor);
    fromColor.setAlpha(100);
    const toColor = color(this.toColor);
    toColor.setAlpha(100);
    for (let i = 1; i <= this.petalCount; i++) {
      const p = new Petal(
        createVector(this.pos.x, this.pos.y),
        radians((360 / this.petalCount) * i),
        fromColor,
        toColor,
        this.r,
        int(this.r * 0.66)
      );
      this.petalList.push(p);
    }
  }

  draw() {
    this.petalList = this.petalList.filter((i) => i.isAlive);
    for (const p of this.petalList) {
      if (p.isAlive) {
        p.update();
        p.draw();
      }
    }
  }

  fallOff(index) {
    if (index == null) {
      index = this.lastIndex;
    }
    if (index >= 0) {
      const petal = this.petalList[index];
      petal.fallOff();
      this.lastIndex--;
    }
  }
}
