//üks õige vastus
let answerCount = 0;

document.getElementById('answerType').addEventListener('change', () => {
  const newType = document.getElementById('answerType').value;
  const answerOptions = document.querySelectorAll('.answer-option');
  
  answerOptions.forEach(option => {
    const input = option.querySelector('input[type="radio"], input[type="checkbox"]');
    if (input) {
      input.type = newType === 'single' ? 'radio' : 'checkbox';
    }
  });
});

document.getElementById('question').addEventListener('input', (e) => adjustTextarea(e.target));
adjustTextarea(document.getElementById('question'));


function addAnswer() {
  const type = document.getElementById('answerType').value;
  const container = document.getElementById('answers');

  const div = document.createElement('div');
  div.className = 'answer-option';
  div.innerHTML = `
    <input type="${type === 'single' ? 'radio' : 'checkbox'}" name="correct" value="${answerCount}">
    <textarea rows="1" placeholder="Vastusevariant" name="answerText" class="resizable"></textarea>
  `;
  container.appendChild(div);

  const textarea = div.querySelector('textarea[name="answerText"]');
  textarea.addEventListener('input', (e) => adjustTextarea(e.target));
  adjustTextarea(textarea);

  answerCount++;
}

function getFormData() {
  const question = document.getElementById('question').value;
  const answerType = document.getElementById('answerType').value;

  const options = Array.from(document.querySelectorAll('.answer-option')).map(el => {
    const isCorrect = el.querySelector('input[type="radio"], input[type="checkbox"]').checked;
    const text = el.querySelector('textarea[name="answerText"]').value;
    return { text, isCorrect };
  });

  return { question, answerType, options };
}

function preview() {
  const data = getFormData();
  localStorage.setItem('previewData', JSON.stringify(data));
  window.open('index2.html', '_blank');
}

function save() {
  const data = getFormData();

  fetch('/save-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.ok) alert('Salvestatud!');
    else alert('Viga salvestamisel!');
  });
}

const answerTypeSelect = document.getElementById("answerType");
const optionsContainer = document.getElementById("optionsContainer");
const addOptionBtn = document.getElementById("addOption");

let options = [];

function renderOptions() {
  optionsContainer.innerHTML = ''; 
  const type = answerTypeSelect.value === 'single' ? 'radio' : 'checkbox';
  
  options.forEach((opt, index) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    
    input.type = type;
    input.name = 'answers'; 
    input.value = opt;
    
    label.textContent = opt;
    label.prepend(input);
    
    optionsContainer.appendChild(label);
  });
}

addOptionBtn.addEventListener('click', () => {
  const newOption = prompt('Enter new option text:');
  if (newOption) {
    options.push(newOption);
    renderOptions();
  }
});

answerTypeSelect.addEventListener('change', renderOptions);

function adjustTextarea(el) {
  const span = document.createElement('span');
  span.style.visibility = 'hidden';
  span.style.whiteSpace = 'pre';
  
  const computedStyle = window.getComputedStyle(el);
  span.style.font = computedStyle.font;
  span.style.fontSize = computedStyle.fontSize;
  span.style.fontFamily = computedStyle.fontFamily;
  span.style.letterSpacing = computedStyle.letterSpacing;
  
  span.textContent = el.value || el.placeholder || "";
  document.body.appendChild(span);
  
  const textWidth = span.offsetWidth + 20; 
  document.body.removeChild(span);
  
  const containerWidth = document.documentElement.clientWidth;
  const minWidth = containerWidth * 0.3;
  const maxWidth = containerWidth * 0.5;
  
  const newWidth = Math.min(Math.max(textWidth, minWidth), maxWidth);
  el.style.width = newWidth + "px";
  
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + "px";
}
