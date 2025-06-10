// Quiz Builder JavaScript - Cleaned and Fixed Version
class Keyboard {
    constructor(targetElement) {
        this.targetElement = targetElement;
        this.buttons = [];
    }
    
    addButton(symbol, callback) {
        const button = new KeyboardButton(symbol, callback);
        this.buttons.push(button);
        this.targetElement.appendChild(button.render());
    }
}

class KeyboardButton {
    constructor(symbol, callback) {
        this.symbol = symbol;
        this.callback = callback;
        this.buttonElement = null;
    }
    
    render() {
        this.buttonElement = document.createElement('div');
        this.buttonElement.classList.add('key');
        this.buttonElement.textContent = this.symbol;
        this.buttonElement.style.cssText = `
            padding: 8px 12px;
            margin: 2px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            user-select: none;
            display: inline-block;
            min-width: 30px;
            text-align: center;
            font-family: monospace;
        `;
        this.buttonElement.onclick = () => this.callback(this.symbol);
        
        // Add hover effect
        this.buttonElement.addEventListener('mouseover', () => {
            this.buttonElement.style.background = '#e0e0e0';
        });
        this.buttonElement.addEventListener('mouseout', () => {
            this.buttonElement.style.background = '#f0f0f0';
        });
        
        return this.buttonElement;
    }
}

// Drawing Tool Class for Chemistry Chains
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


class ChemistryKeyboard extends Keyboard {
    constructor(targetElement, inputField) {
        super(targetElement);
        this.inputField = inputField;
        this.initializeKeys();
    }
    
    initializeKeys() {
        const symbols = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₀', '→', '⇌', '↑', '↓', '+', '(', ')', 'Δ', '⁺', '⁻', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁰'];
        symbols.forEach(symbol => {
            this.addButton(symbol, this.addToInputField.bind(this));
        });
    }
    
    addToInputField(symbol) {
        const input = this.inputField.inputElement;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        input.value = text.slice(0, start) + symbol + text.slice(end);
        input.selectionStart = input.selectionEnd = start + symbol.length;
        input.focus();
    }
}

class InputField {
    constructor(inputElement) {
        this.inputElement = inputElement;
        this.inputElement.addEventListener('paste', (e) => {
            e.preventDefault();
            alert('Kleepimine on selles sisestusväljal keelatud.');
        });
    }
    
    clear() {
        this.inputElement.value = '';
    }
    
    append(value) {
        const input = this.inputElement;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        input.value = text.slice(0, start) + value + text.slice(end);
        input.selectionStart = input.selectionEnd = start + value.length;
        input.focus();
    }
}

class QuizBuilder {
    constructor() {
        this.init();
    }
    saveQuiz(quizData) {
        return fetch('http://localhost:3006/quiz/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quizData),
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Quiz salvestatud!");
                return result.quizId;
            } else {
                alert(result.error || "Salvestamine ebaõnnestus.");
                throw new Error(result.error);
            }
        })
        .catch(error => {
            console.error("Save error:", error);
            alert("Midagi läks valesti salvestamisel.");
        });
    }

    loadQuiz(quizId) {
        return fetch(`http://localhost:3006/quiz/load/${quizId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                return result.quizData;
            } else {
                alert(result.error || "Laadimine ebaõnnestus.");
                throw new Error(result.error);
            }
        })
        .catch(error => {
            console.error("Load error:", error);
            alert("Midagi läks valesti laadimisel.");
        });
    }

    collectQuizData() {
        const quizData = {
            type: this.getCurrentQuizType(),
            content: {},
            timestamp: new Date().toISOString()
        };

        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return quizData;

        // Collect data based on quiz type
        switch (quizData.type) {
            case 'luhike-tekst':
                quizData.content.answer = previewContent.querySelector('input')?.value || '';
                break;
            case 'pikk-tekst':
                quizData.content.answer = previewContent.querySelector('textarea')?.value || '';
                break;
            case 'uks-oige':
                quizData.content.options = this.collectSingleChoiceData();
                break;
            case 'mitu-oiget':
                quizData.content.options = this.collectMultipleChoiceData();
                break;
            case 'keemia_tasakaalustamine':
                quizData.content.equation = document.getElementById('chemistry-input-field')?.value || '';
                break;
            case 'keemia_ahelad':
                // Collect drawing data
                const canvas = document.getElementById('chemistry-drawing-canvas');
                if (canvas && window.chemistryDrawingTool) {
                    quizData.content.shapes = window.chemistryDrawingTool.shapes;
                }
                break;
            }

        return quizData;
    }

    getCurrentQuizType() {
        const dropdown = document.getElementById('dropdown-selected');
        return dropdown?.querySelector('span')?.dataset?.value || 'luhike-tekst';
    }

    collectSingleChoiceData() {
        const options = [];
        const optionRows = document.querySelectorAll('#single-options .option-row');
        optionRows.forEach((row, index) => {
            const text = row.querySelector('.option-input')?.value || '';
            const isCorrect = row.querySelector('input[name="correct-single"]:checked') !== null;
            options.push({ text, isCorrect, index });
        });
        return options;
    }

    collectMultipleChoiceData() {
        const options = [];
        const optionRows = document.querySelectorAll('#multiple-options .option-row');
        optionRows.forEach((row, index) => {
            const text = row.querySelector('.option-input')?.value || '';
            const isCorrect = row.querySelector('input[name="correct-multiple"]:checked') !== null;
            options.push({ text, isCorrect, index });
        });
        return options;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupDropdown();
            this.setupEventListeners();
        });
    }

    setupDropdown() {
        const dropdown = document.getElementById('answer-type-dropdown');
        const dropdownSelected = document.getElementById('dropdown-selected');
        const dropdownOptions = document.getElementById('dropdown-options');
        
        if (!dropdown || !dropdownSelected || !dropdownOptions) return;

        // Dropdown toggle
        dropdownSelected.addEventListener('click', (e) => {
            e.stopPropagation();
            const options = document.getElementById('dropdown-options');
            options.style.display = options.style.display === 'block' ? 'none' : 'block';
        });

        // Option selection
        dropdownOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-option')) {
                const value = e.target.getAttribute('data-value');
                const text = e.target.textContent;
                
                dropdownSelected.querySelector('span').textContent = text;
                dropdown.classList.remove('open');
                
                this.showPreview(value);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    }

    setupEventListeners() {
        // Global event delegation for dynamic content
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                this.removeOption(e.target);
            }
            if (e.target.classList.contains('add-btn')) {
                this.handleAddButton(e.target);
            }
        });
    }

    showPreview(value) {
        const previewSection = document.getElementById('preview-section');
        const previewContent = document.getElementById('preview-content');
        
        if (!previewSection || !previewContent) return;

        previewSection.style.display = 'block';
        previewContent.innerHTML = '';
        
        const renderers = {
            'luhike-tekst': () => this.renderShortText(),
            'pikk-tekst': () => this.renderLongText(),
            'mitu-oiget': () => this.renderMultipleChoice(),
            'uks-oige': () => this.renderSingleChoice(),
            'maatriks-uks': () => this.renderMatrixSingle(),
            'maatriks-mitu': () => this.renderMatrixMultiple(),
            'joonistamine': () => this.renderDrawingCanvas(),
            'interaktiivne': () => this.renderImageUpload(),
            'keemia_tasakaalustamine': () => this.renderChemistryBalance(),
            'keemia_ahelad': () => this.renderChemistryChains()
        };

        const renderer = renderers[value];
        if (renderer) {
            renderer();
            
            // Add save button after rendering
            setTimeout(() => {
                const saveButton = this.createAddButton('Salvesta Quiz');
                saveButton.style.background = '#2196F3';
                saveButton.addEventListener('click', () => {
                    const quizData = this.collectQuizData();
                    this.saveQuiz(quizData);
                });
                previewContent.appendChild(saveButton);
            }, 100);
        } else {
            previewContent.innerHTML = '<p>Vali vastuse tüüp, et näha eelvaadet.</p>';
        }
    }

    renderSingleChoice() {
        const container = this.createContainer('Ühe õige vastuse valik:');
        const optionsContainer = this.createElement('div', 'options-container', 'single-options');
        
        // Add initial options
        optionsContainer.appendChild(this.createSingleOption(0, 'Sisesta vastus 1'));
        optionsContainer.appendChild(this.createSingleOption(1, 'Sisesta vastus 2'));
        
        container.appendChild(optionsContainer);
        container.appendChild(this.createAddButton('Lisa vastus', 'add-single-option'));
        
        document.getElementById('preview-content').appendChild(container);
    }

    renderMultipleChoice() {
        const container = this.createContainer('Mitu õiget vastust (checkboxid):');
        const optionsContainer = this.createElement('div', 'options-container', 'multiple-options');
        
        // Add initial options
        optionsContainer.appendChild(this.createMultipleOption(0, 'Sisesta vastus 1'));
        optionsContainer.appendChild(this.createMultipleOption(1, 'Sisesta vastus 2'));
        
        container.appendChild(optionsContainer);
        container.appendChild(this.createAddButton('Lisa vastus', 'add-multiple-option'));
        
        document.getElementById('preview-content').appendChild(container);
    }

    renderShortText() {
        const container = this.createContainer('Lühike tekstivastus:');
        const input = this.createElement('input');
        input.type = 'text';
        input.placeholder = 'Sisesta vastus';
        input.style.cssText = 'width: 100%; padding: 8px; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px;';
        
        container.appendChild(input);
        document.getElementById('preview-content').appendChild(container);
    }

    renderLongText() {
        const container = this.createContainer('Pikk tekstivastus:');
        const textarea = this.createElement('textarea');
        textarea.placeholder = 'Sisesta vastus';
        textarea.rows = 5;
        textarea.style.cssText = 'width: 100%; padding: 8px; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; resize: vertical;';
        
        container.appendChild(textarea);
        document.getElementById('preview-content').appendChild(container);
    }

    renderMatrixSingle() {
        const container = this.createContainer('Maatriks - üks õige vastus reas:');
        
        const controls = this.createElement('div', 'matrix-controls');
        controls.style.marginBottom = '10px';
        controls.appendChild(this.createAddButton('Lisa rida', 'add-matrix-row-single'));
        controls.appendChild(this.createAddButton('Lisa veerg', 'add-matrix-column-single'));
        
        const matrixContainer = this.createElement('div', 'matrix-container', 'matrix-single');
        const table = this.createMatrixTable('single');
        matrixContainer.appendChild(table);
        
        container.appendChild(controls);
        container.appendChild(matrixContainer);
        document.getElementById('preview-content').appendChild(container);
    }

    renderMatrixMultiple() {
        const container = this.createContainer('Maatriks - mitu õiget vastust reas:');
        
        const controls = this.createElement('div', 'matrix-controls');
        controls.style.marginBottom = '10px';
        controls.appendChild(this.createAddButton('Lisa rida', 'add-matrix-row-multiple'));
        controls.appendChild(this.createAddButton('Lisa veerg', 'add-matrix-column-multiple'));
        
        const matrixContainer = this.createElement('div', 'matrix-container', 'matrix-multiple');
        const table = this.createMatrixTable('multiple');
        matrixContainer.appendChild(table);
        
        container.appendChild(controls);
        container.appendChild(matrixContainer);
        document.getElementById('preview-content').appendChild(container);
    }

    renderImageUpload() {
        const container = this.createContainer('Interaktiivne pilt:');
        
        const uploadArea = this.createElement('div', 'image-upload-area');
        uploadArea.style.cssText = 'border: 2px dashed #ccc; padding: 20px; text-align: center; margin-bottom: 10px; border-radius: 4px;';
        
        const fileInput = this.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'image-upload';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (e) => this.handleImageUpload(e.target));
        
        const preview = this.createElement('div', '', 'image-preview');
        preview.style.marginBottom = '10px';
        preview.innerHTML = `
            <p>Lohista pilt siia või kliki pildi lisamiseks</p>
        `;
        
        const selectButton = this.createAddButton('Vali pilt');
        selectButton.addEventListener('click', () => fileInput.click());
        preview.appendChild(selectButton);
        
        const hotspotControls = this.createElement('div', '', 'hotspot-controls');
        hotspotControls.style.display = 'none';
        hotspotControls.innerHTML = `
            <p>Kliki pildil, et lisada vastusevariante:</p>
            <div id="hotspot-list"></div>
        `;
        
        uploadArea.appendChild(fileInput);
        uploadArea.appendChild(preview);
        container.appendChild(uploadArea);
        container.appendChild(hotspotControls);
        document.getElementById('preview-content').appendChild(container);
    }

    renderDrawingCanvas() {
        const container = this.createContainer('Joonistamise ala:');
        
        const controls = this.createElement('div', 'drawing-controls');
        controls.style.cssText = 'margin-bottom: 10px; display: flex; gap: 10px; align-items: center;';
        
        const clearButton = this.createAddButton('Puhasta');
        clearButton.addEventListener('click', () => this.clearCanvas());
        
        const colorInput = this.createElement('input');
        colorInput.type = 'color';
        colorInput.id = 'drawing-color';
        colorInput.value = '#000000';
        colorInput.title = 'Vali värv';
        
        const brushSize = this.createElement('input');
        brushSize.type = 'range';
        brushSize.id = 'brush-size';
        brushSize.min = '1';
        brushSize.max = '20';
        brushSize.value = '3';
        brushSize.title = 'Pintsli suurus';
        
        controls.appendChild(clearButton);
        controls.appendChild(colorInput);
        controls.appendChild(brushSize);
        
        const canvas = this.createElement('canvas', '', 'drawing-canvas');
        canvas.width = 500;
        canvas.height = 300;
        canvas.style.cssText = 'border: 1px solid #ccc; cursor: crosshair; display: block;';
        
        container.appendChild(controls);
        container.appendChild(canvas);
        document.getElementById('preview-content').appendChild(container);
        
        // Initialize drawing after DOM is updated
        setTimeout(() => this.initializeDrawing(), 100);
    }

    renderChemistryBalance() {
        const container = this.createContainer('Keemia tasakaalustamine:');
        
        const equationContainer = this.createElement('div', 'chemistry-equation');
        equationContainer.style.cssText = 'background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;';
        
        // Input field for chemistry equation
        const inputField = this.createElement('textarea');
        inputField.id = 'chemistry-input-field';
        inputField.placeholder = 'Sisesta keemiline võrrand...';
        inputField.style.cssText = `
            width: 100%; 
            padding: 12px; 
            font-size: 16px; 
            border: 2px solid #ddd; 
            border-radius: 8px; 
            resize: none; 
            min-height: 60px; 
            font-family: 'Courier New', monospace;
            margin-bottom: 15px;
            overflow: hidden;
            text-transform: uppercase;
        `;
        
        // Chemistry keyboard container
        const keyboardContainer = this.createElement('div', '', 'chemistry-keyboard');
        keyboardContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 4px;
            margin-bottom: 15px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 8px;
            border: 1px solid #ddd;
        `;
        
        equationContainer.appendChild(inputField);
        equationContainer.appendChild(keyboardContainer);

        
        container.appendChild(equationContainer);
        document.getElementById('preview-content').appendChild(container);
        
        // Initialize chemistry keyboard after DOM is ready
        setTimeout(() => {
            const inputFieldObj = new InputField(inputField);
            const chemistryKeyboard = new ChemistryKeyboard(keyboardContainer, inputFieldObj);
            
            // Auto-resize textarea
            inputField.addEventListener("input", () => {
                inputField.style.height = "auto";
                inputField.style.height = inputField.scrollHeight + "px";
            });
            
            // Prevent regular keyboard input and paste
            document.addEventListener('keydown', (event) => {
                if (event.target.id === 'chemistry-input-field') return;
                const validKeys = /^[a-zA-Z0-9+\-/*=() ]$/;
                if (validKeys.test(event.key)) {
                    event.preventDefault();
                    inputFieldObj.append(event.key);
                }
            });
            
            document.addEventListener('paste', (e) => {
                if (e.target.id === 'chemistry-input-field') {
                    e.preventDefault();
                    alert('Kleepimine on keelatud.');
                }
            });
        }, 100);
    }

    renderChemistryChains() {
        const container = this.createContainer('Keemia ahelad:');
        
        const chainBuilder = this.createElement('div', 'chemistry-chains');
        chainBuilder.style.cssText = 'background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;';
        
        const chainType = this.createElement('div', 'chain-type-selector');
        chainType.style.cssText = 'margin-bottom: 15px;';
        chainType.innerHTML = `
            <label style="font-weight: bold; display: block; margin-bottom: 8px;">Ahela tüüp:</label>
            <select id="chain-type" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                <option value="alkaan">Alkaanid</option>
                <option value="alkeen">Alkeenid</option>
                <option value="alkiin">Alkiinid</option>
                <option value="tsukloalkaan">Tsükloalkaanid</option>
                <option value="aromaatne">Aromaatsed ühendid</option>
            </select>
        `;
        
        const chainLength = this.createElement('div', 'chain-length');
        chainLength.style.cssText = 'margin-bottom: 15px;';
        chainLength.innerHTML = `
            <label style="font-weight: bold; display: block; margin-bottom: 8px;">Süsinike arv:</label>
            <input type="number" id="carbon-count" min="1" max="20" value="4" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 100px;" />
        `;
        
        const functionalGroups = this.createElement('div', 'functional-groups');
        functionalGroups.style.cssText = 'margin-bottom: 15px;';
        functionalGroups.innerHTML = `
            <label style="font-weight: bold; display: block; margin-bottom: 8px;">Funktsionaalsed rühmad:</label>
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                <label><input type="checkbox" value="OH"> Hüdroksüül (-OH)</label>
                <label><input type="checkbox" value="COOH"> Karboksüül (-COOH)</label>
                <label><input type="checkbox" value="NH2"> Amino (-NH₂)</label>
                <label><input type="checkbox" value="CHO"> Aldehüüd (-CHO)</label>
                <label><input type="checkbox" value="CO"> Ketoon (=O)</label>
            </div>
        `;
        
        const generateButton = this.createAddButton('Genereeri struktuur');
        generateButton.style.background = '#FF9800';
        
        const structureArea = this.createElement('div', 'structure-display');
        structureArea.style.cssText = 'margin-top: 15px; padding: 20px; background: white; border: 1px solid #ddd; border-radius: 4px; min-height: 150px; text-align: center;';
        structureArea.innerHTML = '<p style="color: #666; margin: 0;">Struktuuri valem ja nimetus ilmuvad siia...</p>';
        
        const answerSection = this.createElement('div', 'chain-answer');
        answerSection.style.cssText = 'margin-top: 15px; padding: 15px; background: #e8f5e8; border-radius: 4px;';
        answerSection.innerHTML = `
            <label style="font-weight: bold; display: block; margin-bottom: 8px;">Õige vastus:</label>
            <input type="text" placeholder="Sisesta ühendi nimi" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 8px;" />
            <input type="text" placeholder="Sisesta molekulvalem" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
        `;
        
        chainBuilder.appendChild(chainType);
        chainBuilder.appendChild(chainLength);
        chainBuilder.appendChild(functionalGroups);
        chainBuilder.appendChild(generateButton);
        chainBuilder.appendChild(structureArea);
        chainBuilder.appendChild(answerSection);
        
        container.appendChild(chainBuilder);
        document.getElementById('preview-content').appendChild(container);
    }

    // Helper methods
    createContainer(labelText) {
        const container = this.createElement('div', 'answer-type-container');
        const label = this.createElement('label');
        label.style.cssText = 'font-weight: bold; margin-bottom: 10px; display: block;';
        label.textContent = labelText;
        container.appendChild(label);
        return container;
    }

    createElement(tag, className = '', id = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (id) element.id = id;
        return element;
    }

    createAddButton(text, dataAction = '') {
        const button = this.createElement('button', 'add-btn');
        button.type = 'button';
        button.textContent = `+ ${text}`;
        button.style.cssText = 'margin: 5px; padding: 8px 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;';
        if (dataAction) button.setAttribute('data-action', dataAction);
        return button;
    }

    createSingleOption(index, placeholder) {
        const row = this.createElement('div', 'option-row');
        row.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px; gap: 10px;';
        
        row.innerHTML = `
            <input type="radio" name="single-choice" id="single${index + 1}" />
            <input type="text" placeholder="${placeholder}" class="option-input" style="flex: 1; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" />
            <input type="radio" name="correct-single" value="${index}" title="Märgi õigeks" />
            <span class="correct-label">Õige</span>
            <button type="button" class="remove-btn" style="background: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px;">×</button>
        `;
        
        return row;
    }

    createMultipleOption(index, placeholder) {
        const row = this.createElement('div', 'option-row');
        row.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px; gap: 10px;';
        
        row.innerHTML = `
            <input type="checkbox" name="multiple-choice" id="multi${index + 1}" />
            <input type="text" placeholder="${placeholder}" class="option-input" style="flex: 1; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" />
            <input type="checkbox" name="correct-multiple" value="${index}" title="Märgi õigeks" />
            <span class="correct-label">Õige</span>
            <button type="button" class="remove-btn" style="background: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px;">×</button>
        `;
        
        return row;
    }

    createMatrixTable(type) {
        const table = this.createElement('table', 'matrix-table');
        table.style.cssText = 'border-collapse: collapse; width: 100%; margin-top: 10px;';
        
        const thead = this.createElement('thead');
        const headerRow = this.createElement('tr');
        
        headerRow.innerHTML = `
            <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5;"></th>
            <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5;">
                <input type="text" placeholder="Veerg 1" class="matrix-header" style="border: none; background: transparent; width: 100%;" />
            </th>
            <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5;">
                <input type="text" placeholder="Veerg 2" class="matrix-header" style="border: none; background: transparent; width: 100%;" />
            </th>
            <th style="border: 1px solid #ccc; padding: 8px; background: #f5f5f5;">
                <button type="button" class="remove-btn matrix-col-remove" style="background: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px;">×</button>
            </th>
        `;
        
        const tbody = this.createElement('tbody');
        tbody.appendChild(this.createMatrixRow(0, 2, type));
        tbody.appendChild(this.createMatrixRow(1, 2, type));
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        table.appendChild(tbody);
        
        return table;
    }

    createMatrixRow(rowIndex, colCount, type) {
        const row = this.createElement('tr');
        let rowHTML = `<td style="border: 1px solid #ccc; padding: 8px;">
            <input type="text" placeholder="Rida ${rowIndex + 1}" class="matrix-row-label" style="border: none; width: 100%;" />
        </td>`;
        
        const inputType = type === 'single' ? 'radio' : 'checkbox';
        const nameAttr = type === 'single' ? `matrix-row-${rowIndex}` : `matrix-row-${rowIndex}`;
        
        for (let i = 0; i < colCount; i++) {
            rowHTML += `<td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
                <input type="${inputType}" name="${nameAttr}" value="${i}" />
            </td>`;
        }
        
        rowHTML += `<td style="border: 1px solid #ccc; padding: 8px; text-align: center;">
            <button type="button" class="remove-btn matrix-row-remove" style="background: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px;">×</button>
        </td>`;
        
        row.innerHTML = rowHTML;
        return row;
    }

    // Event handlers
    handleAddButton(button) {
        const action = button.getAttribute('data-action') || button.textContent.toLowerCase();
        
        if (action.includes('single-option') || button.closest('.answer-type-container')?.querySelector('#single-options')) {
            this.addSingleOption();
        } else if (action.includes('multiple-option') || button.closest('.answer-type-container')?.querySelector('#multiple-options')) {
            this.addMultipleOption();
        } else if (action.includes('matrix-row-single')) {
            this.addMatrixRow('single');
        } else if (action.includes('matrix-column-single')) {
            this.addMatrixColumn('single');
        } else if (action.includes('matrix-row-multiple')) {
            this.addMatrixRow('multiple');
        } else if (action.includes('matrix-column-multiple')) {
            this.addMatrixColumn('multiple');
        }
    }

    removeOption(button) {
        if (button.classList.contains('matrix-row-remove')) {
            this.removeMatrixRow(button);
        } else if (button.classList.contains('matrix-col-remove')) {
            this.removeMatrixColumn(button);
        } else {
            button.closest('.option-row').remove();
        }
    }

    addSingleOption() {
        const container = document.getElementById('single-options');
        if (!container) return;
        
        const optionCount = container.children.length;
        const newOption = this.createSingleOption(optionCount, `Sisesta vastus ${optionCount + 1}`);
        container.appendChild(newOption);
    }

    addMultipleOption() {
        const container = document.getElementById('multiple-options');
        if (!container) return;
        
        const optionCount = container.children.length;
        const newOption = this.createMultipleOption(optionCount, `Sisesta vastus ${optionCount + 1}`);
        container.appendChild(newOption);
    }

    addMatrixRow(type) {
        const selector = type === 'single' ? '#matrix-single tbody' : '#matrix-multiple tbody';
        const tbody = document.querySelector(selector);
        if (!tbody) return;
        
        const rowCount = tbody.children.length;
        const colCount = document.querySelectorAll(`${selector.replace('tbody', 'thead')} th`).length - 2;
        
        const newRow = this.createMatrixRow(rowCount, colCount, type);
        tbody.appendChild(newRow);
    }

    addMatrixColumn(type) {
        const selector = type === 'single' ? '#matrix-single' : '#matrix-multiple';
        const table = document.querySelector(`${selector} table`);
        if (!table) return;
        
        const thead = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');
        const colCount = thead.children.length - 2;
        
        // Add header
        const newHeader = this.createElement('th');
        newHeader.style.cssText = 'border: 1px solid #ccc; padding: 8px; background: #f5f5f5;';
        newHeader.innerHTML = `<input type="text" placeholder="Veerg ${colCount + 1}" class="matrix-header" style="border: none; background: transparent; width: 100%;" />`;
        thead.insertBefore(newHeader, thead.lastElementChild);
        
        // Add cells to existing rows
        const inputType = type === 'single' ? 'radio' : 'checkbox';
        tbody.querySelectorAll('tr').forEach((row, rowIndex) => {
            const newCell = this.createElement('td');
            newCell.style.cssText = 'border: 1px solid #ccc; padding: 8px; text-align: center;';
            newCell.innerHTML = `<input type="${inputType}" name="matrix-row-${rowIndex}" value="${colCount}" />`;
            row.insertBefore(newCell, row.lastElementChild);
        });
    }

    removeMatrixRow(button) {
        const row = button.closest('tr');
        if (row) row.remove();
    }

    removeMatrixColumn(button) {
        const table = button.closest('table');
        const headerRow = button.closest('tr');
        const colIndex = Array.from(headerRow.children).indexOf(button.closest('th'));
        
        // Remove header
        button.closest('th').remove();
        
        // Remove corresponding cells from all rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            if (row.children[colIndex]) {
                row.children[colIndex].remove();
            }
        });
    }

    // Image upload methods
    handleImageUpload(input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `
                <img id="uploaded-image" src="${e.target.result}" 
                     style="max-width: 100%; max-height: 400px; position: relative; cursor: crosshair;" />
                <div style="margin-top: 10px;">
                    <button type="button" class="add-btn">Vaheta pilti</button>
                </div>
            `;
            
            // Add click handler for hotspots
            const img = preview.querySelector('#uploaded-image');
            img.addEventListener('click', (event) => this.addHotspot(event));
            
            // Add handler for change image button
            preview.querySelector('.add-btn').addEventListener('click', () => input.click());
            
            document.getElementById('hotspot-controls').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    addHotspot(event) {
        const img = event.target;
        const rect = img.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((event.clientY - rect.top) / rect.height * 100).toFixed(1);
        
        const hotspotList = document.getElementById('hotspot-list');
        const hotspotCount = hotspotList.children.length + 1;
        
        const hotspotDiv = this.createElement('div', 'hotspot-item');
        hotspotDiv.style.cssText = 'margin: 5px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; gap: 10px;';
        hotspotDiv.innerHTML = `
            <strong>Punkt ${hotspotCount}</strong> (${x}%, ${y}%)
            <input type="text" placeholder="Sisesta vastus" style="padding: 4px; border: 1px solid #ccc; border-radius: 4px;" />
            <label style="display: flex; align-items: center; gap: 5px;">
                <input type="checkbox" title="Õige vastus" />
                <span>Õige</span>
            </label>
            <button type="button" class="remove-btn" style="background: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px;">×</button>
        `;
        
        hotspotList.appendChild(hotspotDiv);
        
        // Add visual marker on image
        this.addImageMarker(img, x, y, hotspotCount);
    }

    addImageMarker(img, x, y, number) {
        const marker = this.createElement('div');
        marker.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: 24px;
            height: 24px;
            background: #f44336;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            transform: translate(-50%, -50%);
            z-index: 10;
            pointer-events: none;
        `;
        marker.textContent = number;
        
        img.parentElement.style.position = 'relative';
        img.parentElement.appendChild(marker);
    }

    // Drawing canvas methods
    initializeDrawing() {
        const canvas = document.getElementById('drawing-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        
        const startDrawing = (e) => {
            isDrawing = true;
            [lastX, lastY] = this.getMousePos(canvas, e);
        };
        
        const draw = (e) => {
            if (!isDrawing) return;
            
            const [currentX, currentY] = this.getMousePos(canvas, e);
            const color = document.getElementById('drawing-color')?.value || '#000000';
            const size = document.getElementById('brush-size')?.value || 3;
            
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            
            [lastX, lastY] = [currentX, currentY];
        };
        
        const stopDrawing = () => {
            isDrawing = false;
        };
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        });
    }

    getMousePos(canvas, e) {
        const rect = canvas.getBoundingClientRect();
        return [
            e.clientX - rect.left,
            e.clientY - rect.top
        ];
    }

    clearCanvas() {
        const canvas = document.getElementById('drawing-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

// Initialize the quiz builder
const quizBuilder = new QuizBuilder();

// Legacy function support (if needed)
window.closeDropdown = () => {
    const dropdown = document.getElementById('answer-type-dropdown');
    if (dropdown) {
        dropdown.classList.remove('open');
    }
};

// Export for external use if needed
window.QuizBuilder = QuizBuilder;