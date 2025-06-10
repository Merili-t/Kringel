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
        // window.history.back();
    };

    TaskDetail.prototype.handleFormSubmit = function (event) {
        event.preventDefault();

        var formData = {
            title: this.titleInput.value.trim(),
            duration: parseInt(this.durationSelect.value),
            description: this.descriptionTextarea.value.trim(),
            startDateTime: "".concat(this.startDateInput.value, " ").concat(this.startTimeInput.value),
            endDateTime: "".concat(this.endDateInput.value, " ").concat(this.endTimeInput.value)
        };

        console.log('Form submitted:', formData);
        this.form.reset();

        window.location.href = '../make_question/koostamine.html';
    };

    return TaskDetail;
}());

document.addEventListener('DOMContentLoaded', function (event) {
    new TaskDetail();
});
