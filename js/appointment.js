// appointment.js - Sistema de calendario interactivo para citas
document.addEventListener('DOMContentLoaded', function() {
  // Solo ejecutar en la página de agendar cita
  if (!document.getElementById('appointmentForm')) return;

  console.log('Inicializando sistema de citas...');

  // ========== CONFIGURACIÓN ==========
  const CONFIG = {
    // Horarios de atención
    workingHours: {
      monday: { start: 9, end: 18, slots: 30 }, // Lunes a Viernes 9:00-18:00, citas cada 30 min
      tuesday: { start: 9, end: 18, slots: 30 },
      wednesday: { start: 9, end: 18, slots: 30 },
      thursday: { start: 9, end: 18, slots: 30 },
      friday: { start: 9, end: 18, slots: 30 },
      saturday: { start: 9, end: 14, slots: 30 }, // Sábados 9:00-14:00
      sunday: { closed: true } // Domingos cerrado
    },
    // Días festivos (formato: 'YYYY-MM-DD')
    holidays: [
      '2024-12-25', '2024-12-31', '2025-01-01', '2025-02-05', 
      '2025-03-21', '2025-05-01', '2025-09-16', '2025-11-20'
    ],
    // Horarios ocupados simulados
    busySlots: [
      '2024-12-20T10:00:00', '2024-12-20T14:30:00',
      '2024-12-21T11:00:00', '2024-12-21T16:00:00',
      '2024-12-23T09:30:00'
    ]
  };

  // ========== VARIABLES GLOBALES ==========
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;
  const today = new Date();

  // ========== ELEMENTOS DOM ==========
  const calendarDates = document.getElementById('calendarDates');
  const currentMonthElement = document.getElementById('currentMonth');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const timeSlotsSection = document.getElementById('timeSlots');
  const timeGrid = document.getElementById('timeGrid');
  const selectedDateDisplay = document.getElementById('selectedDateDisplay');
  const selectedAppointment = document.getElementById('selectedAppointment');

  // ========== UTILIDADES DE FECHA ==========
  const DateUtils = {
    months: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    
    formatDate: function(date) {
      const day = date.getDate();
      const month = this.months[date.getMonth()];
      const year = date.getFullYear();
      const dayName = this.days[date.getDay()];
      return `${dayName}, ${day} de ${month} de ${year}`;
    },
    
    formatDateISO: function(date) {
      return date.toISOString().split('T')[0];
    },
    
    isToday: function(date) {
      return this.formatDateISO(date) === this.formatDateISO(today);
    },
    
    isPast: function(date) {
      return date < today;
    },
    
    isWeekend: function(date) {
      return date.getDay() === 0; // Solo domingo cerrado
    },
    
    isHoliday: function(date) {
      return CONFIG.holidays.includes(this.formatDateISO(date));
    },
    
    isWorkingDay: function(date) {
      if (this.isPast(date)) return false;
      if (this.isWeekend(date)) return false;
      if (this.isHoliday(date)) return false;
      return true;
    }
  };

  // ========== GENERACIÓN DE CALENDARIO ==========
  function generateCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Actualizar título del mes
    currentMonthElement.textContent = `${DateUtils.months[month]} ${year}`;
    
    // Primer día del mes y días en el mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Limpiar calendario
    calendarDates.innerHTML = '';
    
    // Días del mes anterior (espacios vacíos)
    for (let i = 0; i < startingDayOfWeek; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-date empty';
      calendarDates.appendChild(emptyDay);
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const dateElement = document.createElement('div');
      const currentDateObj = new Date(year, month, day);
      
      dateElement.className = 'calendar-date';
      dateElement.textContent = day;
      dateElement.dataset.date = DateUtils.formatDateISO(currentDateObj);
      
      // Clases condicionales
      if (DateUtils.isToday(currentDateObj)) {
        dateElement.classList.add('today');
      }
      
      if (!DateUtils.isWorkingDay(currentDateObj)) {
        dateElement.classList.add('disabled');
        if (DateUtils.isWeekend(currentDateObj)) {
          dateElement.title = 'Domingo - Cerrado';
        } else if (DateUtils.isHoliday(currentDateObj)) {
          dateElement.title = 'Día festivo';
        } else if (DateUtils.isPast(currentDateObj)) {
          dateElement.title = 'Fecha pasada';
        }
      } else {
        dateElement.classList.add('available');
        dateElement.addEventListener('click', () => selectDate(currentDateObj));
      }
      
      calendarDates.appendChild(dateElement);
    }
  }

  // ========== SELECCIÓN DE FECHA ==========
  function selectDate(date) {
    // Remover selección anterior
    document.querySelectorAll('.calendar-date').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Seleccionar nueva fecha
    selectedDate = date;
    const dateElement = document.querySelector(`[data-date="${DateUtils.formatDateISO(date)}"]`);
    if (dateElement) {
      dateElement.classList.add('selected');
    }
    
    // Mostrar horarios disponibles
    selectedDateDisplay.textContent = DateUtils.formatDate(date);
    generateTimeSlots(date);
    timeSlotsSection.style.display = 'block';
    
    // Scroll suave a la sección de horarios
    timeSlotsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ========== GENERACIÓN DE HORARIOS ==========
  function generateTimeSlots(date) {
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
    const workingHours = CONFIG.workingHours[dayOfWeek];
    
    timeGrid.innerHTML = '';
    
    if (workingHours.closed) {
      timeGrid.innerHTML = '<p class="no-slots">No hay horarios disponibles para este día.</p>';
      return;
    }
    
    const { start, end, slots } = workingHours;
    const slotsPerHour = 60 / slots; // Slots por hora
    
    for (let hour = start; hour < end; hour++) {
      for (let slotIndex = 0; slotIndex < slotsPerHour; slotIndex++) {
        const minutes = slotIndex * slots;
        const timeSlot = new Date(date);
        timeSlot.setHours(hour, minutes, 0, 0);
        
        // Verificar si el horario ya pasó (solo para hoy)
        if (DateUtils.isToday(date) && timeSlot <= new Date()) {
          continue;
        }
        
        const timeString = timeSlot.toTimeString().slice(0, 5);
        const timeISO = timeSlot.toISOString();
        
        const slotElement = document.createElement('button');
        slotElement.className = 'time-slot';
        slotElement.textContent = timeString;
        slotElement.dataset.time = timeISO;
        
        // Verificar si está ocupado
        if (CONFIG.busySlots.includes(timeISO)) {
          slotElement.classList.add('busy');
          slotElement.title = 'Horario ocupado';
          slotElement.disabled = true;
        } else {
          slotElement.classList.add('available');
          slotElement.addEventListener('click', () => selectTimeSlot(timeSlot, timeString, slotElement));
        }
        
        timeGrid.appendChild(slotElement);
      }
    }
    
    if (timeGrid.children.length === 0) {
      timeGrid.innerHTML = '<p class="no-slots">No hay horarios disponibles para esta fecha.</p>';
    }
  }

  // ========== SELECCIÓN DE HORARIO ==========
  function selectTimeSlot(timeSlot, timeString, element) {
    // Remover selección anterior
    document.querySelectorAll('.time-slot').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Seleccionar nuevo horario
    selectedTime = timeSlot;
    element.classList.add('selected');
    
    // Actualizar campos ocultos
    document.getElementById('selected-date').value = DateUtils.formatDateISO(selectedDate);
    document.getElementById('selected-time').value = timeString;
    
    // Mostrar resumen
    updateAppointmentSummary();
    
    // Scroll al formulario
    document.getElementById('appointmentForm').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest' 
    });
  }

  // ========== ACTUALIZAR RESUMEN ==========
  function updateAppointmentSummary() {
    if (selectedDate && selectedTime) {
      document.getElementById('summaryDate').textContent = DateUtils.formatDate(selectedDate);
      document.getElementById('summaryTime').textContent = selectedTime.toTimeString().slice(0, 5);
      
      const tipoSelect = document.getElementById('tipo-cita');
      const tipoText = tipoSelect.options[tipoSelect.selectedIndex].text;
      document.getElementById('summaryType').textContent = tipoText;
      
      selectedAppointment.style.display = 'block';
    }
  }

  // ========== NAVEGACIÓN DEL CALENDARIO ==========
  function initCalendarNavigation() {
    prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      // No permitir ir más atrás del mes actual
      if (currentDate < new Date(today.getFullYear(), today.getMonth(), 1)) {
        currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
        return;
      }
      generateCalendar(currentDate);
    });
    
    nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      // Limitar a 6 meses en el futuro
      const maxDate = new Date(today.getFullYear(), today.getMonth() + 6, 1);
      if (currentDate > maxDate) {
        currentDate = maxDate;
        return;
      }
      generateCalendar(currentDate);
    });
  }

  // ========== VALIDACIÓN DEL FORMULARIO ==========
  function initFormValidation() {
    const form = document.getElementById('appointmentForm');
    const tipoSelect = document.getElementById('tipo-cita');
    
    // Actualizar resumen cuando cambie el tipo de cita
    tipoSelect.addEventListener('change', updateAppointmentSummary);
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!selectedDate || !selectedTime) {
        window.SiteUtils.showNotification('Por favor selecciona una fecha y hora para tu cita.', 'error');
        return;
      }
      
      // Aquí se enviaría la información al servidor
      console.log('Datos de la cita:', {
        fecha: DateUtils.formatDateISO(selectedDate),
        hora: selectedTime.toTimeString().slice(0, 5),
        tipo: tipoSelect.value,
        nombre: document.getElementById('nombre-completo').value,
        email: document.getElementById('email-cita').value,
        telefono: document.getElementById('telefono-cita').value,
        edad: document.getElementById('edad').value,
        motivo: document.getElementById('motivo-consulta').value
      });
      
      // Simular envío exitoso
      window.SiteUtils.showNotification(
        '¡Solicitud de cita enviada exitosamente! Te contactaremos pronto para confirmar.', 
        'success'
      );
      
      // Resetear formulario
      setTimeout(() => {
        form.reset();
        selectedDate = null;
        selectedTime = null;
        selectedAppointment.style.display = 'none';
        timeSlotsSection.style.display = 'none';
        document.querySelectorAll('.calendar-date, .time-slot').forEach(el => {
          el.classList.remove('selected');
        });
      }, 2000);
    });
  }

  // ========== FUNCIONES AUXILIARES ==========
  function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // Cerrar selecciones
        selectedDate = null;
        selectedTime = null;
        timeSlotsSection.style.display = 'none';
        selectedAppointment.style.display = 'none';
        document.querySelectorAll('.calendar-date, .time-slot').forEach(el => {
          el.classList.remove('selected');
        });
      }
    });
  }

  // ========== ACCESIBILIDAD ==========
  function initAccessibility() {
    // Agregar ARIA labels
    const calendarDates = document.querySelectorAll('.calendar-date');
    calendarDates.forEach(date => {
      if (date.dataset.date) {
        const dateObj = new Date(date.dataset.date);
        date.setAttribute('aria-label', DateUtils.formatDate(dateObj));
        date.setAttribute('role', 'button');
        date.setAttribute('tabindex', '0');
        
        // Navegación con teclado
        date.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (this.classList.contains('available')) {
              this.click();
            }
          }
        });
      }
    });
  }

  // ========== RESPONSIVE DESIGN ==========
  function initResponsiveFeatures() {
    function adjustCalendarForMobile() {
      if (window.innerWidth <= 768) {
        // Ajustes para móvil
        timeGrid.classList.add('mobile-grid');
      } else {
        timeGrid.classList.remove('mobile-grid');
      }
    }
    
    adjustCalendarForMobile();
    window.addEventListener('resize', adjustCalendarForMobile);
  }

  // ========== INICIALIZACIÓN ==========
  function init() {
    try {
      generateCalendar(currentDate);
      initCalendarNavigation();
      initFormValidation();
      initKeyboardNavigation();
      initResponsiveFeatures();
      
      // Inicializar accesibilidad después de generar el calendario
      setTimeout(initAccessibility, 100);
      
      console.log('Sistema de citas inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar sistema de citas:', error);
      window.SiteUtils.showNotification('Error al cargar el calendario. Por favor recarga la página.', 'error');
    }
  }

  // ========== API PÚBLICA ==========
  window.AppointmentSystem = {
    // Obtener fecha seleccionada
    getSelectedDate: () => selectedDate,
    
    // Obtener hora seleccionada
    getSelectedTime: () => selectedTime,
    
    // Recargar calendario
    refresh: () => {
      generateCalendar(currentDate);
      selectedDate = null;
      selectedTime = null;
      timeSlotsSection.style.display = 'none';
      selectedAppointment.style.display = 'none';
    },
    
    // Ir a mes específico
    goToMonth: (year, month) => {
      currentDate = new Date(year, month, 1);
      generateCalendar(currentDate);
    }
  };

  // Inicializar
  init();
});

// ========== ESTILOS CSS PARA EL CALENDARIO ==========
const appointmentStyles = `
  .calendar-container {
    max-width: 400px;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: var(--primary-color);
    color: white;
  }
  
  .calendar-nav {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }
  
  .calendar-nav:hover {
    background-color: rgba(255,255,255,0.2);
  }
  
  .calendar-grid {
    padding: 0;
  }
  
  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #f8f9fa;
    font-weight: 600;
    font-size: 14px;
    color: #666;
  }
  
  .calendar-days > div {
    padding: 12px 8px;
    text-align: center;
  }
  
  .calendar-dates {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #e9ecef;
  }
  
  .calendar-date {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    border: none;
    outline: none;
  }
  
  .calendar-date:hover:not(.disabled) {
    background: var(--accent-color);
    transform: scale(1.05);
  }
  
  .calendar-date.today {
    background: var(--secondary-color);
    color: white;
    font-weight: bold;
  }
  
  .calendar-date.selected {
    background: var(--primary-color);
    color: white;
    font-weight: bold;
  }
  
  .calendar-date.disabled {
    background: #f8f9fa;
    color: #ccc;
    cursor: not-allowed;
  }
  
  .calendar-date.available:focus {
    box-shadow: inset 0 0 0 2px var(--primary-color);
  }
  
  .time-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 10px;
    margin-top: 15px;
  }
  
  .time-grid.mobile-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .time-slot {
    padding: 12px 8px;
    border: 2px solid #e9ecef;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    font-weight: 500;
  }
  
  .time-slot.available:hover {
    border-color: var(--primary-color);
    background: var(--accent-color);
  }
  
  .time-slot.selected {
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: white;
  }
  
  .time-slot.busy {
    background: #f8f9fa;
    color: #999;
    cursor: not-allowed;
    border-color: #dee2e6;
  }
  
  .appointment-summary {
    background: var(--accent-color);
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
  }
  
  .appointment-summary p {
    margin: 5px 0;
    color: var(--text-color);
  }
  
  .no-slots {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    .calendar-container {
      margin: 0;
    }
    
    .calendar-header {
      padding: 15px;
    }
    
    .calendar-days > div {
      padding: 8px 4px;
      font-size: 12px;
    }
    
    .calendar-date {
      font-size: 12px;
    }
    
    .time-slot {
      padding: 10px 6px;
      font-size: 12px;
    }
  }
`;

// Agregar estilos del calendario
const appointmentStyleSheet = document.createElement('style');
appointmentStyleSheet.textContent = appointmentStyles;
document.head.appendChild(appointmentStyleSheet);