interface RGB {
    r: number;
    g: number;
    b: number;
}

abstract class Tool{
    protected ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D){
        this.ctx = ctx;
    }

    abstract onDraw(x: number, y:number): void;
}

class PenTool extends Tool{
    onDraw(x: number, y: number): void{
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
}

class EraserTool extends Tool{
    onDraw(x: number, y:number): void{
        const size = this.ctx.lineWidth;
        this.ctx.clearRect(x - size / 2, y - size / 2, size, size);
    }
}

class DrawingApp{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private isDrawing = false; 
    private tool: Tool;
    private colorChangeCounter = 0;
    private lastColor: string = "";

    constructor(){
        this.canvas = document.querySelector("#canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;
        this.tool = new PenTool(this.ctx);
        const colorInput = document.querySelector("#colorInput") as HTMLInputElement;
        colorInput.addEventListener("change", () => {
            this.updateColor(colorInput.value);
        });

        this.init()
    }

    private init(){
        this.ctx.lineWidth = +(document.querySelector("#lwInput") as HTMLInputElement).value;
        this.setStrokeStyle();

        (document.querySelector("#colorInput") as HTMLInputElement).addEventListener("change", this.setStrokeStyle.bind(this));
        (document.querySelector("#lwInput") as HTMLInputElement).addEventListener("input", this.setLineWidth.bind(this));
        (document.querySelector("#eraser") as HTMLButtonElement).addEventListener("click", this.toggleEraser.bind(this));
        (document.querySelector("#clearCanvasBtn") as HTMLButtonElement).addEventListener("click", this.clearCanvas.bind(this));

        this.canvas.addEventListener("pointerdown", this.startDraw.bind(this));
        this.canvas.addEventListener("pointerup", this.stopDraw.bind(this));
        this.canvas.addEventListener("pointerout", this.stopDraw.bind(this));
        this.canvas.addEventListener("pointercancel", this.stopDraw.bind(this));
    }

    private hexToRgb(hex: string): RGB {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
    }

    private updateColor(newColor: string): void {
        if (newColor !== this.lastColor) {
            this.colorChangeCounter++;
            this.lastColor = newColor;
            this.updateColorChangeDisplay();
        }
        this.setStrokeStyle(newColor);
    }

    private setStrokeStyle(color?:string): void{
        const selectedColor = color ?? (document.querySelector("#colorInput") as HTMLInputElement).value;
        const {r, g, b} = this.hexToRgb(selectedColor);
        this.ctx.strokeStyle = `rgb(${r},${g},${b})`;
    }

    private updateColorChangeDisplay(): void{
        const counterEl = document.querySelector("#colorChangeCounter") as HTMLElement;
        if(counterEl){
            counterEl.textContent = `Värvi muudeti: ${this.colorChangeCounter}`;
        }
    }

    private setLineWidth(e: Event): void{
        const input = e.target as HTMLInputElement;
        this.ctx.lineWidth = +input.value;
    }

    private startDraw(e: PointerEvent): void{
        this.setStrokeStyle();
        const x = e.clientX - this.canvas.offsetLeft + window.scrollX;
        const y = e.clientY - this.canvas.offsetTop + window.scrollY;

        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(x,y);

        this.isDrawing = true;
        this.canvas.addEventListener("pointermove", this.doDraw);
    }

    private doDraw = (e: PointerEvent): void => {
        if(!this.isDrawing) return;

        const x = e.clientX - this.canvas.offsetLeft + window.scrollX;
        const y = e.clientY - this.canvas.offsetTop + window.scrollY;
        
        this.setStrokeStyle();
        this.tool.onDraw(x,y);
    }

    private stopDraw(): void{
        this.isDrawing = false;
        this.ctx.closePath();
        this.canvas.removeEventListener("pointermove", this.doDraw)
    }

    private toggleEraser(): void{
        const eraserBtn = document.getElementById('eraser');

        if(this.tool instanceof EraserTool){
            this.tool = new PenTool(this.ctx);
            eraserBtn?.classList.remove('active');
        } else {
            this.tool = new EraserTool(this.ctx);
            eraserBtn?.classList.add('active');
        }
    }

    private clearCanvas(): void{
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

window.onload = () => { new DrawingApp() }