// script.js
// Funciones de debugging y manejo de errores

const DEBUG = true; // Activar/desactivar modo debug

function logger(type, message, data = null) {
    if (!DEBUG) return;
    
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type}: ${message}`;
    
    switch(type) {
        case 'ERROR':
            console.error(logMessage, data);
            break;
        case 'WARN':
            console.warn(logMessage, data);
            break;
        case 'INFO':
            console.info(logMessage, data);
            break;
        default:
            console.log(logMessage, data);
    }
}

function validateFormField(value, fieldName, rules = {}) {
    try {
        const trimmedValue = value.trim();
        if (!trimmedValue && rules.required) {
            throw new Error(`El campo ${fieldName} es requerido`);
        }
        
        if (rules.email && !/^\S+@\S+\.\S+$/.test(trimmedValue)) {
            throw new Error('El formato del correo electrónico no es válido');
        }
        
        if (rules.minLength && trimmedValue.length < rules.minLength) {
            throw new Error(`${fieldName} debe tener al menos ${rules.minLength} caracteres`);
        }
        
        return { isValid: true, value: trimmedValue };
    } catch (error) {
        logger('ERROR', `Validación fallida para ${fieldName}:`, error.message);
        return { isValid: false, error: error.message };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    logger('INFO', 'Iniciando aplicación...');

    try {
        // Variables globales
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const appointmentForm = document.getElementById('appointmentForm');
        const contactForm = document.getElementById('contactForm');

        if (!hamburger) logger('WARN', 'Elemento hamburger no encontrado');
        if (!navMenu) logger('WARN', 'Elemento navMenu no encontrado');
        if (!appointmentForm) logger('WARN', 'Formulario de citas no encontrado');
        if (!contactForm) logger('WARN', 'Formulario de contacto no encontrado');

  // Validación de formulario de cita
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      logger('INFO', 'Iniciando validación del formulario de citas');

      const validations = [
        validateFormField(appointmentForm.nombre.value, 'Nombre', { required: true }),
        validateFormField(appointmentForm.email.value, 'Email', { required: true, email: true }),
        validateFormField(appointmentForm.telefono.value, 'Teléfono', { required: true, minLength: 8 }),
        validateFormField(appointmentForm.fecha.value, 'Fecha', { required: true })
      ];

      const errors = validations
        .filter(v => !v.isValid)
        .map(v => v.error);

      if (errors.length > 0) {
        logger('WARN', 'Errores en el formulario de citas:', errors);
        alert(errors.join('\n'));
        return;
      }

      logger('INFO', 'Formulario de citas válido, procediendo con el envío');
      appointmentForm.submit();
    });
  }

  // Validación de formulario de contacto
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      logger('INFO', 'Iniciando validación del formulario de contacto');

      const validations = [
        validateFormField(contactForm.nombre.value, 'Nombre', { required: true }),
        validateFormField(contactForm.email.value, 'Email', { required: true, email: true }),
        validateFormField(contactForm.mensaje.value, 'Mensaje', { required: true })
      ];

      const errors = validations
        .filter(v => !v.isValid)
        .map(v => v.error);

      if (errors.length > 0) {
        logger('WARN', 'Errores en el formulario de contacto:', errors);
        alert(errors.join('\n'));
        return;
      }

      logger('INFO', 'Formulario de contacto válido, procediendo con el envío');
      contactForm.submit();
    });
  }

  logger('INFO', 'Inicialización completada');
} catch (error) {
    logger('ERROR', 'Error durante la inicialización:', error);
    console.error('Ha ocurrido un error inesperado:', error);
}
});