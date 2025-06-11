var TaskDetail = /** @class */ (function () {
  function TaskDetail() {
    this.errorCount = 0;
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
    // window.history.back();  // Uncomment to actually navigate back
  };

  TaskDetail.prototype.handleFormSubmit = async function (event) {
    event.preventDefault();

    const formData = {
      name: this.titleInput.value.trim(),
      description: this.descriptionTextarea.value.trim(),
      start: "".concat(this.startDateInput.value, " ").concat(this.startTimeInput.value),
      end: "".concat(this.endDateInput.value, " ").concat(this.endTimeInput.value),
      timelimit: parseInt(this.durationSelect.value),
      // In API, "block" may be a more complex array. For now we use an empty array.
      block: [] 
    };

    console.log('Sending data to API:', formData);

    try {
      const response = await fetch('http://localhost:3006/test/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Test created successfully!');
        this.form.reset();
        window.location.href = '../html/testCreation.html';
      } else {
        alert(result.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('API error:', error);
      alert('Could not connect to the server. Please try again later.');
    }
  };

  return TaskDetail; // Make sure to return the class so that its instance works properly
}()); 

// Create an instance of TaskDetail so that everything starts running
new TaskDetail();
