<?php include '_header.php'; ?>
  <title>Contacto - Dr. Alejandro Viveros Domínguez | Otorrinolaringólogo CDMX</title>
  <meta name="description"
    content="Contacta al Dr. Alejandro Viveros Domínguez, especialista en otorrinolaringología en Ciudad de México. Dirección, teléfono, horarios y ubicación.">
  <link rel="canonical" href="https://otorrinonet.com/contacto.php">

  <!-- Contact Section -->
<section class="contact-section">
    <div class="container">
      <div class="page-header">
        <h1>Contacto</h1>
        <p>Estamos aquí para atenderte. Contáctanos para más información.</p>
      </div>

      <div class="contact-container">
        <!-- Contact Info -->
        <div class="contact-info">
          <h2>Información de Contacto</h2>

          <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <h3>Dirección</h3>
              <p>Buenavista 20<br>
                Col. Lindavista, Gustavo A Madero<br>
                Ciudad de México, C.P. 07300</p>
            </div>
          </div>

          <div class="contact-item">
            <i class="fas fa-phone"></i>
            <div>
              <h3>Teléfono</h3>
              <p><a href="tel:+525512345678">+52 55 1234-5678</a></p>
              <small>Lunes a Viernes: 9:00 - 18:00<br>Sábados: 9:00 - 14:00</small>
            </div>
          </div>

          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <div>
              <h3>Correo Electrónico</h3>
              <p><a href="mailto:contacto@otorrinonet.com">contacto@otorrinonet.com</a></p>
            </div>
          </div>

          <div class="contact-item">
            <i class="fas fa-clock"></i>
            <div>
              <h3>Horarios de Atención</h3>
              <p>Lunes a Viernes: 9:00 AM - 6:00 PM<br>
              Sábados: 9:00 AM - 2:00 PM<br>
              Domingos: Cerrado</p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form-container">
          <form class="form contact-form">
            <h2>Enviar Mensaje</h2>
            <div class="form-row">
              <div class="form-group">
                <label for="nombre">Nombre completo *</label>
                <input type="text" id="nombre" name="nombre" required>
              </div>
              <div class="form-group">
                <label for="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono">
              </div>
            </div>
            <div class="form-group">
              <label for="email">Correo electrónico *</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="asunto">Asunto</label>
              <select id="asunto" name="asunto">
                <option value="">Seleccionar asunto</option>
                <option value="cita">Solicitar cita</option>
                <option value="informacion">Solicitar información</option>
                <option value="segunda_opinion">Segunda opinión</option>
                <option value="seguros">Seguros médicos</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div class="form-group">
              <label for="mensaje">Mensaje *</label>
              <textarea id="mensaje" name="mensaje" rows="5" required placeholder="Escribe tu mensaje aquí..."></textarea>
            </div>
            
            <div class="consent-section">
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" required>
                  <span class="checkmark"></span> Acepto el <a href="aviso-privacidad.php" target="_blank">Aviso de Privacidad</a> y autorizo el tratamiento de mis datos personales.
                </label>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary">Enviar Mensaje</button>
            
            <p class="form-note">
              * Campos obligatorios. Responderemos en las próximas 24 horas.
            </p>
          </form>
        </div>
      </div>

      <!-- Map Section -->
      <div class="map-container">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.1!2d-99.1269!3d19.4978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f8b42d92b939%3A0x2a35c3f1b3b3b3b3!2sBuenavista%2020%2C%20Lindavista%2C%2007300%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1000000000000!5m2!1ses!2smx"
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          title="Ubicación Dr. Alejandro Viveros Domínguez">
        </iframe>
      </div>

      <!-- Alternative Contact -->
      <div class="alternative-contact">
        <h2>Contacto Directo</h2>
        <div class="contact-options">
          <a href="tel:+525512345678" class="contact-option">
            <i class="fas fa-phone"></i>
            Llamar Ahora
          </a>
          <a href="https://wa.me/525512345678?text=Hola,%20necesito%20información" 
             target="_blank" class="contact-option whatsapp">
            <i class="fab fa-whatsapp"></i>
            WhatsApp
          </a>
          <a href="mailto:contacto@otorrinonet.com" class="contact-option">
            <i class="fas fa-envelope"></i>
            Email
          </a>
        </div>
      </div>

    </div>
  </section>
<?php include '_footer.php'; ?>