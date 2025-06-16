import createFetch from "./utils/createFetch"; // Import createFetch

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

async function saveQuiz(questionData) {
  try {
      console.log("API URL:", import.meta.env.VITE_API_URL);
      console.log("Sending data:", questionData);
      
      const result = await createFetch("/question/upload", "POST", questionData);
      console.log("Raw API result:", result);
      
      if (result.error) {
          console.error("Error saving question:", result.error);
          alert("Küsimuse salvestamine ebaõnnestus.");
          return null;
      }
      
      // Save to local tracking for order number calculation
      saveQuestionToLocalTracking(questionData.blockId, {
          ...questionData,
          id: result.questionId || result.id
      });
      
      alert("Küsimus salvestatud!");
      return result.questionId || result.id;
      
  } catch (error) {
      console.error("Save error:", error);
      alert("Midagi läks valesti salvestamisel.");
      return null;
  }
}

function collectQuizData(blockId) {
  // Get and log the question text
  const questionTextElem = document.getElementById("question-text");
  const question = questionTextElem ? questionTextElem.value.trim() : "";
  console.log("Question:", question);
  if (!question) {
    alert("Palun sisesta küsimuse tekst!");
    return null;
  }

  // Points: convert input to a number
  const pointsCheckbox = document.getElementById("additional-points");
  const pointsInput = document.getElementById("points-input");
  const ptsStr = pointsInput ? pointsInput.value.trim() : "";
  const points = pointsCheckbox && pointsCheckbox.checked && ptsStr !== "" ? Number(ptsStr) : 0;
  console.log("Points:", points, "Raw:", ptsStr);

  // Get answer type from dropdown and map it to a numeric code.
  const dropdown = document.getElementById("dropdown-selected");
  const answerTypeStr =
    dropdown && dropdown.querySelector("span")
      ? dropdown.querySelector("span").dataset.value || "luhike-tekst"
      : "luhike-tekst";
  console.log("Answer type (string):", answerTypeStr);

  let answerTypeCode;
  switch (answerTypeStr) {
    case "uks-oige":
      answerTypeCode = 0;
      break;
    case "mitu-oiget":
      answerTypeCode = 1;
      break;
    case "luhike-tekst":
    case "pikk-tekst":
      answerTypeCode = 2;
      break;
    case "maatriks-uks":
    case "maatriks-mitu":
      answerTypeCode = 3;
      break;
    case "interaktiivne":
      answerTypeCode = 4;
      break;
    case "keemia_tasakaalustamine":
      answerTypeCode = 5;
      break;
    case "joonistamine":
      answerTypeCode = 6;
      break;
    case "kalkulaator":
      answerTypeCode = 7;
      break;
    case "keemia_ahelad":
      answerTypeCode = 8;
      break;
    default:
      answerTypeCode = 2;
  }
  console.log("Mapped answer type code:", answerTypeCode);

  // Build answerVariables array.
  let answerVariables = [];
  if (answerTypeStr === "uks-oige") {
    const optionRows = document.querySelectorAll("#single-options .option-row");
    optionRows.forEach(row => {
      const optTextElem = row.querySelector(".option-input");
      const optText = optTextElem ? optTextElem.value.trim() : "";
      const isCorrect = row.querySelector('input[name="correct-single"]:checked') !== null ? 1 : 0;
      if (optText) {
        answerVariables.push({ answer: optText, correct: isCorrect });
      }
    });
  } else if (answerTypeStr === "mitu-oiget") {
    const optionRows = document.querySelectorAll("#multiple-options .option-row");
    optionRows.forEach(row => {
      const optTextElem = row.querySelector(".option-input");
      const optText = optTextElem ? optTextElem.value.trim() : "";
      const isCorrect = row.querySelector('input[name="correct-multiple"]:checked') !== null ? 1 : 0;
      if (optText) {
        answerVariables.push({ answer: optText, correct: isCorrect });
      }
    });
  } else {
    // For text answers (or other types where you take a single value)
    const answerInput = document.querySelector("#preview-content input, #preview-content textarea");
    if (answerInput) {
      answerVariables.push({ answer: answerInput.value.trim(), correct: 1 });
    }
  }
  console.log("Answer variables:", answerVariables);

  // Determine orderNumber: assume the existence of a global quizData variable.
  const orderNumber =
    (window.quizData &&
      window.quizData.block &&
      window.quizData.block[0] &&
      window.quizData.block[0].blockQuestions
        ? window.quizData.block[0].blockQuestions.length + 1
        : 1);
  console.log("Order number:", orderNumber);

  // Build the final payload.
  const finalData = {
    blockId: blockId.toString(),
    question: question,
    points: points,
    answerType: answerTypeCode,
    orderNumber: orderNumber
  };

  if (answerTypeCode === 0 || answerTypeCode === 1) {
    finalData.answerVariables = answerVariables;
  }
  console.log("Final question data payload:", finalData);
  return finalData;
}

class QuizBuilder {
    constructor() {
        this.init();
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
            const pointsCheckbox = document.getElementById('additional-points');
            const pointsInput = document.getElementById('points-input');

            // Initially hide the points input if unchecked.
            if (!pointsCheckbox.checked) {
                pointsInput.style.display = 'none';
            } else {
                pointsInput.style.display = 'block';
            }

            // Add a listener: when checkbox state changes, show or hide points input.
            pointsCheckbox.addEventListener('change', () => {
                if (pointsCheckbox.checked) {
                // Show input and (optionally) set a default value if blank.
                pointsInput.style.display = 'block';
                if (!pointsInput.value.trim()) {
                    pointsInput.value = 20;
                }
                } else {
                // Hide the input and clear its value.
                pointsInput.style.display = 'none';
                pointsInput.value = "";
                }
            });
            });
        }
      
    setupQuestionImageUpload() {
    // Find the element that should respond to the click across its entire area.
    const uploadArea = document.querySelector('.image-upload-area'); // Use the whole container instead of just the text element
    if (!uploadArea) return;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.id = 'question-image-upload';

    document.body.appendChild(fileInput);

    // Make the entire upload area clickable.
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Listen for file change.
    fileInput.addEventListener('change', (e) => {
        this.handleQuestionImageUpload(e.target);
    });
    }


    handleQuestionImageUpload(input) {
        const file = input.files[0];
        if (!file) return;
        const uploadArea = document.querySelector('.upload-pic');
        if (!uploadArea) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            // Create the image container HTML with both the change image button and "X" remove button.
            uploadArea.innerHTML = `
            <div style="position: relative; display: inline-block;">
                <img src="${e.target.result}" 
                    style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 2px solid #ddd;" 
                    alt="Küsimuse pilt" />
                <button type="button" class="remove-image-btn"
                style="position: absolute; top: 5px; right: 5px; background: #f44336; color: white; border: none; 
                        border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 12px;"
                title="Eemalda pilt">&times;</button>
                <div style="margin-top: 8px;">
                <button type="button" id="change-image-btn"
                    style="padding: 6px 12px; background: rgb(135, 22, 22); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Vaheta pilti
                </button>
                </div>
            </div>
            `;
            
            // Attach event for the "×" - this button will only remove the image.
            const removeBtn = uploadArea.querySelector('.remove-image-btn');
            if (removeBtn) {
            removeBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent bubbling so the file picker does not open.
                // Remove the image and revert the upload area to its default state.
                uploadArea.innerHTML = `<p>Lisa pilt küsimuse juurde</p>`;
                // Reset the underlying file input.
                document.getElementById('question-image-upload').value = '';
            });
            }
            
            // Attach event for the "Vaheta pilti" button, which still triggers the file picker.
            const changeBtn = uploadArea.querySelector('#change-image-btn');
            if (changeBtn) {
            changeBtn.addEventListener('click', (event) => {
                // Open file picker for swapping the image.
                document.getElementById('question-image-upload').click();
            });
            }
        };
        reader.readAsDataURL(file);
        }


    setupDropdown() {
        const dropdown         = document.getElementById('answer-type-dropdown');
        const dropdownSelected = document.getElementById('dropdown-selected');
        const dropdownOptions = document.getElementById('dropdown-options');
        if (!dropdown || !dropdownSelected || !dropdownOptions) return;

        // Toggle dropdown on click.
        dropdownSelected.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownOptions.style.display =
            dropdownOptions.style.display === 'block' ? 'none' : 'block';
        });

        // Handle clicks *inside* the options panel
        dropdownOptions.addEventListener('click', e => {
            const opt = e.target;
            if (!opt.classList.contains('dropdown-option')) return;

            const value = opt.getAttribute('data-value');
            const text  = opt.textContent;

            dropdownSelected.querySelector('span').textContent = text;
            dropdownOptions.style.display = 'none';
            this.showPreview(value);
        });

        // close if you click outside
        document.addEventListener('click', e => {
            if (!dropdown.contains(e.target)) {
            dropdownOptions.style.display = 'none';
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
        console.log("showPreview() called with value:", value);
        const previewSection        = document.getElementById('preview-section');
        const previewContent        = document.getElementById('preview-content');
        const calculatorWrapper     = document.getElementById('calculator-wrapper');
        const calculatorIframe      = document.getElementById('calculator-iframe');
        const genericPreviewWrapper = document.getElementById('generic-preview-wrapper');

        if (!previewSection || !previewContent) {
            console.error("Missing preview section or preview content elements");
            return;
        }
        
        previewSection.style.display = 'block';

        // Completely wipe out any old preview
        previewContent.innerHTML = `
            <div id="calculator-wrapper" style="display:none; margin-top:1rem;">
                <iframe id="calculator-iframe" src="" width="100%" height="600"
                        style="border:1px solid #ccc;"></iframe>
                <p><strong>Saadetud vastus:</strong>
                    <span id="calculator-answer-preview"></span></p>
            </div>
            <div id="generic-preview-wrapper" style="display:none;"></div>
        `;

        // Re-grab the wrappers (they’ve just been re-inserted)
        const calcWrap   = document.getElementById('calculator-wrapper');
        const calcFrame  = document.getElementById('calculator-iframe');
        const genWrap    = document.getElementById('generic-preview-wrapper');

        // Reset the iframe src to avoid stale content
        calcFrame.src = '';
        console.log("Before condition, calcFrame.src reset to:", calcFrame.src);

        if (value === 'latex-kalkulaator') {
            console.log("Value indicates LaTeX calculator. Setting iframe source.");
            calcWrap.style.display = 'block';
            calcFrame.src = 'calculator.html';
            console.log("calcFrame.src set to:", calcFrame.src);
        } else if (value === 'keemia_tasakaalustamine') {
            console.log("Value indicates chemistry balance. Setting iframe source.");

            // Eemaldame vana eelvaate ja loome keemia klaviatuuri eelvaate HTML
            previewContent.innerHTML = `
                <div id="chemistry-keyboard-iframe-wrapper" style="margin-top: 1rem; padding: 1rem;">
                    <iframe
                        id="chemistry-keyboard-iframe"
                        src="chemistryKeyboard.html"
                        width="100%"
                        height="400"
                        style="border: none;">
                    </iframe>
                    <p class="poppins-regular">
                      <strong>Saadetud valem:</strong>
                      <span id="chemistry-keyboard-answer-preview"></span>
                    </p>
                </div>
            `;
        } else {
            genWrap.style.display = 'block';
            const renderers = {
                'luhike-tekst':    () => this.renderShortText(),
                'pikk-tekst':      () => this.renderLongText(),
                'uks-oige':        () => this.renderSingleChoice(),
                'mitu-oiget':      () => this.renderMultipleChoice(),
                'maatriks-uks':    () => this.renderMatrixSingle(),
                'maatriks-mitu':   () => this.renderMatrixMultiple(),
                'joonistamine':    () => this.renderDrawingCanvas(),
                'interaktiivne':   () => this.renderImageUpload(),
                'keemia_ahelad':   () => this.renderChemistryChains() // ainult keemia_ahelad jääb renderisse
            };
            if (renderers[value]) {
                console.log("Found renderer for value:", value);
                renderers[value]();
            } else {
                console.log("No renderer found for value:", value);
                genWrap.innerHTML = `<p>${value} eelvaade pole veel seadistatud.</p>`;
            }
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
        const container = this.createContainer('Lühike tekstivastus (eelvaade):');
        const input = this.createElement('input');
        input.type = 'text';
        // Instead of a placeholder, provide a default static value
        input.value = 'Sisesta vastus';
        // Make the input read-only so it cannot be edited
        input.readOnly = true;
        // Optional: also disable focus styles if desired
        input.style.cssText = 'width: 100%; padding: 8px; font-size: 1rem; border: 1px solid #8a1929; border-radius: 4px; background-color: #f9f9f9;';
        container.appendChild(input);
        document.getElementById('preview-content').appendChild(container);
    }


    renderLongText() {
        const container = this.createContainer('Pikk tekstivastus (eelvaade):');
        const textarea = this.createElement('textarea');
        // Provide a default example value if needed
        textarea.value = 'Sisesta vastus';
        // Make it read-only
        textarea.readOnly = true;
        // Set rows and style as before
        textarea.rows = 5;
        textarea.style.cssText = 'width: 100%; padding: 8px; font-size: 1rem; border: 1px solid #8a1929; border-radius: 4px; background-color: #f9f9f9;';
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

    // --- In renderImageUpload() ---
    renderImageUpload() {
        const container = this.createContainer('Interaktiivne pilt:');
        // Create the upload area (initially clickable).
        const uploadArea = this.createElement('div', 'image-upload-area');
        uploadArea.style.cssText =
        'border: 2px dashed #8a1929; padding: 20px; text-align: center; margin-bottom: 10px; border-radius: 4px; cursor: pointer;';
        // Create hidden file input.
        const fileInput = this.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'image-upload';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (e) => this.handleImageUpload(e.target, uploadArea));
        // Save the upload click handler in a property so that it can be removed later.
        uploadArea._handleUpload = () => fileInput.click();
        // Make the entire upload area clickable.
        uploadArea.addEventListener('click', uploadArea._handleUpload);

        // Create preview area with instruction text.
        const preview = this.createElement('div', 'image-preview');
        preview.style.marginBottom = '10px';
        preview.innerHTML = '<p>Lohista pilt siia või kliki, et lisada pilt</p>';
        // Append the preview to the upload area.
        uploadArea.appendChild(preview);
        // (Optional) Create hotspot controls container – hidden initially.
        const hotspotControls = this.createElement('div', 'hotspot-controls');
        hotspotControls.style.display = 'none';

        container.appendChild(uploadArea);
        container.appendChild(hotspotControls);
        document.getElementById('preview-content').appendChild(container);
        // Also append the fileInput to the document (so it remains accessible).
        document.body.appendChild(fileInput);
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
        canvas.style.cssText = 'border: 1px solid #8a1929; cursor: crosshair; display: block;';
        
        container.appendChild(controls);
        container.appendChild(canvas);
        document.getElementById('preview-content').appendChild(container);
        
        // Initialize drawing after DOM is updated
        setTimeout(() => this.initializeDrawing(), 100);
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
        undoBtn.style.background = 'rgb(89, 154, 118)';
        undoBtn.addEventListener('click', () => {
            if (window.chemistryDrawingTool) {
                window.chemistryDrawingTool.undo();
            }
        });
        
        const redoBtn = this.createAddButton('Redo (Y)');
        redoBtn.style.background = 'rgb(89, 154, 118)';
        redoBtn.addEventListener('click', () => {
            if (window.chemistryDrawingTool) {
                window.chemistryDrawingTool.redo();
            }
        });
        
        const deleteBtn = this.createAddButton('Kustuta valitud (Del)');
        deleteBtn.style.background = 'rgb(192, 137, 144)';
        deleteBtn.addEventListener('click', () => {
            if (window.chemistryDrawingTool) {
                window.chemistryDrawingTool.deleteSelected();
            }
        });
        
        const clearBtn = this.createAddButton('Puhasta kõik');
        clearBtn.style.background = 'rgb(192, 137, 144)';
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
        button.style.cssText = 'margin: 5px; padding: 8px 12px; background: #8a1929; color: white; border: none; border-radius: 4px; cursor: pointer;';
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
            <button type="button" class="remove-btn" style="background: #8a1929; color: white; border: none; padding: 4px 8px; border-radius: 4px;">×</button>
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
            <button type="button" class="remove-btn" style="background: #8a1929; color: white; border: none; padding: 4px 8px; border-radius: 4px;">×</button>
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
            removeBtn.style.cssText = 'background: #8a1929; color: white; border: none; padding: 2px 6px; border-radius: 3px; font-size: 12px; position: absolute; right: 4px; top: 50%; transform: translateY(-50%); cursor: pointer;';
            
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
        labelCell.style.cssText = 'border: 1px solid rgb(218, 214, 214); padding: 8px;';
        
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
            cell.style.cssText = 'border: 1px solid rgb(218, 214, 214); padding: 8px; text-align: center;';
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
        removeCell.style.cssText = 'border: 1px solid rgb(218, 214, 214); padding: 8px; text-align: center;';
        
        const removeBtn = this.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-btn matrix-row-remove';
        removeBtn.innerHTML = '×';
        removeBtn.style.cssText = 'background: #8a1929; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;';
        
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
        newHeader.style.cssText = 'border: 1px solid #8a1929; padding: 8px; background: #f5f5f5; position: relative; min-width: 120px;';
        
        const input = this.createElement('input');
        input.type = 'text';
        input.placeholder = `Veerg ${currentColCount + 1}`;
        input.className = 'matrix-header';
        input.style.cssText = 'border: none; background: transparent; width: calc(100% - 25px);';
        
        const removeBtn = this.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-btn matrix-col-remove';
        removeBtn.innerHTML = '×';
        removeBtn.style.cssText = 'background: #8a1929; color: white; border: none; padding: 2px 6px; border-radius: 3px; font-size: 12px; position: absolute; right: 4px; top: 50%; transform: translateY(-50%); cursor: pointer;';
        
        newHeader.appendChild(input);
        newHeader.appendChild(removeBtn);
        
        // Insert before the last column (actions column)
        thead.insertBefore(newHeader, thead.lastElementChild);
        
        // Add cells to existing rows
        const inputType = type === 'single' ? 'radio' : 'checkbox';
        tbody.querySelectorAll('tr').forEach((row, rowIndex) => {
            const newCell = this.createElement('td', 'matrix-cell');
            newCell.style.cssText = 'border: 1px solid rgb(218, 214, 214); padding: 8px; text-align: center;';
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

    // --- In handleImageUpload() ---
    handleImageUpload(input, uploadArea) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            // Replace uploadArea innerHTML with the image plus change and remove buttons.
            uploadArea.innerHTML = `
            <div style="position: relative; display: inline-block;">
            <img id="uploaded-image" src="${e.target.result}"
                style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 2px solid #ddd; display: block;"
                alt="Küsimuse pilt" />
            <button type="button" class="remove-image-btn"
                style="position: absolute; top: 5px; right: 5px; background: #f44336; color: white; border: none;
                border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 12px;" title="Eemalda pilt">
                &times;
            </button>
            </div>
            <div style="margin-top: 8px;">
            <button type="button" id="change-image-btn"
                style="padding: 6px 12px; background: rgb(135, 22, 22); color: white; border: none; border-radius: 4px; cursor: pointer;">
                Vaheta pilti
            </button>
            </div>
            `;
            // *** Remove the file picker activation handler now that an image exists ***
            if (uploadArea._handleUpload) {
                uploadArea.removeEventListener('click', uploadArea._handleUpload);
                // Optionally delete the stored handler so it isn’t used again.
                delete uploadArea._handleUpload;
            }
            
            // Set the cursor to default, so clicking the image doesn't look clickable for new file upload.
            uploadArea.style.cursor = 'default';
            
            // Attach event for the "Vaheta pilti" button: clicking it should open the file picker.
            const changeBtn = uploadArea.querySelector('#change-image-btn');
            if (changeBtn) {
                changeBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    // Reattach the original file picker handler in case the user wants to swap the image.
                    uploadArea._handleUpload = () => document.getElementById('image-upload').click();
                    uploadArea.addEventListener('click', uploadArea._handleUpload);
                    document.getElementById('image-upload').click();
                });
            }
            
            // Attach event for the "remove" button.
            const removeBtn = uploadArea.querySelector('.remove-image-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    // Reset the upload area to its original state.
                    uploadArea.innerHTML = '<div class="image-preview" style="margin-bottom:10px;"><p>Lohista pilt siia või kliki, et lisada pilt</p></div>';
                    // Reattach the file picker handler.
                    uploadArea._handleUpload = () => document.getElementById('image-upload').click();
                    uploadArea.addEventListener('click', uploadArea._handleUpload);
                    // Reset the file input.
                    document.getElementById('image-upload').value = "";
                    // Hide hotspot controls if needed.
                    const hotspotControls = document.querySelector('.hotspot-controls');
                    if (hotspotControls) {
                        hotspotControls.style.display = 'none';
                    }
                });
            }
            
            // Show hotspot controls so the user can add hotspots.
            const hotspotControls = document.querySelector('.hotspot-controls');
            if (hotspotControls) {
                hotspotControls.style.display = 'block';
            }
            
            // Bind hotspot creation on the image.
            const imgElem = document.getElementById('uploaded-image');
            if (imgElem) {
                imgElem.addEventListener('click', (event) => this.addHotspot(event));
            }
        };
        reader.readAsDataURL(file);
    }



    // Adds a hotspot dot based on the click coordinates over the image.
    addHotspot(event) {
        const img = event.target;
        const rect = img.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((event.clientY - rect.top) / rect.height * 100).toFixed(1);
        
        // Create a small dot that represents a hotspot.
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dot.style.width = '12px';
        dot.style.height = '12px';
        dot.style.background = '#8a1929';
        dot.style.border = '1px solid white';
        dot.style.borderRadius = '50%';
        dot.style.cursor = 'pointer';
        
        // When a hotspot dot is clicked, remove it.
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            dot.remove();
        });
        
        // The image's container (which holds the image) should be positioned relative.
        // We assume that the uploaded image is inside a relatively positioned container.
        const container = img.parentElement;
        if (container) {
            container.appendChild(dot);
        }
    }




    addImageMarker(img, x, y, number) {
        const marker = this.createElement('div');
        marker.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: 24px;
            height: 24px;
            background: #8a1929;
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
        let mode = 'draw'; // Modes: "draw" or "erase"
        const eraserSize = 20; // You can base this off your brush-size input if desired
        
        // Create and insert a simple eraser toggle button into your existing controls.
        const colorInput = document.getElementById('drawing-color');
        const brushSize = document.getElementById('brush-size');
        const controlsContainer = canvas.previousElementSibling;
        
        const eraserBtn = document.createElement('button');
        eraserBtn.textContent = 'Kustutama';
        eraserBtn.style.margin = '5px';
        eraserBtn.style.padding = '8px 12px';
        eraserBtn.style.background = '#9e9e9e';
        eraserBtn.style.color = 'white';
        eraserBtn.style.border = 'none';
        eraserBtn.style.borderRadius = '4px';
        eraserBtn.style.cursor = 'pointer';
        
        eraserBtn.addEventListener('click', () => {
            // Toggle mode between drawing and erasing.
            mode = mode === 'draw' ? 'erase' : 'draw';
            eraserBtn.textContent = mode === 'erase' ? 'Joonistama' : 'Kustutama';
        });
        
        // Append the eraser button to your drawing controls.
        if (controlsContainer) {
            controlsContainer.appendChild(eraserBtn);
        }
        
        // Helper to get mouse position relative to the canvas.
        const getMousePos = (canvas, e) => {
            const rect = canvas.getBoundingClientRect();
            return [e.clientX - rect.left, e.clientY - rect.top];
        };
        
        // Start drawing (or erasing)
        const startDrawing = (e) => {
            isDrawing = true;
            [lastX, lastY] = getMousePos(canvas, e);
        };
        
        // Stop drawing when the mouse is released or leaves the canvas.
        const stopDrawing = () => {
            isDrawing = false;
        };
        
        // The drawing (or erasing) function.
        const draw = (e) => {
            if (!isDrawing) return;
            const [currentX, currentY] = getMousePos(canvas, e);
            
            if (mode === 'draw') {
            // Drawing mode: draw a line from last position to current
            const color = colorInput ? colorInput.value : '#000000';
            const size = brushSize ? brushSize.value : 3;
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            } else if (mode === 'erase') {
            // Eraser mode: clear a rectangle around the current position
            // (You can adjust eraserSize as needed)
            ctx.clearRect(currentX - eraserSize / 2, currentY - eraserSize / 2, eraserSize, eraserSize);
            }
            
            [lastX, lastY] = [currentX, currentY];
        };
        
        // Attach mouse events to the canvas.
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Also add simple touch events for mobile devices.
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            // Convert touch to a synthetic mouse event
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
// --- Initialize the Quiz Builder ---
const quizBuilder = new QuizBuilder();

// --- "Lisa" Button: Save Question First, Then Show Popup ---
document.getElementById('add-question').addEventListener('click', async () => {
  try {
    // First save the current question
    const questionSaved = await saveCurrentQuestion();
    
    if (questionSaved) {
      // Only show popup if question was saved successfully
      document.getElementById("add-popup").style.display = "block";
    }
  } catch (error) {
    console.error("Error saving question:", error);
    alert("Viga küsimuse salvestamisel!");
  }
});

// Close popup functionality
document.getElementById("popup-close").addEventListener("click", () => {
  document.getElementById("add-popup").style.display = "none";
});

// --- "Lisa küsimus" functionality ---
document.getElementById("add-question-option").addEventListener("click", () => {
  document.getElementById("add-popup").style.display = "none";
  
  // Clear form and prepare for new question
  clearQuestionForm();
  
  // Show success message
  showSuccessMessage("Küsimus salvestatud! Koosta järgmine küsimus.");
});

// --- "Lisa plokk" functionality ---
document.getElementById("add-block").addEventListener("click", async () => {
  try {
    // Create new block in database
    const newBlockResponse = await createFetch("/block/create", "POST", {
      name: `Plokk ${getNextBlockNumber()}`,
      testId: getCurrentTestId()
    });

    if (newBlockResponse.error) {
      alert("Viga ploki loomisel: " + newBlockResponse.error);
      return;
    }

    // Close popup
    document.getElementById("add-popup").style.display = "none";
    
    // Update UI to show new block
    updateBlockInfo(newBlockResponse.blockId, newBlockResponse.name);
    
    // Clear form and prepare for new question in new block
    clearQuestionForm();
    
    // Show success message
    showSuccessMessage("Küsimus salvestatud ja uus plokk loodud! Koosta esimene küsimus uuele plokile.");

  } catch (error) {
    console.error("Error adding block:", error);
    alert("Viga ploki lisamisel!");
  }
});

// --- Save Current Question ---
async function saveCurrentQuestion() {
  const question = document.getElementById("question-text").value.trim();
  if (!question) {
    alert("Palun sisesta küsimuse tekst!");
    return false;
  }

  const fileInput = document.getElementById("file-input");
  const imageFile = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;

  let result;
  if (imageFile) {
    // Build FormData payload (for image uploads)
    const formData = new FormData();
    formData.append("question", question);

    const ptsStr = document.getElementById("points-input").value.trim();
    const points = Number(ptsStr) || 0;
    formData.append("points", points);

    const autoControl = document.getElementById("auto-control")?.checked;
    formData.append("autoControl", autoControl);

    // Retrieve and map answer type as before.
    const dropdown = document.getElementById("dropdown-selected");
    const answerTypeStr =
      dropdown && dropdown.querySelector("span")
        ? dropdown.querySelector("span").dataset.value || "luhike-tekst"
        : "luhike-tekst";

    let answerTypeCode;
    switch (answerTypeStr) {
      case "uks-oige":
        answerTypeCode = 0;
        break;
      case "mitu-oiget":
        answerTypeCode = 1;
        break;
      case "luhike-tekst":
      case "pikk-tekst":
        answerTypeCode = 2;
        break;
      case "maatriks-uks":
      case "maatriks-mitu":
        answerTypeCode = 3;
        break;
      case "interaktiivne":
        answerTypeCode = 4;
        break;
      case "keemia_tasakaalustamine":
        answerTypeCode = 5;
        break;
      case "joonistamine":
        answerTypeCode = 6;
        break;
      case "kalkulaator":
        answerTypeCode = 7;
        break;
      case "keemia_ahelad":
        answerTypeCode = 8;
        break;
      default:
        answerTypeCode = 2;
    }
    console.log("Answer type in FormData (code):", answerTypeCode);
    formData.append("answerType", answerTypeCode);

    // Append blockId (as a string)
    if (getCurrentBlockId()) {
      formData.append("blockId", getCurrentBlockId().toString());
    }

    // Log FormData keys and values for debugging.
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Use fetch directly for FormData.
    const response = await fetch(import.meta.env.VITE_API_URL + "/question/upload", {
      method: "POST",
      credentials: "include",
      body: formData
    });
    result = await response.json();
  } else {
    // No image: build and send JSON data.
    const payload = collectQuizData(getCurrentBlockId());
    console.log("JSON payload being sent:", payload);
    result = await createFetch("/question/upload", "POST", payload);
  }

  console.log("API result:", result);
  if (result.error) {
    alert("Küsimuse salvestamine ebaõnnestus: " + result.error);
    return false;
  } else {
    console.log(result.message || "Küsimus salvestatud edukalt!");
    return true;
  }
}

// --- Helper Functions ---

function clearQuestionForm() {
  // Clear question text
  document.getElementById('question-text').value = '';
  
  // Clear image upload area
  const imageUpload = document.getElementById('image-upload');
  imageUpload.innerHTML = `
    <div class="image-icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
      </svg>
    </div>
    <div class="upload-pic">Vajuta kastikesele, et laadida pilt üles</div>
  `;
  
  // Clear file input
  const fileInput = document.getElementById('file-input');
  if (fileInput) {
    fileInput.value = '';
  }
  
  // Clear and uncheck points
  document.getElementById('additional-points').checked = false;
  document.getElementById('points-input').value = '';
  document.getElementById('points-input').style.display = 'none';
  
  // Clear auto-control if it exists
  const autoControl = document.getElementById('auto-control');
  if (autoControl) {
    autoControl.checked = false;
  }
  
  // Reset answer type dropdown to default state
  const dropdownSelected = document.getElementById('dropdown-selected');
  dropdownSelected.innerHTML = `
    <span>Vali vastusetüüp...</span>
    <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  dropdownSelected.removeAttribute('data-value');
  
  // Hide preview section
  document.getElementById('preview-section').style.display = 'none';
  
  // Clear calculator wrapper if it exists
  const calculatorWrapper = document.getElementById('calculator-wrapper');
  if (calculatorWrapper) {
    calculatorWrapper.style.display = 'none';
  }
  
  // Clear generic preview wrapper
  const genericPreview = document.getElementById('generic-preview-wrapper');
  if (genericPreview) {
    genericPreview.style.display = 'none';
    genericPreview.innerHTML = '';
  }
  
  // Remove any dynamically created answer option elements
  const existingAnswerOptions = document.querySelectorAll('.answer-options, .matrix-options, .drawing-area');
  existingAnswerOptions.forEach(option => option.remove());
  
  // Reset any global state related to current question
  if (window.currentQuestionType) {
    window.currentQuestionType = null;
  }
}

function updateBlockInfo(blockId, blockName) {
  // Update header to show new block
  const headerSubtitle = document.querySelector('.header-subtitle');
  headerSubtitle.textContent = `Uus küsimus - ${blockName}`;
  
  // Store current block ID for future use
  window.currentBlockId = blockId;
}

function getCurrentBlockId() {
  // Return current block ID
  return window.currentBlockId || 1; // Default fallback
}

function getNextBlockNumber() {
  // Extract current block number from header and increment
  const headerSubtitle = document.querySelector('.header-subtitle');
  const match = headerSubtitle.textContent.match(/Plokk (\d+)/);
  
  if (match) {
    return parseInt(match[1]) + 1;
  }
  return 2; // Default to block 2 if we can't determine current
}

function getCurrentTestId() {
  // This should come from your application state/URL/localStorage
  return window.currentTestId || 1; // Default fallback
}

function showSuccessMessage(message) {
  // Create and show a temporary success message
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #E9CDCC;
    border: 1px solid #d3d3d3;
    padding: 20px;
    z-index: 1000;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    text-align: center;
  `;
  
  // Add slide-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(successDiv);
  
  // Remove after 4 seconds with fade out
  setTimeout(() => {
    successDiv.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 300);
  }, 4000);
}

// --- "Lõpeta testi koostamine" Button: Full Save Procedure ---
document.querySelector('.next-question').addEventListener('click', async () => {
  const quizData = quizBuilder.collectQuizData();
  if (!quizData) {
    alert("Palun sisesta küsimuse andmed enne testi lõpetamist!");
    return;
  }
  
  try {
    // 1. Create the Test
    const testResult = await createFetch('/test/upload', 'POST', {
        name: quizData.name || "Nimetu test",
        description: quizData.description || "Kirjeldus puudub",
        start: quizData.start,
        end: quizData.end,
        timeLimit: quizData.timelimit
    });
    if (!testResult.id) throw new Error("Testi loomine ebaõnnestus");

    // 2. Create the Block
    const blockResult = await createFetch('/block/upload', 'POST', {
        testId: testResult.id,
        blockNumber: 1
    });
    if (!blockResult.id) throw new Error("Bloki loomine ebaõnnestus");

    // 3. Upload questions
    const questions = quizData.block[0].blockQuestions;
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await createFetch('/question/upload', 'POST', {
        blockId: blockResult.id,
        question: q.question,
        points: q.points,
        answerType: q.answerType,
        orderNumber: i + 1,
        answerVariables: q.answerVariables
        });
    }

    alert("Test salvestatud edukalt!");
    window.location.href = `/test/${testResult.id}`;

    } catch (err) {
    console.error("Viga lõpliku salvestusega:", err);
    alert("Midagi läks valesti salvestamisel, proovi uuesti.");
    }
});

// --- Dropdown Setup ---
// In your QuizBuilder class, you likely have something like:
QuizBuilder.prototype.setupDropdown = function() {
  const dropdown = document.getElementById('answer-type-dropdown');
  const dropdownSelected = document.getElementById('dropdown-selected');
  const dropdownOptions = document.getElementById('dropdown-options');
  if (!dropdown || !dropdownSelected || !dropdownOptions) return;

  // Toggle dropdown on clicking the selected area
  dropdownSelected.addEventListener('click', (e) => {
    e.stopPropagation();
    // Toggle visible state
    dropdownOptions.style.display = dropdownOptions.style.display === 'block' ? 'none' : 'block';
  });
  
  // Handle selection from dropdown options
  dropdownOptions.addEventListener('click', e => {
    const opt = e.target;
    if (!opt.classList.contains('dropdown-option')) return;
    const value = opt.getAttribute('data-value');
    const text = opt.textContent;
    // Update the displayed text and optionally store value in data- attributes
    dropdownSelected.querySelector('span').textContent = text;
    dropdownOptions.style.display = 'none';
    // Render the preview for the selected answer type
    this.showPreview(value);
  });
  
  // Close dropdown if clicking outside
  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) {
      dropdownOptions.style.display = 'none';
      dropdown.classList.remove('open');
    }
  });
};

// --- Note on answer types ---
// When collecting quiz data (in collectQuizData), ensure that the answer type is set as a number:
// For example:
QuizBuilder.prototype.collectQuizData = function() {
  const quizData = {
    name: "Temporary Test Name",
    descripion: "Temporary Description",  // Note: typo intentionally matching your API if needed.
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    timelimit: 60,
    block: [{
      blockNumber: 1,
      blockQuestions: []
    }]
  };

  // Determine the answer type from dropdown
  const dropdown = document.getElementById("dropdown-selected");
  let answerTypeStr = dropdown && dropdown.querySelector("span") ? dropdown.querySelector("span").dataset.value || "luhike-tekst" : "luhike-tekst";
  let answerTypeCode;
  switch (answerTypeStr) {
      case "uks-oige":
          answerTypeCode = 0; // one_correct
          break;
      case "mitu-oiget":
          answerTypeCode = 1; // many_correct
          break;
      case "luhike-tekst":
      case "pikk-tekst":
          answerTypeCode = 2; // text
          break;
      case "maatriks-uks":
      case "maatriks-mitu":
          answerTypeCode = 3; // matrix
          break;
      case "interaktiivne":
          answerTypeCode = 4; // picture
          break;
      case "keemia_tasakaalustamine":
          answerTypeCode = 5; // chemistry
          break;
      case "joonistamine":
          answerTypeCode = 6; // drawing
          break;
      case "kalkulaator":
          answerTypeCode = 7; // calculator
          break;
      case "keemia_ahelad":
          answerTypeCode = 8; // calculator
          break;  
      default:
          answerTypeCode = 2; // default to text
}
  // Collect answer variables as needed (example for single choice)
  let answerVariables = [];
  if (answerTypeStr === "uks-oige") {
      const optionRows = document.querySelectorAll("#single-options .option-row");
      optionRows.forEach(row => {
          const optText = row.querySelector(".option-input") ? row.querySelector(".option-input").value.trim() : "";
          const isCorrect = row.querySelector('input[name="correct-single"]:checked') !== null ? 1 : 0;
          if (optText) {
              answerVariables.push({ answer: optText, correct: isCorrect });
          }
      });
  } else if (answerTypeStr === "mitu-oiget") {
    const optionRows = document.querySelectorAll("#multiple-options .option-row");
    optionRows.forEach(row => {
      const optText = row.querySelector(".option-input") ? row.querySelector(".option-input").value.trim() : "";
      const isCorrect = row.querySelector('input[name="correct-multiple"]:checked') !== null;
      answerVariables.push({ answer: optText, correct: isCorrect });
    });
  } else {
    // For text and others, for instance:
    const answerInput = document.querySelector("#preview-content input, #preview-content textarea");
    if (answerInput) {
      answerVariables.push({ answer: answerInput.value.trim(), correct: true });
    }
  }
  
  // Get the question text from your textarea
  const questionElem = document.getElementById("question-text");
  const question = questionElem ? questionElem.value.trim() : "";
  if (!question) {
    alert("Palun sisesta küsimuse tekst!");
    return null;
  }

  
  // Add the question object to the block
  quizData.block[0].blockQuestions.push({
    question: question,
    points: Number(document.getElementById("points-input").value.trim()) || 0,
    answerType: answerTypeCode,
    answerVariables: answerVariables
  });

  return quizData;

};

// Legacy function support (if needed)
window.closeDropdown = () => {
    const dropdown = document.getElementById('answer-type-dropdown');
    if (dropdown) {
        dropdown.classList.remove('open');
    }
};

// Export for external use if needed
window.QuizBuilder = QuizBuilder;