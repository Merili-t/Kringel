//mitu õiget vastust
const data = JSON.parse(localStorage.getItem('previewData'));

const container = document.getElementById('preview');
const questionEl = document.createElement('h3');
questionEl.textContent = data.question;
container.appendChild(questionEl);

data.options.forEach((opt, index) => {
  const div = document.createElement('div');
  const input = document.createElement('input');
  input.type = data.answerType === 'single' ? 'radio' : 'checkbox';
  input.name = 'answer';
  input.value = index;

  const label = document.createElement('label');
  label.textContent = opt.text;

  div.appendChild(input);
  div.appendChild(label);
  container.appendChild(div);
});

