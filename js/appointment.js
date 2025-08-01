// Interactive appointment booking system
class AppointmentCalendar {
    constructor(container) {
        this.container = container;
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.availableHours = {
            'monday': ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
            'tuesday': ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
            'wednesday': ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
            'thursday': ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
            'friday': ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
            'saturday': ['09:00', '10:00', '11:00', '12:00'],
            'sunday': [] // Closed on Sundays
        };
        this.bookedSlots = new Set(); // In a real app, this would come from the backend
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="calendar-header">
                <button type="button" class="calendar-nav" id="prev-month">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h3 id="calendar-title">${this.getMonthYear()}</h3>
                <button type="button" class="calendar-nav" id="next-month">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="calendar-grid">
                ${this.renderCalendarDays()}
            </div>
            <div class="time-slots" id="time-slots" style="display: none;">
                <h4>Horarios disponibles para <span id="selected-date-display"></span></h4>
                <div class="time-grid" id="time-grid"></div>
            </div>
        `;
    }

    getMonthYear() {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    renderCalendarDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const today = new Date();
        
        let html = '<div class="calendar-weekdays">';
        const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        weekdays.forEach(day => {
            html += `<div class="weekday">${day}</div>`;
        });
        html += '</div><div class="calendar-days">';

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const currentDateObj = new Date(year, month, day);
            const isToday = this.isSameDate(currentDateObj, today);
            const isPast = currentDateObj < today && !isToday;
            const isAvailable = this.isDayAvailable(currentDateObj);
            
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isPast) classes += ' past';
            if (!isAvailable || isPast) classes += ' unavailable';
            if (this.selectedDate && this.isSameDate(currentDateObj, this.selectedDate)) {
                classes += ' selected';
            }

            html += `<div class="${classes}" data-date="${year}-${month}-${day}">${day}</div>`;
        }

        html += '</div>';
        return html;
    }

    isDayAvailable(date) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[date.getDay()];
        return this.availableHours[dayName] && this.availableHours[dayName].length > 0;
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    attachEventListeners() {
        // Navigation buttons
        this.container.querySelector('#prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
            this.attachEventListeners();
        });

        this.container.querySelector('#next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
            this.attachEventListeners();
        });

        // Day selection
        this.container.querySelectorAll('.calendar-day:not(.past):not(.unavailable):not(.empty)').forEach(day => {
            day.addEventListener('click', (e) => {
                const [year, month, dayNum] = e.target.dataset.date.split('-').map(Number);
                this.selectedDate = new Date(year, month, dayNum);
                this.selectedTime = null;
                this.updateSelectedDate();
                this.showTimeSlots();
            });
        });
    }

    updateSelectedDate() {
        // Update selected day styling
        this.container.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        const selectedDayElement = this.container.querySelector(`[data-date="${this.selectedDate.getFullYear()}-${this.selectedDate.getMonth()}-${this.selectedDate.getDate()}"]`);
        if (selectedDayElement) {
            selectedDayElement.classList.add('selected');
        }
    }

    showTimeSlots() {
        const timeSlotsContainer = this.container.querySelector('#time-slots');
        const timeGrid = this.container.querySelector('#time-grid');
        const selectedDateDisplay = this.container.querySelector('#selected-date-display');

        // Format date for display
        const dateStr = this.selectedDate.toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        selectedDateDisplay.textContent = dateStr;

        // Get available times for selected day
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[this.selectedDate.getDay()];
        const availableTimes = this.availableHours[dayName] || [];

        // Render time slots
        timeGrid.innerHTML = '';
        availableTimes.forEach(time => {
            const timeSlot = document.createElement('button');
            timeSlot.type = 'button';
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            timeSlot.dataset.time = time;

            // Check if slot is booked
            const slotKey = `${this.selectedDate.toDateString()}-${time}`;
            if (this.bookedSlots.has(slotKey)) {
                timeSlot.classList.add('booked');
                timeSlot.disabled = true;
            }

            timeSlot.addEventListener('click', () => this.selectTime(time, timeSlot));
            timeGrid.appendChild(timeSlot);
        });

        timeSlotsContainer.style.display = 'block';
    }

    selectTime(time, element) {
        // Remove previous selection
        this.container.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Add selection to clicked element
        element.classList.add('selected');
        this.selectedTime = time;

        // Update hidden form fields
        this.updateFormFields();
    }

    updateFormFields() {
        if (this.selectedDate && this.selectedTime) {
            const dateInput = document.querySelector('#appointment-date');
            const timeInput = document.querySelector('#appointment-time');
            
            if (dateInput) {
                dateInput.value = this.selectedDate.toISOString().split('T')[0];
            }
            if (timeInput) {
                timeInput.value = this.selectedTime;
            }

            // Trigger form validation
            const event = new Event('change', { bubbles: true });
            if (dateInput) dateInput.dispatchEvent(event);
            if (timeInput) timeInput.dispatchEvent(event);
        }
    }

    getSelectedDateTime() {
        if (!this.selectedDate || !this.selectedTime) {
            return null;
        }

        const [hours, minutes] = this.selectedTime.split(':').map(Number);
        const dateTime = new Date(this.selectedDate);
        dateTime.setHours(hours, minutes, 0, 0);
        return dateTime;
    }
}

// Appointment form validator
class AppointmentFormValidator extends FormValidator {
    constructor(form) {
        super(form);
        this.calendar = null;
        this.initCalendar();
    }

    initCalendar() {
        const calendarContainer = document.getElementById('appointment-calendar');
        if (calendarContainer) {
            this.calendar = new AppointmentCalendar(calendarContainer);
        }
    }

    validateForm() {
        // Add custom validation for appointment fields
        const dateField = this.form.querySelector('#appointment-date');
        const timeField = this.form.querySelector('#appointment-time');

        if (dateField && !dateField.value) {
            this.errors['appointment-date'] = 'Selecciona una fecha para tu cita';
        }

        if (timeField && !timeField.value) {
            this.errors['appointment-time'] = 'Selecciona un horario para tu cita';
        }

        // Validate consent checkboxes
        const consentCheckbox = this.form.querySelector('#privacy-consent');
        if (consentCheckbox && !consentCheckbox.checked) {
            this.errors['privacy-consent'] = 'Debes aceptar el aviso de privacidad para continuar';
        }

        // Call parent validation
        super.validateForm();
    }

    onSuccess() {
        const data = this.getFormData();
        const selectedDateTime = this.calendar?.getSelectedDateTime();

        if (selectedDateTime) {
            data.appointmentDateTime = selectedDateTime.toISOString();
        }

        this.showLoadingState();
        
        // Simulate booking process
        setTimeout(() => {
            this.hideLoadingState();
            
            // Mark slot as booked (in real app, this would be done by backend)
            if (this.calendar && selectedDateTime) {
                const slotKey = `${selectedDateTime.toDateString()}-${this.calendar.selectedTime}`;
                this.calendar.bookedSlots.add(slotKey);
            }

            if (window.showNotification) {
                showNotification(
                    'Tu cita ha sido agendada exitosamente. Recibirás un correo de confirmación.',
                    'success'
                );
            }

            // Reset form and calendar
            this.form.reset();
            if (this.calendar) {
                this.calendar.selectedDate = null;
                this.calendar.selectedTime = null;
                this.calendar.render();
                this.calendar.attachEventListeners();
            }

            // Hide time slots
            const timeSlots = document.getElementById('time-slots');
            if (timeSlots) {
                timeSlots.style.display = 'none';
            }
        }, 2000);
    }

    showLoadingState() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Agendando...';
        }
    }

    hideLoadingState() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Agendar Cita';
        }
    }
}

// Initialize appointment system
document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        new AppointmentFormValidator(appointmentForm);
    }
});

// Calendar and appointment styles
const appointmentStyles = `
    .calendar-container {
        max-width: 500px;
        margin: 0 auto 30px;
        background: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        padding: 20px;
    }

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .calendar-nav {
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        transition: var(--transition);
    }

    .calendar-nav:hover {
        background: var(--secondary-color);
    }

    .calendar-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        margin-bottom: 10px;
    }

    .weekday {
        text-align: center;
        font-weight: 600;
        color: var(--text-light);
        padding: 10px 5px;
        font-size: 0.9rem;
    }

    .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
    }

    .calendar-day {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 4px;
        transition: var(--transition);
        font-weight: 500;
        position: relative;
    }

    .calendar-day:not(.empty):not(.past):not(.unavailable):hover {
        background: var(--accent-color);
        color: var(--primary-color);
    }

    .calendar-day.today {
        background: var(--primary-color);
        color: white;
    }

    .calendar-day.selected {
        background: var(--secondary-color);
        color: white;
    }

    .calendar-day.past,
    .calendar-day.unavailable {
        color: #ccc;
        cursor: not-allowed;
    }

    .calendar-day.empty {
        cursor: default;
    }

    .time-slots {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
    }

    .time-slots h4 {
        margin-bottom: 15px;
        color: var(--primary-color);
    }

    .time-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 10px;
    }

    .time-slot {
        padding: 12px 16px;
        border: 1px solid var(--border-color);
        background: white;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
        font-size: 0.9rem;
        font-weight: 500;
    }

    .time-slot:hover:not(.booked):not(:disabled) {
        border-color: var(--primary-color);
        background: var(--accent-color);
    }

    .time-slot.selected {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .time-slot.booked {
        background: #f5f5f5;
        color: #999;
        cursor: not-allowed;
        position: relative;
    }

    .time-slot.booked::after {
        content: "Ocupado";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.7rem;
        background: #999;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
    }

    .appointment-form-section {
        background: white;
        padding: 30px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        margin-top: 30px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }

    .disclaimer-box {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: var(--border-radius);
        padding: 15px;
        margin: 20px 0;
        font-size: 0.9rem;
        color: var(--text-light);
    }

    .consent-section {
        background: #f8f9fa;
        border-radius: var(--border-radius);
        padding: 20px;
        margin: 20px 0;
    }

    .consent-section h4 {
        color: var(--primary-color);
        margin-bottom: 15px;
    }

    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .time-grid {
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        }
        
        .calendar-container {
            padding: 15px;
        }
    }
`;

// Inject appointment styles
const appointmentStyleSheet = document.createElement('style');
appointmentStyleSheet.textContent = appointmentStyles;
document.head.appendChild(appointmentStyleSheet);