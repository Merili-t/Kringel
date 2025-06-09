function getColumnLabelsFromDOM() {
  return Array.from(document.querySelectorAll('.matrix-column-edit .matrix-column .matrix-cell'))
    .map(cell => cell.firstChild?.textContent.trim() || '')
    .filter(Boolean);
}

function getRowLabelsFromDOM() {
  return Array.from(document.querySelectorAll('.matrix-row-edit .matrix-row .matrix-cell'))
    .map(cell => cell.firstChild?.textContent.trim() || '')
    .filter(Boolean);
}

function renderMatrix() {
  const grid = document.getElementById("matrix-grid");
  grid.innerHTML = "";

  const columns = getColumnLabelsFromDOM();
  const rows = getRowLabelsFromDOM();

  grid.style.gridTemplateColumns = `120px repeat(${columns.length}, 110px)`;

  const headerRow = document.createElement("div");
  headerRow.className = "matrix-row";

  // Top-left empty cell
  const cornerCell = document.createElement("div");
  cornerCell.className = "matrix-cell";
  headerRow.appendChild(cornerCell);

  columns.forEach(col => {
    const cell = document.createElement("div");
    cell.className = "matrix-cell label editable";
    cell.contentEditable = true;
    cell.textContent = col;

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => deleteColumn(col);
    cell.appendChild(delBtn);

    headerRow.appendChild(cell);
  });

  grid.appendChild(headerRow);

  rows.forEach((rowLabel, rowIndex) => {
    const row = document.createElement("div");
    row.className = "matrix-row";

    const labelCell = document.createElement("div");
    labelCell.className = "matrix-cell label editable";
    labelCell.contentEditable = true;
    labelCell.textContent = rowLabel;
    labelCell.addEventListener('input', updateMatrixPreviewIfVisible);
    row.appendChild(labelCell);

    columns.forEach((col, colIndex) => {
      const cell = document.createElement("div");
      cell.className = "matrix-cell";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `row${rowIndex}`;
      input.value = colIndex;
      cell.appendChild(input);
      row.appendChild(cell);
    });

    grid.appendChild(row);
  });
}

function addRadioRow() {
  const container = document.querySelector('.matrix-row-edit');
  container.classList.add('flex-column');

  const wrapper = document.createElement('div');
  wrapper.className = 'matrix-row';

  const label = `Rida ${container.children.length + 1}`;
  const editBox = document.createElement('div');
  editBox.className = 'matrix-cell';
  editBox.contentEditable = true;
  editBox.textContent = label;

  editBox.addEventListener('input', () => {
    renderMatrix();
    updateMatrixPreviewIfVisible();
  });

  const delBtn = document.createElement('button');
  delBtn.textContent = '✕';
  delBtn.className = 'delete-btn';
  delBtn.onclick = () => {
    container.removeChild(wrapper);
    renderMatrix();
    updateMatrixPreviewIfVisible();
  };

  wrapper.appendChild(editBox);
  wrapper.appendChild(delBtn);
  container.appendChild(wrapper);

  renderMatrix();
  updateMatrixPreviewIfVisible();
}

function addRadioColumn() {
  const container = document.querySelector('.matrix-column-edit');
  container.classList.add('flex-column');

  const wrapper = document.createElement('div');
  wrapper.className = 'matrix-column flex-row-gap';

  const radioIcon = document.createElement('input');
  radioIcon.type = 'radio';
  radioIcon.disabled = true;
  radioIcon.tabIndex = -1;
  wrapper.appendChild(radioIcon);

  const label = `Veerg ${container.children.length + 1}`;
  const editBox = document.createElement('div');
  editBox.className = 'matrix-cell';
  editBox.contentEditable = true;
  editBox.textContent = label;

  editBox.addEventListener('input', () => {
    renderMatrix();
    updateMatrixPreviewIfVisible();
  });

  const delBtn = document.createElement('button');
  delBtn.textContent = '✕';
  delBtn.className = 'delete-btn';
  delBtn.onclick = () => {
    container.removeChild(wrapper);
    renderMatrix();
    updateMatrixPreviewIfVisible();
  };

  wrapper.appendChild(editBox);
  wrapper.appendChild(delBtn);
  container.appendChild(wrapper);

  renderMatrix();
  updateMatrixPreviewIfVisible();
}

function deleteColumn(label) {
  const container = document.querySelector('.matrix-column-edit');
  const wrappers = Array.from(container.children);
  for (const wrapper of wrappers) {
    const cell = wrapper.querySelector('.matrix-cell');
    if (cell && cell.textContent.trim() === label) {
      container.removeChild(wrapper);
      break;
    }
  }
  renderMatrix();
  updateMatrixPreviewIfVisible();
}

function toggleMatrixPreview() {
  const previewDiv = document.getElementById("matrix-preview");
  previewDiv.classList.toggle("hidden");

  if (!previewDiv.classList.contains("hidden")) {
    previewDiv.innerHTML = generateMatrixPreviewFromDOM();
  }
}

function generateMatrixPreviewFromDOM() {
  const columns = getColumnLabelsFromDOM();
  const rows = getRowLabelsFromDOM();

  if (columns.length === 0 || rows.length === 0) {
    return '<em>Lisa vähemalt üks rida ja veerg eelvaate jaoks.</em>';
  }

  let html = '<table class="matrix-preview-table"><thead><tr><th></th>';
  columns.forEach(label => {
    html += `<th>${label}</th>`;
  });
  html += '</tr></thead><tbody>';

  rows.forEach((rowLabel, rowIndex) => {
    html += `<tr><th>${rowLabel}</th>`;
    columns.forEach((_, colIndex) => {
      html += `<td><input type="radio" name="row${rowIndex}" value="${colIndex}"></td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  return html;
}

function updateMatrixPreviewIfVisible() {
  const previewDiv = document.getElementById("matrix-preview");
  if (previewDiv && !previewDiv.classList.contains("hidden")) {
    previewDiv.innerHTML = generateMatrixPreviewFromDOM();
  }
}
console.log("columns", getColumnLabelsFromDOM());
console.log("rows", getRowLabelsFromDOM());