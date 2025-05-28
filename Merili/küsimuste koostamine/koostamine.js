document.addEventListener('DOMContentLoaded', function() {
    // Dropdown functionality
    const dropdown = document.getElementById('answer-type-dropdown');
    const dropdownSelected = document.getElementById('dropdown-selected');
    const dropdownOptions = document.getElementById('dropdown-options');
    const dropdownArrow = dropdown.querySelector('.dropdown-arrow');

    // Toggle dropdown
    dropdownSelected.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    // Handle option selection
    dropdownOptions.addEventListener('click', function(e) {
        if (e.target.classList.contains('dropdown-option')) {
            const selectedValue = e.target.getAttribute('data-value');
            const selectedText = e.target.textContent;
            
            // Update selected display
            dropdownSelected.querySelector('span').textContent = selectedText;
            dropdownSelected.classList.add('has-value');
            
            // Close dropdown
            dropdown.classList.remove('open');
            
            // Show preview based on selected answer type
            showPreview(selectedValue, selectedText);
            
            console.log('Selected answer type:', selectedValue);
        }
    });

    // Function to show preview based on answer type
    function showPreview(type, typeName) {
        const previewSection = document.getElementById('preview-section');
        const previewContent = document.getElementById('preview-content');
        
        let previewHTML = '';
        
        switch(type) {
            case 'luhike-tekst':
                previewHTML = `
                    <input type="text" class="preview-input" placeholder="Sisesta lühike vastus" readonly>
                `;
                break;
            case 'pikk-tekst':
                previewHTML = `
                    <textarea class="preview-input preview-textarea" placeholder="Sisesta pikk vastus" readonly></textarea>
                `;
                break;
            case 'uks-oige':
                previewHTML = `
                    <div class="preview-option">
                        <input type="radio" name="preview-radio" id="option1" disabled>
                        <label for="option1">Valik 1</label>
                    </div>
                    <div class="preview-option">
                        <input type="radio" name="preview-radio" id="option2" disabled>
                        <label for="option2">Valik 2</label>
                    </div>
                    <div class="preview-option">
                        <input type="radio" name="preview-radio" id="option3" disabled>
                        <label for="option3">Valik 3</label>
                    </div>
                `;
                break;
            case 'mitu-oiget':
                previewHTML = `
                    <div class="preview-option">
                        <input type="checkbox" id="check1" disabled>
                        <label for="check1">Valik 1</label>
                    </div>
                    <div class="preview-option">
                        <input type="checkbox" id="check2" disabled>
                        <label for="check2">Valik 2</label>
                    </div>
                    <div class="preview-option">
                        <input type="checkbox" id="check3" disabled>
                        <label for="check3">Valik 3</label>
                    </div>
                `;
                break;
            case 'keemia':
                previewHTML = `
                    <input type="text" class="preview-input" placeholder="H₂O + NaCl → ..." readonly>
                `;
                break;
            case 'joonistamine':
                previewHTML = `
                    <div style="border: 2px dashed #ddd; padding: 40px; text-align: center; border-radius: 8px; background: white;">
                        <div style="color: #666; font-size: 14px;">Joonistamise ala</div>
                    </div>
                `;
                break;
            case 'interaktiivne':
                previewHTML = `
                    <div style="border: 2px solid #ddd; padding: 40px; text-align: center; border-radius: 8px; background: white;">
                        <div style="color: #666; font-size: 14px;">Interaktiivne pilt</div>
                    </div>
                `;
                break;
            case 'maatriks-uks':
            case 'maatriks-mitu':
                previewHTML = `
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center;">
                        <div></div>
                        <div style="font-weight: bold; padding: 8px;">Veerg 1</div>
                        <div style="font-weight: bold; padding: 8px;">Veerg 2</div>
                        <div style="font-weight: bold; padding: 8px;">Rida 1</div>
                        <div style="padding: 8px;"><input type="${type === 'maatriks-uks' ? 'radio' : 'checkbox'}" disabled></div>
                        <div style="padding: 8px;"><input type="${type === 'maatriks-uks' ? 'radio' : 'checkbox'}" disabled></div>
                        <div style="font-weight: bold; padding: 8px;">Rida 2</div>
                        <div style="padding: 8px;"><input type="${type === 'maatriks-uks' ? 'radio' : 'checkbox'}" disabled></div>
                        <div style="padding: 8px;"><input type="${type === 'maatriks-uks' ? 'radio' : 'checkbox'}" disabled></div>
                    </div>
                `;
                break;
            default:
                previewHTML = `
                    <div style="color: #666; font-style: italic;">Eelvaade vastusetüübile: ${typeName}</div>
                `;
        }
        
        previewContent.innerHTML = previewHTML;
        previewSection.style.display = 'block';
        
        // Smooth scroll to preview
        setTimeout(() => {
            previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });

    // Image upload functionality
    const imageUploadArea = document.getElementById('image-upload');
    const fileInput = document.getElementById('file-input');

    imageUploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    imageUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        imageUploadArea.style.borderColor = '#007bff';
        imageUploadArea.style.backgroundColor = '#f0f8ff';
    });

    imageUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        imageUploadArea.style.borderColor = '#ddd';
        imageUploadArea.style.backgroundColor = '#fafafa';
    });

    imageUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
        imageUploadArea.style.borderColor = '#ddd';
        imageUploadArea.style.backgroundColor = '#fafafa';
    });

    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    function handleFileUpload(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Update upload area to show selected image
                imageUploadArea.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                        <img src="${e.target.result}" style="max-width: 100px; max-height: 100px; border-radius: 4px; object-fit: cover;">
                        <div style="color: #666; font-size: 14px;">${file.name}</div>
                        <div style="color: #28a745; font-size: 12px;">✓ Pilt laaditud üles</div>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
            console.log('Image uploaded:', file.name);
        } else {
            alert('Palun valige pildi fail (JPG, PNG, GIF)');
        }
    }

    // Checkbox functionality
    const additionalPointsCheckbox = document.getElementById('additional-points');
    const pointsInput = document.getElementById('points-input');
    const autoControlCheckbox = document.getElementById('auto-control');

    additionalPointsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            pointsInput.style.display = 'block';
            pointsInput.focus();
            console.log('Points input enabled');
        } else {
            pointsInput.style.display = 'none';
            pointsInput.value = '';
            console.log('Points input disabled');
        }
    });

    autoControlCheckbox.addEventListener('change', function() {
        console.log('Auto control:', this.checked ? 'enabled' : 'disabled');
    });

    // Button functionality
    const deleteButton = document.getElementById('delete-question');
    const addButton = document.getElementById('add-question');

    deleteButton.addEventListener('click', function() {
        if (confirm('Kas olete kindel, et soovite küsimuse kustutada?')) {
            // Reset form
            document.getElementById('question-text').value = '';
            dropdownSelected.querySelector('span').textContent = 'Vali vastusetüüp...';
            dropdownSelected.classList.remove('has-value');
            additionalPointsCheckbox.checked = false;
            autoControlCheckbox.checked = false;
            pointsInput.style.display = 'none';
            pointsInput.value = '';
            
            // Reset image upload area
            imageUploadArea.innerHTML = `
                <div class="image-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                    </svg>
                </div>
                <div class="upload-text">Vajuta kastikesele, et laadida pilt üles</div>
            `;
            
            console.log('Question deleted and form reset');
        }
    });

    addButton.addEventListener('click', function() {
        const questionText = document.getElementById('question-text').value.trim();
        const selectedAnswerType = dropdownSelected.classList.contains('has-value') 
            ? dropdownSelected.querySelector('span').textContent 
            : null;
        
        if (!questionText) {
            alert('Palun sisestage küsimuse tekst');
            return;
        }
        
        if (!selectedAnswerType) {
            alert('Palun valige vastusetüüp');
            return;
        }
        
        // Collect form data
        const formData = {
            question: questionText,
            answerType: selectedAnswerType,
            hasPoints: additionalPointsCheckbox.checked,
            points: additionalPointsCheckbox.checked ? pointsInput.value : null,
            autoControl: autoControlCheckbox.checked,
            hasImage: imageUploadArea.querySelector('img') !== null
        };
        
        console.log('Question added:', formData);
        alert('Küsimus lisatud edukalt!');
        
        // Optionally reset form after successful addition
        // (uncomment if you want to reset the form)
        /*
        document.getElementById('question-text').value = '';
        dropdownSelected.querySelector('span').textContent = 'Vali vastusetüüp...';
        dropdownSelected.classList.remove('has-value');
        additionalPointsCheckbox.checked = false;
        autoControlCheckbox.checked = false;
        pointsInput.style.display = 'none';
        pointsInput.value = '';
        */
    });

    // Next question functionality
    const nextQuestion = document.querySelector('.next-question');
    nextQuestion.addEventListener('click', function() {
        console.log('Navigate to next question');
        // Here you would typically navigate to the next question or save current state
    });

    // Initialize points input visibility
    pointsInput.style.display = 'none';
});