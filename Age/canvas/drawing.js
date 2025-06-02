class Tool {
    constructor(ctx) {
        this.ctx = ctx;
    }
}
class PenTool extends Tool {
    onDraw(x, y) {
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
}
class EraserTool extends Tool {
    onDraw(x, y) {
        const size = this.ctx.lineWidth;
        this.ctx.clearRect(x - size / 2, y - size / 2, size, size);
    }
}
class DrawingApp {
    constructor() {
        this.isDrawing = false;
        this.doDraw = (e) => {
            if (!this.isDrawing)
                return;
            const x = e.clientX - this.canvas.offsetLeft + window.scrollX;
            const y = e.clientY - this.canvas.offsetTop + window.scrollY;
            this.setStrokeStyle();
            this.tool.onDraw(x, y);
        };
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");
        this.tool = new PenTool(this.ctx);
        this.init();
    }
    init() {
        this.ctx.lineWidth = +document.querySelector("#lwInput").value;
        this.setStrokeStyle();
        document.querySelector("#colorInput").addEventListener("change", this.setStrokeStyle.bind(this));
        document.querySelector("#lwInput").addEventListener("input", this.setLineWidth.bind(this));
        document.querySelector("#eraser").addEventListener("click", this.toggleEraser.bind(this));
        document.querySelector("#clearCanvasBtn").addEventListener("click", this.clearCanvas.bind(this));
        this.canvas.addEventListener("pointerdown", this.startDraw.bind(this));
        this.canvas.addEventListener("pointerup", this.stopDraw.bind(this));
        this.canvas.addEventListener("pointerout", this.stopDraw.bind(this));
        this.canvas.addEventListener("pointercancel", this.stopDraw.bind(this));
    }
    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }
    setStrokeStyle() {
        const color = document.querySelector("#colorInput").value;
        const { r, g, b } = this.hexToRgb(color);
        this.ctx.strokeStyle = `rgb(${r},${g},${b})`;
    }
    setLineWidth(e) {
        const input = e.target;
        this.ctx.lineWidth = +input.value;
    }
    startDraw(e) {
        this.setStrokeStyle();
        const x = e.clientX - this.canvas.offsetLeft + window.scrollX;
        const y = e.clientY - this.canvas.offsetTop + window.scrollY;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.isDrawing = true;
        this.canvas.addEventListener("pointermove", this.doDraw);
    }
    stopDraw() {
        this.isDrawing = false;
        this.ctx.closePath();
        this.canvas.removeEventListener("pointermove", this.doDraw);
    }
    toggleEraser() {
        const eraserBtn = document.getElementById('eraser');
        if (this.tool instanceof EraserTool) {
            this.tool = new PenTool(this.ctx);
            eraserBtn === null || eraserBtn === void 0 ? void 0 : eraserBtn.classList.remove('active');
        }
        else {
            this.tool = new EraserTool(this.ctx);
            eraserBtn === null || eraserBtn === void 0 ? void 0 : eraserBtn.classList.add('active');
        }
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
window.onload = () => { new DrawingApp(); };
