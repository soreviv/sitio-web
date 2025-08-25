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
                <p>Reserva tu consulta con el Dr. Alejandro Viveros Domínguez. Llena el formulario o contáctanos directamente.</p>
            </div>
            <div class="appointment-container">
                <div class="appointment-info">
                    <h2>Información de la Cita</h2>
                    <div class="info-card">
                        <h3><i class="fas fa-clock"></i> Horarios de Atención</h3>
                        <p>Lunes a Viernes: 9:00 - 18:00<br>
                        Sábados: 9:00 - 14:00<br>
                        Domingos: Cerrado</p>
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
                    <form class="form appointment-form">
                        <h2>Solicitar Cita</h2>
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
                        <div class="form-row">
                            <div class="form-group">
                                <label for="fecha">Fecha preferida</label>
                                <input type="date" id="fecha" name="fecha">
                            </div>
                            <div class="form-group">
                                <label for="hora">Hora preferida</label>
                                <select id="hora" name="hora">
                                    <option value="">Seleccionar hora</option>
                                    <option value="09:00">09:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="14:00">02:00 PM</option>
                                    <option value="15:00">03:00 PM</option>
                                    <option value="16:00">04:00 PM</option>
                                    <option value="17:00">05:00 PM</option>
                                </select>
                            </div>
                        </div>
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
                                    <input type="checkbox" required>
                                    <span class="checkmark"></span> Acepto el <a href="aviso-privacidad.php" target="_blank">Aviso de Privacidad</a> y autorizo el tratamiento de mis datos personales.
                                </label>
                            </div>
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox">
                                    <span class="checkmark"></span>
                                    Deseo recibir información sobre servicios y promociones.
                                </label>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">Solicitar Cita</button>
                        
                        <p class="form-note">
                            * Campos obligatorios. Te contactaremos en las próximas 24 horas para confirmar tu cita.
                        </p>
                    </form>
                </div>
            </div>
            
            <div class="alternative-contact">
                <h2>¿Prefieres contacto directo?</h2>
                <div class="contact-options">
                    <a href="tel:+525512345678" class="contact-option">
                        <i class="fas fa-phone"></i>
                        Llamar Ahora
                    </a>
                    <a href="https://wa.me/525512345678?text=Hola,%20me%20gustaría%20agendar%20una%20cita" 
                       target="_blank" class="contact-option whatsapp">
                        <i class="fab fa-whatsapp"></i>
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    </section>
<?php include '_footer.php'; ?>