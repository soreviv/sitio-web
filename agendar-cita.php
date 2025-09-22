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
                    <form class="form appointment-form" action="procesar-formulario.php" method="POST" id="appointmentForm">
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

                        <!-- hCaptcha widget -->
                        <div class="form-group">
                            <div class="h-captcha" data-sitekey="2cfea90c-92fa-4186-91d6-0f685674e330"></div>
                        </div>

                        <p id="form-message" class="form-note">* Campos obligatorios. Te contactaremos en las próximas 24 horas para confirmar tu cita.</p>
                    </form>
                </div>
            </div>
        </div>
</section>

<script nonce="<?php echo htmlspecialchars($nonce, ENT_QUOTES); ?>">
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

            // Remover selección previa del calendario
            calendar.unselect();

            selectedDateInput.value = info.dateStr;
            timeSlotsContainer.style.display = 'block';
            timeSlotsDiv.innerHTML = '';
            loader.style.display = 'block';
            loader.textContent = 'Buscando horarios disponibles...';

            // Des-seleccionar hora previa
            selectedTimeInput.value = '';

            // Agregar animación de carga
            timeSlotsContainer.classList.add('loading');

            fetch(`get_available_slots.php?date=${info.dateStr}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la red o en el servidor.');
                    }
                    return response.json();
                })
                .then(slots => {
                    loader.style.display = 'none';
                    timeSlotsContainer.classList.remove('loading');

                    if (slots.length === 0) {
                        timeSlotsDiv.innerHTML = `
                            <div class="no-slots">
                                <i class="fas fa-calendar-times"></i>
                                <p>No hay horarios disponibles para este día.</p>
                                <small>Selecciona otra fecha para ver más opciones.</small>
                            </div>
                        `;
                    } else {
                        // Crear header para los horarios
                        const slotsHeader = document.createElement('div');
                        slotsHeader.className = 'slots-header';
                        slotsHeader.innerHTML = `
                            <h4><i class="fas fa-clock"></i> Horarios disponibles</h4>
                            <span class="slots-count">${slots.length} horario${slots.length !== 1 ? 's' : ''} disponible${slots.length !== 1 ? 's' : ''}</span>
                        `;
                        timeSlotsDiv.appendChild(slotsHeader);

                        // Crear grid de horarios
                        const slotsGrid = document.createElement('div');
                        slotsGrid.className = 'time-slots-grid';

                        slots.forEach((slot, index) => {
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'time-slot-btn';
                            btn.textContent = slot;
                            btn.dataset.time = slot;

                            // Agregar delay para animación staggered
                            btn.style.animationDelay = `${index * 50}ms`;

                            slotsGrid.appendChild(btn);

                            btn.addEventListener('click', function() {
                                // Quitar clase selected de otros botones
                                document.querySelectorAll('.time-slot-btn.selected').forEach(b => b.classList.remove('selected'));
                                // Añadir clase al seleccionado
                                this.classList.add('selected');
                                // Guardar valor
                                selectedTimeInput.value = this.dataset.time;

                                // Mostrar confirmación visual
                                showNotification(`Horario seleccionado: ${slot}`, 'success');
                            });
                        });

                        timeSlotsDiv.appendChild(slotsGrid);
                    }
                })
                .catch(error => {
                    loader.style.display = 'none';
                    timeSlotsContainer.classList.remove('loading');
                    timeSlotsDiv.innerHTML = `
                        <div class="error-slots">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Error al cargar los horarios</p>
                            <small>Por favor, intenta de nuevo o contacta al consultorio.</small>
                        </div>
                    `;
                    console.error('Error fetching slots:', error);
                });
        }
    });

    calendar.render();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        formMessage.textContent = 'Enviando...';
        formMessage.classList.remove('text-danger', 'text-success');

        if (!selectedDateInput.value || !selectedTimeInput.value) {
            formMessage.textContent = 'Por favor, seleccione una fecha y hora en el calendario.';
            formMessage.classList.add('text-danger');
            return;
        }

        const formData = new FormData(form);

        fetch('procesar-formulario.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            formMessage.classList.remove('text-danger', 'text-success');
            if (data.status === 'success') {
                formMessage.classList.add('text-success');
                form.reset();
                calendar.unselect();
                timeSlotsContainer.style.display = 'none';
            } else {
                formMessage.classList.add('text-danger');
            }
            formMessage.textContent = data.message;
        })
        .catch(error => {
            formMessage.classList.remove('text-danger', 'text-success');
            formMessage.classList.add('text-danger');
            formMessage.textContent = 'Ocurrió un error de red. Intente de nuevo.';
            console.error('Submit error:', error);
        });
    });

    // Función para mostrar notificaciones
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Agregar al DOM
        document.body.appendChild(notification);

        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto-cerrar después de 3 segundos
        const autoClose = setTimeout(() => closeNotification(notification), 3000);

        // Cerrar manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoClose);
            closeNotification(notification);
        });
    }

    function closeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
});
</script>

<?php include '_footer.php'; ?>