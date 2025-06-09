class DrawingTool {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.font = '16px Arial';
    this.shapes = []; 
    this.history = []; 
    this.redoStack = []; 

    this.dragged = null; 
    this.offset = { x: 0, y: 0 }; 
    this.selectedIndex = null; 
    
    canvas.addEventListener('mousedown', e => this.onMouseDown(e));
    canvas.addEventListener('mouseup', e => this.onMouseUp(e));
    canvas.addEventListener('mousemove', e => this.onMouseMove(e));
    window.addEventListener('keydown', e => this.onKeyDown(e));

    canvas.addEventListener('dblclick', e => this.onDoubleClick(e));
  }

  saveHistory() {
    this.history.push(JSON.stringify(this.shapes));
    if (this.history.length > 50) this.history.shift(); 
    this.redoStack = []; 
  }

  undo() {
    if (!this.history.length) return;
    this.redoStack.push(JSON.stringify(this.shapes));
    this.shapes = JSON.parse(this.history.pop());
    this.selectedIndex = null;
    this.redraw();
  }

  redo() {
    if (!this.redoStack.length) return;
    this.history.push(JSON.stringify(this.shapes));
    this.shapes = JSON.parse(this.redoStack.pop());
    this.selectedIndex = null;
    this.redraw();

  }

  addShape(type) {
    let s = null;
    const randOffset = () => Math.floor(Math.random() * 10 - 5);

    switch (type) {
      case 'line':
        s = { type: 'line', x: 50 + randOffset(), y: 50 + randOffset(), length: 30, angle: 0 };
        break;
      case 'doubleLine':
        s = { type: 'doubleLine', x: 50 + randOffset(), y: 50 + randOffset(), length: 30, angle: 0 };
        break;
      case 'tripleLine':
        s = { type: 'tripleLine', x: 50 + randOffset(), y: 50 + randOffset(), length: 30, angle: 0 };
        break;
      case 'hexagon':
        s = { type: 'hexagon', x: 50 + randOffset(), y: 50 + randOffset(), size: 30, angle: 0 };
        break;

      case 'labeledHexagon':
        const labels = [];
        for (let i = 0; i < 6; i++) {
          const label = prompt(`Sisesta nurga ${i + 1} tekst (võib ka tühjaks jätta):`);
          labels.push(label || '');
        }
        s = { type: 'labeledHexagon', x: 300, y: 300, size: 30, angle: 0, labels };
        break;

      case 'text':
        const txt = prompt('Sisesta tekst (max 10 sümbolit, kleepimine pole lubatud):');
        const pastedPattern = /[\n\r]|[^ -~]/;

        if (!txt || txt.length > 10 || pastedPattern.test(txt)) {
          alert('Kleebitud või üle 10 sümboli pikkune tekst pole lubatud!');
          return;
        }

        const qtyInput = prompt('Mitu korda soovid teksti lisada (kogus)?');
        let qty = qtyInput === '' ? 1 : +qtyInput;
        if (qty > 10) return alert('Maksimaalne kogus on 10!');


        if (isNaN(qty) || qty < 1) return alert('Palun sisesta kehtiv number!');

        if (!qty || qty < 1) return;

        this.saveHistory();
        for (let i = 0; i < qty; i++) {
          const offsetX = i * 20;
          this.shapes.push({ type: 'text', x: 200 + offsetX, y: 200, text: txt, angle: 0 });
        }
        this.redraw();
        return;
    }

    if (s) {
      this.saveHistory();
      this.shapes.push(s);
      this.redraw();
    }
  }

  deleteSelected() {
    if (this.selectedIndex == null) return;
    this.saveHistory();
    this.shapes.splice(this.selectedIndex, 1);
    this.selectedIndex = null;
    this.redraw();
  }

  deleteAll() {
    this.saveHistory();
    this.shapes = [];
    this.selectedIndex = null;
    this.redraw();
  }

  redraw() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.shapes.forEach((s, i) => this.drawShape(s, i === this.selectedIndex));
  }


  drawShape(s, isActive = false) {
    this.ctx.save();
    this.ctx.translate(s.x, s.y);
    this.ctx.rotate(s.angle || 0);

    const activeColor = '#b52634';
    const defaultStroke = 'black';

    switch (s.type) {
      case 'line':
        this.ctx.strokeStyle = isActive ? activeColor : defaultStroke;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(s.length, 0);
        this.ctx.stroke();
        break;

      case 'doubleLine':
        this.ctx.strokeStyle = isActive ? activeColor : defaultStroke;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -3);
        this.ctx.lineTo(s.length, -3);
        this.ctx.moveTo(0, 3);
        this.ctx.lineTo(s.length, 3);
        this.ctx.stroke();
        break;

      case 'tripleLine':
        this.ctx.strokeStyle = isActive ? activeColor : defaultStroke;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -4);
        this.ctx.lineTo(s.length, -4);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(s.length, 0);
        this.ctx.moveTo(0, 4);
        this.ctx.lineTo(s.length, 4);
        this.ctx.stroke();
        break;

      case 'hexagon':
        this.ctx.strokeStyle = isActive ? activeColor : defaultStroke;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = i * Math.PI / 3;
          const x = (s.size || 30) * Math.cos(a);
          const y = (s.size || 30) * Math.sin(a);
          i === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        break;
      
      case 'labeledHexagon':
        const { x, y, size, labels } = s;

        if (typeof x !== 'number' || typeof y !== 'number' || typeof size !== 'number') {
            console.error('Invalid coordinates or size for hexagon:', {x, y, size});
            break;
        }
        if (!Array.isArray(labels) || labels.length < 6) {
            console.error('Labels must be an array with at least 6 items:', labels);
            break;
        }

        this.ctx.strokeStyle = isActive ? activeColor : defaultStroke;
        this.ctx.lineWidth = 2;
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = isActive ? activeColor : defaultStroke;

        const points = [];
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const px = size * Math.cos(angle);
            const py = size * Math.sin(angle);
            points.push({ x: px, y: py });

            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();

        const inset = 8;
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const px = points[i].x;
            const py = points[i].y;

            const label = labels[i] || '';

            const labelX = px + inset * Math.cos(angle + Math.PI);
            const labelY = py + inset * Math.sin(angle + Math.PI);

            this.ctx.fillText(label, labelX - 5, labelY + 4);
        }
        break;





      case 'text':
        this.ctx.fillStyle = isActive ? activeColor : defaultStroke;
        this.ctx.fillText(s.text, 0, 0);
        break;
    }

    this.ctx.restore();
  }



  hitTest(s, mx, my) {
    const dx = mx - s.x, dy = my - s.y;
    const ang = -(s.angle || 0);
    const lx = dx * Math.cos(ang) - dy * Math.sin(ang);
    const ly = dx * Math.sin(ang) + dy * Math.cos(ang);

    switch (s.type) {
      case 'line':
      case 'doubleLine':
      case 'tripleLine':
        return ly > -5 && ly < 5 && lx > -5 && lx < s.length + 5;

      case 'hexagon':
        return Math.hypot(lx, ly) <= (s.size || 30) + 5;
      case 'labeledHexagon':
        return Math.hypot(lx, ly) <= (s.size || 30) + 5;

      case 'text':
        return Math.hypot(lx, ly) < 20;

      case 'dots':
        return Math.hypot(lx, ly) < 10;

      default:
        return false;
    }
  }

  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;

    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.hitTest(this.shapes[i], mx, my)) {
        this.selectedIndex = i;
        this.dragged = i;
        this.offset.x = mx - this.shapes[i].x;
        this.offset.y = my - this.shapes[i].y;
        this.isDragging = false; 
        this.redraw();
        return;
      }
    }
    this.selectedIndex = null;
    this.redraw();
  }

  onMouseMove(e) {
    if (this.dragged == null) return;

    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;

    if (!this.isDragging) {
      this.isDragging = true;
      this.saveHistory();
    }

    if (this.isDragging) {
      const s = this.shapes[this.dragged];
      s.x = mx - this.offset.x;
      s.y = my - this.offset.y;
      this.redraw();
    }
  }

  onMouseUp(e) {
    if (!this.isDragging) {
    }
    this.dragged = null;
    this.isDragging = false;
  }


  onKeyDown(e) {
    if (e.key === 'z' || e.key === 'Z') return this.undo();
    if (e.key === 'y' || e.key === 'Y') return this.redo();
    if (e.key === 'Delete' || e.key === 'Backspace') return this.deleteSelected();

    if (this.selectedIndex != null && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      this.saveHistory();
      const delta = (e.key === 'ArrowUp' ? 30 : -30) * Math.PI / 180;
      this.shapes[this.selectedIndex].angle += delta;
      this.redraw();
    }
  }

  onDoubleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.shapes[i].type === 'text' && this.hitTest(this.shapes[i], mx, my)) {
        const newText = prompt('Muuda teksti (max 10 tähemärki):', this.shapes[i].text);
        if (newText && newText.length <= 10) {
          this.saveHistory();
          this.shapes[i].text = newText;
          this.redraw();
        }
        break;
      }
    }
  }
}

let tool;

function addShape(type) {
  tool && tool.addShape(type);
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('drawingCanvas');
  tool = new DrawingTool(canvas);

  const modal = document.getElementById("videoModal");
  const openBtn = document.getElementById("openVideoBtn");
  const closeBtn = document.getElementById("closeVideoBtn");

  openBtn.onclick = function () {
    modal.style.display = "block";
  };

  closeBtn.onclick = function () {
    modal.style.display = "none";
    const video = modal.querySelector("video");
    video.pause();
    video.currentTime = 0;
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      const video = modal.querySelector("video");
      video.pause();
      video.currentTime = 0;
    }
  };
});


const modal = document.getElementById("videoModal");
const openBtn = document.getElementById("openVideoBtn");
const closeBtn = document.getElementById("closeVideoBtn");

openBtn.onclick = function() {
  modal.style.display = "block";
}

closeBtn.onclick = function() {
  modal.style.display = "none";
  const video = modal.querySelector("video");
  video.pause();
  video.currentTime = 0;
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    const video = modal.querySelector("video");
    video.pause();
    video.currentTime = 0;
  }
}


