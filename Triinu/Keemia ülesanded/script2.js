// Joonistusvahendi klass
class DrawingTool {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.font = '16px Arial';
    this.shapes = []; // Kõik kujundid 
    this.history = []; // Undo jaoks (undo history stack)
    this.redoStack = []; // Redo jaoks (redo stack)

    this.dragged = null; // Lohistatav kujund
    this.offset = { x: 0, y: 0 }; // Hiire nihked lohistamisel
    this.selectedIndex = null; // Valitud kujundi indeks
    
    // Hiire ja klaviatuuri sündmuste kuulajad 
    canvas.addEventListener('mousedown', e => this.onMouseDown(e));
    canvas.addEventListener('mouseup', e => this.onMouseUp(e));
    canvas.addEventListener('mousemove', e => this.onMouseMove(e));
    window.addEventListener('keydown', e => this.onKeyDown(e));

    // Topeltklõps teksti muutmiseks 
    canvas.addEventListener('dblclick', e => this.onDoubleClick(e));
  }

  // Salvestab kujundite seisu Undo jaoks
  saveHistory() {
    this.history.push(JSON.stringify(this.shapes));
    if (this.history.length > 50) this.history.shift(); // Hoiab ajalugu max 50 salvestust
    this.redoStack = []; // Puhastab redo virna
  }

  // Undo funktsioon
  undo() {
    if (!this.history.length) return;
    this.redoStack.push(JSON.stringify(this.shapes));
    this.shapes = JSON.parse(this.history.pop());
    this.selectedIndex = null;
    this.redraw();
  }

  // Redo funktsioon
  redo() {
    if (!this.redoStack.length) return;
    this.history.push(JSON.stringify(this.shapes));
    this.shapes = JSON.parse(this.redoStack.pop());
    this.selectedIndex = null;
    this.redraw();

  }

  // Kujundi lisamine
  addShape(type) {
    let s = null;
    switch (type) {
      case 'line':
        s = { type: 'line', x: 50, y: 50, length: 30, angle: 0 };
        break;
      case 'doubleLine':
        s = { type: 'doubleLine', x: 50, y: 100, length: 30, angle: 0 };
        break;
      case 'tripleLine':
        s = { type: 'tripleLine', x: 50, y: 150, length: 30, angle: 0 };
        break;

      case 'hexagon':
        s = { type: 'hexagon', x: 200, y: 200, size: 30, angle: 0 };
        break;

      case 'text':
        const txt = prompt('Sisesta tekst (max 10 sümbolit, kleepimine pole lubatud):');
        // Kontrolli pastetud teksti: liiga pikk, reavahetus, erimärgid
        const pastedPattern = /[\n\r]|[^ -~]/; // detects newlines or non-printable ASCII

        if (!txt || txt.length > 10 || pastedPattern.test(txt)) {
          alert('Kleebitud või üle 10 sümboli pikkune tekst pole lubatud!');
          return;
        }

        const qtyInput = prompt('Mitu korda soovid teksti lisada (kogus)?');
        let qty = qtyInput === '' ? 1 : +qtyInput;

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

  // Valitud kujundi kustutamine
  deleteSelected() {
    if (this.selectedIndex == null) return;
    this.saveHistory();
    this.shapes.splice(this.selectedIndex, 1);
    this.selectedIndex = null;
    this.redraw();
  }

  // Kõigi kujundite kustutamine
  deleteAll() {
    this.saveHistory();
    this.shapes = [];
    this.selectedIndex = null;
    this.redraw();
  }

  // Joonistab kõik kujundid uuesti
  redraw() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.shapes.forEach((s, i) => this.drawShape(s, i === this.selectedIndex));
  }


  // Ühe kujundi joonistamine
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

      case 'text':
        this.ctx.fillStyle = isActive ? activeColor : defaultStroke;
        this.ctx.fillText(s.text, 0, 0);
        break;
    }

    this.ctx.restore();
  }



  // Kontrollib, kas hiireklõps tabas kujundit
  hitTest(s, mx, my) {
    const dx = mx - s.x, dy = my - s.y;
    const ang = -(s.angle || 0);
    // Pöörab koordinaadid tagasi vastavalt kujundi nurga pööramisele
    const lx = dx * Math.cos(ang) - dy * Math.sin(ang);
    const ly = dx * Math.sin(ang) + dy * Math.cos(ang);

    switch (s.type) {
      case 'line':
      case 'doubleLine':
      case 'tripleLine':
        return ly > -5 && ly < 5 && lx > -5 && lx < s.length + 5;

      case 'hexagon':
        // Kuusnurga hit-test: kontrollib, kas kaugus on väiksem kui kuusnurga suurus + 5px
        return Math.hypot(lx, ly) <= (s.size || 30) + 5;

      case 'text':
        return Math.hypot(lx, ly) < 20;

      case 'dots':
        return Math.hypot(lx, ly) < 10;

      default:
        return false;
    }
  }

  // Hiireklõps: kontrollib kas kujundit valiti ja salvestab lohistamise jaoks
  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;

    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.hitTest(this.shapes[i], mx, my)) {
        this.selectedIndex = i;
        this.dragged = i;
        this.offset.x = mx - this.shapes[i].x;
        this.offset.y = my - this.shapes[i].y;
        this.isDragging = false; // Reset dragging flag
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

    // If mouse moves more than a small threshold, start dragging
    if (!this.isDragging) {
      this.isDragging = true;
      this.saveHistory(); // Save history only when actual dragging starts
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
      // No drag happened, so this was a click: just select shape (already done in mousedown)
      // You can put any click-only logic here if needed
    }
    this.dragged = null;
    this.isDragging = false;
  }


  // Klaviatuurikäsud: kustutus, pööramine, undo/redo
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

  // Teksti muutmine topeltklõpsuga
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

// Globaalne joonistusobjekt
let tool;

// Kujundi lisamise abifunktsioon
function addShape(type) {
  tool && tool.addShape(type);
}

// Initsialiseerimine lehe laadimisel
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
  // Pause video when modal closes:
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


