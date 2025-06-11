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
        return fetch('http://localhost:3006/test/upload', {
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
        // Build the quiz payload as expected by the API
        const quizData = {
        name: "Temporary Test Name",              // Replace with actual test title if available
        descripion: "Temporary Description",        // Note the MD typo ("descripion")
        start: new Date().toISOString(),             // In a real system, use a proper start date/time
        end: new Date().toISOString(),               // In a real system, use a proper end date/time
        timelimit: 60,                               // Can be dynamic if needed
        block: [
            {
            blockNumber: 1,
            blockQuestions: []
            }
        ]
        };
        quizData.type = this.getCurrentQuizType();
        quizData.content = {};

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
            case 'interaktiivne':
                // For an interactive picture, collect the uploaded image's data URL.
                const imgElem = document.getElementById("uploaded-image");
                if (imgElem) {
                    quizData.content.imageData = imgElem.src;
                }
                break;
            case 'joonistamine':
                // For drawings, obtain the canvas data URL (assuming canvas with id "drawing-canvas").
                const drawingCanvas = document.getElementById("drawing-canvas");
                if (drawingCanvas) {
                    quizData.content.drawingData = drawingCanvas.toDataURL();
                }
                break;    
            }
        // Collect question-specific data.
        const questionTextElem = document.getElementById("question-text");
        const questionText = questionTextElem ? questionTextElem.value.trim() : "";
        if (!questionText) {
        alert("Palun sisesta küsimuse tekst!");
        return null;
        }
        // Points for this question (defaulting to 0 if none provided)
        const pointsElem = document.getElementById("points-input");
        const points = pointsElem ? pointsElem.value.trim() : "0";

        // Determine answer type from the dropdown.
        const dropdown = document.getElementById("dropdown-selected");
        const answerType = dropdown && dropdown.querySelector("span")
        ? dropdown.querySelector("span").dataset.value || "luhike-tekst"
        : "luhike-tekst";

        // Gather answer variables based on answer type.
        let answerVariables = [];
        if (answerType === "uks-oige") {
        const optionRows = document.querySelectorAll("#single-options .option-row");
        optionRows.forEach(row => {
            const optText = row.querySelector(".option-input") ? row.querySelector(".option-input").value.trim() : "";
            const isCorrect = row.querySelector('input[name="correct-single"]:checked') !== null;
            answerVariables.push({ answer: optText, correct: isCorrect });
        });
        } else if (answerType === "mitu-oiget") {
        const optionRows = document.querySelectorAll("#multiple-options .option-row");
        optionRows.forEach(row => {
            const optText = row.querySelector(".option-input") ? row.querySelector(".option-input").value.trim() : "";
            const isCorrect = row.querySelector('input[name="correct-multiple"]:checked') !== null;
            answerVariables.push({ answer: optText, correct: isCorrect });
        });
        } else {
        // For text or similar answer types, attempt to get the answer from preview input/textarea.
        const answerInput = document.querySelector("#preview-content input, #preview-content textarea");
        if (answerInput) {
            answerVariables.push({ answer: answerInput.value.trim(), correct: true });
        }
        }

        // Add the question to the quiz block.
        quizData.block[0].blockQuestions.push({
        question: questionText,
        points: parseInt(points),
        answerType: this.getAnswerTypeCode(answerType),
        answerVariables: answerVariables
        });

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
            this.setupQuestionImageUpload();
        });
    }

    // Lisa see kood QuizBuilder klassi sisse, näiteks init() meetodi järele

setupQuestionImageUpload() {
    // Otsime küsimuse pildi üleslaadimise elementi
    const uploadPicDiv = document.querySelector('.upload-pic');
    if (!uploadPicDiv) return;

    // Loome peidetud file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.id = 'question-image-upload';
    
    // Lisame file inputi DOM-i
    document.body.appendChild(fileInput);
    
    // Lisame click event uploadPicDiv-ile
    uploadPicDiv.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change event
    fileInput.addEventListener('change', (e) => {
        this.handleQuestionImageUpload(e.target);
    });
}

handleQuestionImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    const uploadPicDiv = document.querySelector('.upload-pic');
    if (!uploadPicDiv) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        // Asendame upload-pic sisu pildiga
        uploadPicDiv.innerHTML = `
            <div style="position: relative; display: inline-block;">
                <img src="${e.target.result}" 
                     style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 2px solid #ddd;" 
                     alt="Küsimuse pilt" />
                <button type="button" 
                        style="position: absolute; top: 5px; right: 5px; background: #f44336; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 12px;"
                        title="Eemalda pilt"
                        onclick="this.closest('.upload-pic').innerHTML = '<p>Lisa pilt küsimuse juurde</p>'; document.getElementById('question-image-upload').value = '';">
                    ×
                </button>
                <div style="margin-top: 8px;">
                    <button type="button" 
                            style="padding: 6px 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;"
                            onclick="document.getElementById('question-image-upload').click();">
                        Vaheta pilti
                    </button>
                </div>
            </div>
        `;
    };
    reader.readAsDataURL(file);
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
        const container = this.createContainer('Keemia ahelad - joonistamine:');
        
        // Drawing controls
        const controls = this.createElement('div', 'chemistry-drawing-controls');
        controls.style.cssText = 'margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 8px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;';
        
        // Shape buttons
        const shapeButtons = [
            { text: 'Joon', action: 'line' },
            { text: 'Topeltjoon', action: 'doubleLine' },
            { text: 'Kolmikjoon', action: 'tripleLine' },
            { text: 'Kuusnurk', action: 'hexagon' },
            { text: 'Märgistatud kuusnurk', action: 'labeledHexagon' },
            { text: 'Tekst', action: 'text' }
        ];
        
        shapeButtons.forEach(shape => {
            const button = this.createAddButton(shape.text);
            button.addEventListener('click', () => {
                if (window.chemistryDrawingTool) {
                    window.chemistryDrawingTool.addShape(shape.action);
                }
            });
            controls.appendChild(button);
        });
        
        // Action buttons
        const actionButtonsDiv = this.createElement('div');
        actionButtonsDiv.style.cssText = 'display: flex; gap: 10px; margin-top: 10px;';
        
        const undoBtn = this.createAddButton('Undo (Z)');
        undoBtn.style.background = '#ff9800';
        undoBtn.addEventListener('click', () => {
            if (window.chemistryDrawingTool) {
                window.chemistryDrawingTool.undo();
            }
        });
        
        const redoBtn = this.createAddButton('Redo (Y)');
        redoBtn.style.background = '#ff9800';
        redoBtn.addEventListener('click', () => {
            if (window.chemistryDrawingTool) {
                window.chemistryDrawingTool.redo();
            }
        });
        
        const deleteBtn = this.createAddButton('Kustuta valitud (Del)');
        deleteBtn.style.background = '#f44336';
        deleteBtn.addEventListener('click', () => {
            if (window.chemistryDrawingTool) {
                window.chemistryDrawingTool.deleteSelected();
            }
        });
        
        const clearBtn = this.createAddButton('Puhasta kõik');
        clearBtn.style.background = '#f44336';
        clearBtn.addEventListener('click', () => {
            if (window.chemistryDrawingTool && confirm('Kas oled kindel, et soovid kõik kustutada?')) {
                window.chemistryDrawingTool.deleteAll();
            }
        });
        
        actionButtonsDiv.appendChild(undoBtn);
        actionButtonsDiv.appendChild(redoBtn);
        actionButtonsDiv.appendChild(deleteBtn);
        actionButtonsDiv.appendChild(clearBtn);
        
        // Instructions
        const instructions = this.createElement('div', 'instructions');
        instructions.style.cssText = 'margin-top: 10px; padding: 10px; background: #e3f2fd; border-radius: 4px; font-size: 14px;';
        instructions.innerHTML = `
            <strong>Juhised:</strong><br>
            • Kliki kujundile, et see valida<br>
            • Lohista valitud kujundit<br>
            • Kasuta nooleklahve üles/alla, et pöörata valitud kujundit<br>
            • Topeltkliki tekstil, et seda muuta<br>
            • Delete/Backspace kustutab valitud kujundi
        `;
        
        controls.appendChild(actionButtonsDiv);
        controls.appendChild(instructions);
        
        // Canvas
        const canvasContainer = this.createElement('div', 'canvas-container');
        canvasContainer.style.cssText = 'border: 2px solid #ddd; border-radius: 8px; padding: 10px; background: white;';
        
        const canvas = this.createElement('canvas', '', 'chemistry-drawing-canvas');
        canvas.width = 800;
        canvas.height = 500;
        canvas.style.cssText = 'border: 1px solid #ccc; cursor: pointer; display: block; background: white;';
        
        canvasContainer.appendChild(canvas);
        container.appendChild(controls);
        container.appendChild(canvasContainer);
        document.getElementById('preview-content').appendChild(container);
        
        // Initialize drawing tool after DOM is ready
        setTimeout(() => {
            window.chemistryDrawingTool = new DrawingTool(canvas);
        }, 100);
    }
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
    table.dataset.type = type; // Store type for reference
    
    const thead = this.createElement('thead');
    const headerRow = this.createElement('tr', 'matrix-header-row');
    
    // Empty corner cell
    const cornerCell = this.createElement('th');
    cornerCell.style.cssText = 'border: 1px solid #ccc; padding: 8px; background: #f5f5f5; min-width: 100px;';
    headerRow.appendChild(cornerCell);
    
    // Add initial columns with remove buttons
    for (let i = 0; i < 2; i++) {
        const th = this.createElement('th');
        th.style.cssText = 'border: 1px solid #ccc; padding: 8px; background: #f5f5f5; position: relative; min-width: 120px;';
        
        const input = this.createElement('input');
        input.type = 'text';
        input.placeholder = `Veerg ${i + 1}`;
        input.className = 'matrix-header';
        input.style.cssText = 'border: none; background: transparent; width: calc(100% - 25px);';
        
        const removeBtn = this.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-btn matrix-col-remove';
        removeBtn.innerHTML = '×';
        removeBtn.style.cssText = 'background: #f44336; color: white; border: none; padding: 2px 6px; border-radius: 3px; font-size: 12px; position: absolute; right: 4px; top: 50%; transform: translateY(-50%); cursor: pointer;';
        
        th.appendChild(input);
        th.appendChild(removeBtn);
        headerRow.appendChild(th);
    }
    
    // Actions column header
    const actionsHeader = this.createElement('th');
    actionsHeader.style.cssText = 'border: 1px solid #ccc; padding: 8px; background: #f5f5f5; width: 50px;';
    actionsHeader.textContent = 'Tegevused';
    headerRow.appendChild(actionsHeader);
    
    const tbody = this.createElement('tbody');
    tbody.appendChild(this.createMatrixRow(0, 2, type));
    tbody.appendChild(this.createMatrixRow(1, 2, type));
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    table.appendChild(tbody);
    
    return table;
}

createMatrixRow(rowIndex, colCount, type) {
    const row = this.createElement('tr', 'matrix-row');
    row.dataset.rowIndex = rowIndex;
    
    // Row label cell
    const labelCell = this.createElement('td');
    labelCell.style.cssText = 'border: 1px solid #ccc; padding: 8px;';
    
    const labelInput = this.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = `Rida ${rowIndex + 1}`;
    labelInput.className = 'matrix-row-label';
    labelInput.style.cssText = 'border: none; width: 100%;';
    
    labelCell.appendChild(labelInput);
    row.appendChild(labelCell);
    
    // Input cells
    const inputType = type === 'single' ? 'radio' : 'checkbox';
    
    for (let i = 0; i < colCount; i++) {
        const cell = this.createElement('td', 'matrix-cell');
        cell.style.cssText = 'border: 1px solid #ccc; padding: 8px; text-align: center;';
        cell.dataset.colIndex = i;
        
        const input = this.createElement('input');
        input.type = inputType;
        if (type === 'single') {
            input.name = `matrix-row-${rowIndex}`;
        } else {
            input.name = `matrix-row-${rowIndex}-col-${i}`;
        }
        input.value = i;
        
        cell.appendChild(input);
        row.appendChild(cell);
    }
    
    // Remove button cell
    const removeCell = this.createElement('td');
    removeCell.style.cssText = 'border: 1px solid #ccc; padding: 8px; text-align: center;';
    
    const removeBtn = this.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn matrix-row-remove';
    removeBtn.innerHTML = '×';
    removeBtn.style.cssText = 'background: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;';
    
    removeCell.appendChild(removeBtn);
    row.appendChild(removeCell);
    
    return row;
}

removeMatrixColumn(button) {
    const table = button.closest('table');
    const th = button.closest('th');
    const headerRow = th.parentNode;
    const colIndex = Array.from(headerRow.children).indexOf(th) - 1; // -1 for corner cell
    
    if (colIndex < 0) return; // Safety check
    
    // Don't allow removal if only one column remains
    const totalColumns = headerRow.children.length - 2; // -2 for corner and actions columns
    if (totalColumns <= 1) {
        alert('Vähemalt üks veerg peab jääma!');
        return;
    }
    
    // Remove header
    th.remove();
    
    // Remove corresponding cells from all rows
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td.matrix-cell');
        if (cells[colIndex]) {
            cells[colIndex].remove();
        }
    });
    
    // Update remaining cell indices and input names
    this.updateMatrixCellIndices(table);
}

removeMatrixRow(button) {
    const table = button.closest('table');
    const row = button.closest('tr');
    const tbody = table.querySelector('tbody');
    
    // Don't allow removal if only one row remains
    if (tbody.children.length <= 1) {
        alert('Vähemalt üks rida peab jääma!');
        return;
    }
    
    row.remove();
    
    // Update row indices and input names
    this.updateMatrixRowIndices(table);
}

updateMatrixCellIndices(table) {
    const type = table.dataset.type;
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach((row, rowIndex) => {
        row.dataset.rowIndex = rowIndex;
        const cells = row.querySelectorAll('td.matrix-cell');
        
        cells.forEach((cell, colIndex) => {
            cell.dataset.colIndex = colIndex;
            const input = cell.querySelector('input');
            
            if (type === 'single') {
                input.name = `matrix-row-${rowIndex}`;
            } else {
                input.name = `matrix-row-${rowIndex}-col-${colIndex}`;
            }
            input.value = colIndex;
        });
        
        // Update row label placeholder
        const labelInput = row.querySelector('.matrix-row-label');
        if (labelInput && !labelInput.value) {
            labelInput.placeholder = `Rida ${rowIndex + 1}`;
        }
    });
}

updateMatrixRowIndices(table) {
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        row.dataset.rowIndex = index;
        const labelInput = row.querySelector('.matrix-row-label');
        if (labelInput && !labelInput.value) {
            labelInput.placeholder = `Rida ${index + 1}`;
        }
        
        // Update input names
        const type = table.dataset.type;
        const inputs = row.querySelectorAll('td.matrix-cell input');
        inputs.forEach((input, colIndex) => {
            if (type === 'single') {
                input.name = `matrix-row-${index}`;
            } else {
                input.name = `matrix-row-${index}-col-${colIndex}`;
            }
        });
    });
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
    const selector = type === 'single' ? '#matrix-single table' : '#matrix-multiple table';
    const table = document.querySelector(selector);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rowCount = tbody.children.length;
    const colCount = table.querySelectorAll('thead th').length - 2; // -2 for corner and actions columns
    
    const newRow = this.createMatrixRow(rowCount, colCount, type);
    tbody.appendChild(newRow);
}

addMatrixColumn(type) {
    const selector = type === 'single' ? '#matrix-single table' : '#matrix-multiple table';
    const table = document.querySelector(selector);
    if (!table) return;
    
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    const currentColCount = thead.children.length - 2; // -2 for corner and actions columns
    
    // Add header before the actions column
    const newHeader = this.createElement('th');
    newHeader.style.cssText = 'border: 1px solid #ccc; padding: 8px; background: #f5f5f5; position: relative; min-width: 120px;';
    
    const input = this.createElement('input');
    input.type = 'text';
    input.placeholder = `Veerg ${currentColCount + 1}`;
    input.className = 'matrix-header';
    input.style.cssText = 'border: none; background: transparent; width: calc(100% - 25px);';
    
    const removeBtn = this.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn matrix-col-remove';
    removeBtn.innerHTML = '×';
    removeBtn.style.cssText = 'background: #f44336; color: white; border: none; padding: 2px 6px; border-radius: 3px; font-size: 12px; position: absolute; right: 4px; top: 50%; transform: translateY(-50%); cursor: pointer;';
    
    newHeader.appendChild(input);
    newHeader.appendChild(removeBtn);
    
    // Insert before the last column (actions column)
    thead.insertBefore(newHeader, thead.lastElementChild);
    
    // Add cells to existing rows
    const inputType = type === 'single' ? 'radio' : 'checkbox';
    tbody.querySelectorAll('tr').forEach((row, rowIndex) => {
        const newCell = this.createElement('td', 'matrix-cell');
        newCell.style.cssText = 'border: 1px solid #ccc; padding: 8px; text-align: center;';
        newCell.dataset.colIndex = currentColCount;
        
        const input = this.createElement('input');
        input.type = inputType;
        if (type === 'single') {
            input.name = `matrix-row-${rowIndex}`;
        } else {
            input.name = `matrix-row-${rowIndex}-col-${currentColCount}`;
        }
        input.value = currentColCount;
        
        newCell.appendChild(input);
        
        // Insert before the last cell (remove button cell)
        row.insertBefore(newCell, row.lastElementChild);
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