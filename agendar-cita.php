<?php include '_header.php'; ?>
    <title>Agendar Cita - Dr. Alejandro Viveros Domínguez | Otorrinolaringólogo CDMX</title>
    <meta name="description"
        content="Agenda tu cita con el Dr. Alejandro Viveros Domínguez, especialista en otorrinolaringología en Ciudad de México. Horarios, dirección y contacto.">
    <link rel="canonical" href="https://otorrinonet.com/agendar-cita.php">

    <!-- Appointment Section -->
<section class="appointment-section">
        <div class="container">
            <div class="page-header">
                <h1>Agendar Cita</h1>
                <p>Selecciona un día y hora disponibles en el calendario para reservar tu consulta.</p>
            </div>
            <div class="appointment-container">
                <div class="appointment-info">
                    <h2>Información de la Cita</h2>
                    <div class="info-card">
                        <h3><i class="fas fa-clock"></i> Horarios de Atención</h3>
                        <p>Lunes a Miércoles: 16:00 - 20:00<br>
                        Jueves y Viernes: 10:00 - 13:00<br>
                        Sábados y Domingos: Cerrado</p>
                    </div>
                    <div class="info-card">
                        <h3><i class="fas fa-map-marker-alt"></i> Ubicación</h3>
                        <p>Buenavista 20<br>
                        Col. Lindavista<br>
                        07300, Gustavo A Madero<br>
                        Ciudad de México</p>
                    </div>
                    <div class="info-card">
                        <h3><i class="fas fa-phone"></i> Contacto Directo</h3>
                        <p>Teléfono: +52 55 1234-5678<br>
                        Email: contacto@otorrinonet.com</p>
                    </div>
                </div>
                
                <div class="appointment-form-container">
                    <form class="form appointment-form" id="appointmentForm">
                        <h2>1. Completa tus datos</h2>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="nombre">Nombre completo *</label>
                                <input type="text" id="nombre" name="nombre" required>
                            </div>
                            <div class="form-group">
                                <label for="telefono">Teléfono *</label>
                                <input type="tel" id="telefono" name="telefono" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email">Correo electrónico *</label>
                            <input type="email" id="email" name="email" required>
                        </div>

                        <h2>2. Elige fecha y hora</h2>
                        <div class="calendar-container">
                            <div id="calendar"></div>
                        </div>

                        <div class="time-slots-container" id="time-slots-container">
                            <h3>Horarios Disponibles</h3>
                            <div id="slots-loader">Cargando...</div>
                            <div id="time-slots"></div>
                        </div>

                        <!-- Campos ocultos para enviar fecha y hora -->
                        <input type="hidden" id="selected_date" name="fecha">
                        <input type="hidden" id="selected_time" name="hora">

                        <h2>3. Motivo de la consulta</h2>
                        <div class="form-group">
                            <label for="tipo_consulta">Tipo de consulta</label>
                            <select id="tipo_consulta" name="tipo_consulta">
                                <option value="">Seleccionar tipo</option>
                                <option value="primera_vez">Primera vez</option>
                                <option value="seguimiento">Seguimiento</option>
                                <option value="segunda_opinion">Segunda opinión</option>
                                <option value="cirugia">Consulta de cirugía</option>
                                <option value="audiometria">Audiometría</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="mensaje">Motivo de consulta o síntomas</label>
                            <textarea id="mensaje" name="mensaje" rows="4" placeholder="Describe brevemente el motivo de tu consulta..."></textarea>
                        </div>
                        
                        <div class="consent-section">
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" name="consentimiento" required>
                                    <span class="checkmark"></span> Acepto el <a href="aviso-privacidad.php" target="_blank">Aviso de Privacidad</a> y autorizo el tratamiento de mis datos personales.
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Solicitar Cita</button>
                        <p id="form-message" class="form-note"></p>
                    </form>
                </div>
            </div>
        </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const timeSlotsDiv = document.getElementById('time-slots');
    const loader = document.getElementById('slots-loader');
    const selectedDateInput = document.getElementById('selected_date');
    const selectedTimeInput = document.getElementById('selected_time');
    const form = document.getElementById('appointmentForm');
    const formMessage = document.getElementById('form-message');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        selectable: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        validRange: {
            start: new Date().toISOString().split('T')[0] // Desde hoy
        },
        dayCellDidMount: function(info) {
            if (info.date.getDay() === 0 || info.date.getDay() === 6) { // 0=Domingo, 6=Sábado
                info.el.classList.add('fc-day-disabled');
            }
        },
        dateClick: function(info) {
            if (info.dayEl.classList.contains('fc-day-disabled')) {
                return; // No hacer nada en días deshabilitados
            }

            selectedDateInput.value = info.dateStr;
            timeSlotsContainer.style.display = 'block';
            timeSlotsDiv.innerHTML = '';
            loader.style.display = 'block';
            loader.textContent = 'Buscando horarios para el ' + info.date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            // Des-seleccionar hora previa
            selectedTimeInput.value = '';

            fetch(`get_available_slots.php?date=${info.dateStr}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la red o en el servidor.');
                    }
                    return response.json();
                })
                .then(slots => {
                    loader.style.display = 'none';
                    if (slots.length === 0) {
                        timeSlotsDiv.innerHTML = '<p>No hay horarios disponibles para este día.</p>';
                    } else {
                        slots.forEach(slot => {
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'time-slot-btn';
                            btn.textContent = slot;
                            btn.dataset.time = slot;
                            timeSlotsDiv.appendChild(btn);

                            btn.addEventListener('click', function() {
                                // Quitar clase selected de otros botones
                                document.querySelectorAll('.time-slot-btn.selected').forEach(b => b.classList.remove('selected'));
                                // Añadir clase al seleccionado
                                this.classList.add('selected');
                                // Guardar valor
                                selectedTimeInput.value = this.dataset.time;
                            });
                        });
                    }
                })
                .catch(error => {
                    loader.style.display = 'none';
                    timeSlotsDiv.innerHTML = `<p style="color: red;">Error al cargar los horarios. Por favor, intente de nuevo.</p>`;
                    console.error('Error fetching slots:', error);
                });
        }
    });

    calendar.render();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        formMessage.textContent = 'Enviando...';

        if (!selectedDateInput.value || !selectedTimeInput.value) {
            formMessage.textContent = 'Por favor, seleccione una fecha y hora en el calendario.';
            formMessage.style.color = 'red';
            return;
        }

        const formData = new FormData(form);

        fetch('procesar-formulario.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                formMessage.style.color = 'green';
                form.reset();
                calendar.unselect();
                timeSlotsContainer.style.display = 'none';
                // Opcional: Redirigir o mostrar un mensaje más permanente
            } else {
                formMessage.style.color = 'red';
            }
            formMessage.textContent = data.message;
        })
        .catch(error => {
            formMessage.style.color = 'red';
            formMessage.textContent = 'Ocurrió un error de red. Intente de nuevo.';
            console.error('Submit error:', error);
        });
    });
});
</script>

<?php include '_footer.php'; ?>