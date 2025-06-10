var TaskDetail = /** @class */ (function () {
    function TaskDetail() {
        this.errorCount = 0;
        // Try different API URLs if one fails
        this.apiUrls = [
            'http://localhost:3006/test/upload',
            'http://127.0.0.1:3006/test/upload',
            'http://localhost:3000/test/upload',
            'http://localhost:8000/test/upload'
        ];
        this.currentUrlIndex = 0;
        
        // Initialize form elements
        this.titleInput = document.getElementById('title');
        this.durationSelect = document.getElementById('duration');
        this.descriptionTextarea = document.getElementById('description');
        this.startDateInput = document.getElementById('startDate');
        this.startTimeInput = document.getElementById('startTime');
        this.endDateInput = document.getElementById('endDate');
        this.endTimeInput = document.getElementById('endTime');
        this.form = document.getElementById('detailForm');
        this.backButton = document.querySelector('.back-button');
        
        this.initEventListeners();
        this.populateDurationDropdown();
    }

    TaskDetail.prototype.initEventListeners = function () {
        this.backButton.addEventListener('click', this.handleBackButton.bind(this));
        this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    };

    TaskDetail.prototype.populateDurationDropdown = function () {
        var _this = this;
        var durations = [5, 10, 15, 20, 30, 45, 60, 90, 120];
        durations.forEach(function (mins) {
            var option = document.createElement('option');
            option.value = mins.toString();
            option.textContent = "".concat(mins, " min");
            _this.durationSelect.appendChild(option);
        });
    };

    TaskDetail.prototype.handleBackButton = function (event) {
        event.preventDefault();
        alert('Navigating back...');
        // window.history.back();
    };

    TaskDetail.prototype.tryApiCall = async function(formData, urlIndex = 0) {
        if (urlIndex >= this.apiUrls.length) {
            throw new Error('All API endpoints failed');
        }

        const apiUrl = this.apiUrls[urlIndex];
        console.log(`Trying API URL: ${apiUrl}`);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                mode: 'cors', // Explicitly set CORS mode
                credentials: 'omit' // Don't send credentials for now
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Failed with ${apiUrl}:`, error);
            // Try next URL
            return this.tryApiCall(formData, urlIndex + 1);
        }
    };

    TaskDetail.prototype.getCurrentUserId = function() {
        // TODO: Implement user authentication logic
        // For now, return a dummy UUID or get from session/localStorage
        // You should get this from your authentication system
        return localStorage.getItem('userId') || 'temp-user-id-' + Date.now();
    };

    TaskDetail.prototype.handleFormSubmit = async function (event) {
        event.preventDefault();
        
        // Validate form data
        if (!this.titleInput.value.trim()) {
            alert('Palun sisesta ülesande pealkiri');
            return;
        }
        
        if (!this.startDateInput.value || !this.startTimeInput.value) {
            alert('Palun sisesta alguskuupäev ja -kellaaeg');
            return;
        }
        
        if (!this.endDateInput.value || !this.endTimeInput.value) {
            alert('Palun sisesta lõppkuupäev ja -kellaaeg');
            return;
        }

        const formData = {
            name: this.titleInput.value.trim(),
            description: this.descriptionTextarea.value.trim(),
            start: `${this.startDateInput.value} ${this.startTimeInput.value}`,
            end: `${this.endDateInput.value} ${this.endTimeInput.value}`,
            time_limit: parseInt(this.durationSelect.value),
            user_id: this.getCurrentUserId() // You'll need to implement this
        };

        console.log('Saadame API-le:', formData);

        try {
            const result = await this.tryApiCall(formData);
            alert('Test edukalt loodud!');
            this.form.reset();
            window.location.href = '../make_question/koostamine.html';
        } catch (error) {
            console.error('API viga:', error);
            
            // Provide more specific error messages
            if (error.message.includes('All API endpoints failed')) {
                alert('Serveriga ei saanud ühendust ühegi API otspunkti kaudu. Kontrolli, kas server töötab ja on õigel pordil.');
            } else if (error.message.includes('CORS')) {
                alert('CORS viga: Server ei luba päringuid sellest domeenist. Kontrolli serveri CORS seadistusi.');
            } else {
                alert(`Viga: ${error.message}`);
            }
        }
    };

    return TaskDetail;
}());

// Create instance to initialize everything
new TaskDetail();