// Quiz Builder JavaScript - Cleaned and Fixed Version

class QuizBuilder {
    constructor() {
        this.init();
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
        
        const equationInput = this.createElement('div', 'equation-input');
        equationInput.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 10px;';
        equationInput.innerHTML = `
            <input type="text" placeholder="Reaktandid (nt: H2 + O2)" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
            <span style="font-size: 18px;">→</span>
            <input type="text" placeholder="Saadused (nt: H2O)" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
        `;
        
        const balanceButton = this.createAddButton('Tasakaalusta võrrand');
        balanceButton.style.background = '#2196F3';
        
        const resultArea = this.createElement('div', 'balance-result');
        resultArea.style.cssText = 'margin-top: 15px; padding: 10px; background: white; border: 1px solid #ddd; border-radius: 4px; min-height: 50px;';
        resultArea.innerHTML = '<p style="color: #666; margin: 0;">Tasakaalustatud võrrand ilmub siia...</p>';
        
        equationContainer.appendChild(equationInput);
        equationContainer.appendChild(balanceButton);
        equationContainer.appendChild(resultArea);
        
        container.appendChild(equationContainer);
        document.getElementById('preview-content').appendChild(container);
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