const canvas = document.getElementById("canvas-container") as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * .8;
canvas.height = window.innerHeight * .8;

class Bars {
  options: {
    padding: number,
    data: {}
  };
  x: number;
  y: number;
  speedX: number;
  speedY: number;

  constructor(x: number, y: number, options: { padding: number }) {
    this.options = options;
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;
  }

  drawLine = (ctx, startX, startY, endX, endY, color): void => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
  }

  drawBar = (ctx, upperLeftCornerX, upperLeftCornerY, width, height, color): void => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
    ctx.restore();
  }

  drawBars = () => {
    const canvasActualHeight = canvas.height - this.options.padding * 2;
    const canvasActualWidth = canvas.width - this.options.padding * 2;
    const barIndex = 0;
    const numberOfBars = Object.keys(this.options.data).length;
    const barSize = canvasActualWidth / numberOfBars;

    let values = [];

    for (const key, value in this.options.data) {
      values.push(value);
    };

    for (let val of values) {
      const barHeight = Math.round((canvasActualHeight * val) / this.maxValue);
      console.log(barHeight);

      this.drawBar(
        ctx,
        this.options.padding + barIndex * barSize,
        canvas.height - barHeight - this.options.padding,
        barSize,
        barHeight,
        this.colors[barIndex % this.colors.length]
      );

      barIndex++;
    }
  }
}
