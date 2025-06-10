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
        if (!this.validateForm())
            return;
        var formData = {
            title: this.titleInput.value.trim(),
            duration: parseInt(this.durationSelect.value),
            description: this.descriptionTextarea.value.trim(),
            startDateTime: "".concat(this.startDateInput.value, " ").concat(this.startTimeInput.value),
            endDateTime: "".concat(this.endDateInput.value, " ").concat(this.endTimeInput.value)
        };
        console.log('Form submitted:', formData);
        alert('Testi detailid on koostatud!');
        this.form.reset();
    };
    TaskDetail.prototype.validateForm = function () {
        if (!this.titleInput.value.trim()) {
            alert('Palun sisestage pealkiri!');
            return false;
        }
        var start = new Date("".concat(this.startDateInput.value, "T").concat(this.startTimeInput.value));
        var end = new Date("".concat(this.endDateInput.value, "T").concat(this.endTimeInput.value));
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            alert('Palun sisestage kehtivad kuupäevad ja kellaajad!');
            return false;
        }
        if (start >= end) {
            alert('Algus peab olema enne lõppu!');
            return false;
        }
        return true;
    };
    return TaskDetail;
}());
document.addEventListener('DOMContentLoaded', function (event) {
    new TaskDetail();
});
