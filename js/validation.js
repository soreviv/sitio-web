// validation.js - Sistema de validación robusta para formularios
document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicializando sistema de validación...');

  // ========== CONFIGURACIÓN ==========
  const VALIDATION_CONFIG = {
    // Regex patterns
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mexicanPhone: /^[1-9][0-9]{9}$/,
    name: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,50}$/,
    
    // Mensajes de error
    messages: {
      required: 'Este campo es obligatorio',
      email: 'Ingresa un correo electrónico válido',
      phone: 'Ingresa un teléfono válido (10 dígitos)',
      name: 'El nombre debe tener entre 2 y 50 caracteres, solo letras',
      age: 'La edad debe estar entre 0 y 120 años',
      minLength: (min) => `Debe tener al menos ${min} caracteres`,
      maxLength: (max) => `No puede exceder ${max} caracteres`,
      checkbox: 'Debes aceptar este campo para continuar'
    }
  };

  // ========== CLASE PRINCIPAL DE VALIDACIÓN ==========
  class FormValidator {
    constructor(formId) {
      this.form = document.getElementById(formId);
      this.rules = new Map();
      this.errors = new Map();
      
      if (this.form) {
        this.init();
      }
    }

    init() {
      // Agregar eventos de validación en tiempo real
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Validación en tiempo real para cada campo
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearError(input));
      });
    }

    // Agregar regla de validación
    addRule(fieldName, rules) {
      this.rules.set(fieldName, rules);
      return this;
    }

    // Validar campo individual
    validateField(field) {
      const fieldName = field.name || field.id;
      const value = field.type === 'checkbox' ? field.checked : field.value.trim();
      const rules = this.rules.get(fieldName);
      
      if (!rules) return true;

      // Limpiar error anterior
      this.clearError(field);
      
      // Validar cada regla
      for (const rule of rules) {
        const error = this.applyRule(value, rule, field);
        if (error) {
          this.showError(field, error);
          this.errors.set(fieldName, error);
          return false;
        }
      }
      
      this.errors.delete(fieldName);
      this.showSuccess(field);
      return true;
    }

    // Aplicar regla de validación
    applyRule(value, rule, field) {
      switch (rule.type) {
        case 'required':
          if (field.type === 'checkbox') {
            return !value ? VALIDATION_CONFIG.messages.checkbox : null;
          }
          return !value ? VALIDATION_CONFIG.messages.required : null;
          
        case 'email':
          return value && !VALIDATION_CONFIG.email.test(value) ? 
            VALIDATION_CONFIG.messages.email : null;
            
        case 'phone':
          if (value) {
            const cleaned = value.replace(/\D/g, '');
            return !VALIDATION_CONFIG.mexicanPhone.test(cleaned) ? 
              VALIDATION_CONFIG.messages.phone : null;
          }
          return null;
          
        case 'name':
          return value && !VALIDATION_CONFIG.name.test(value) ? 
            VALIDATION_CONFIG.messages.name : null;
            
        case 'age':
          if (value) {
            const age = parseInt(value);
            return (age < 0 || age > 120) ? 
              VALIDATION_CONFIG.messages.age : null;
          }
          return null;
          
        case 'minLength':
          return value && value.length < rule.value ? 
            VALIDATION_CONFIG.messages.minLength(rule.value) : null;
            
        case 'maxLength':
          return value && value.length > rule.value ? 
            VALIDATION_CONFIG.messages.maxLength(rule.value) : null;
            
        case 'custom':
          return rule.validator(value, field);
          
        default:
          return null;
      }
    }

    // Mostrar error
    showError(field, message) {
      const errorElement = this.getErrorElement(field);
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
      }
      
      field.classList.add('error');
      field.classList.remove('success');
    }

    // Mostrar éxito
    showSuccess(field) {
      field.classList.add('success');
      field.classList.remove('error');
    }

    // Limpiar error
    clearError(field) {
      const errorElement = this.getErrorElement(field);
      if (errorElement) {
        errorElement.style.display = 'none';
      }
      
      field.classList.remove('error');
    }

    // Obtener elemento de error
    getErrorElement(field) {
      const fieldName = field.name || field.id;
      return document.getElementById(`${fieldName}-error`);
    }

    // Manejar envío del formulario
    handleSubmit(e) {
      e.preventDefault();
      
      let isValid = true;
      const inputs = this.form.querySelectorAll('input, textarea, select');
      
      // Validar todos los campos
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        this.onSubmitSuccess();
      } else {
        this.onSubmitError();
      }
    }

    // Callback de éxito
    onSubmitSuccess() {
      console.log('Formulario válido');
      // El formulario específico manejará el envío
    }

    // Callback de error
    onSubmitError() {
      // Scroll al primer error
      const firstError = this.form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      window.SiteUtils.showNotification(
        'Por favor corrige los errores en el formulario', 
        'error'
      );
    }

    // Validar todo el formulario
    validateAll() {
      let isValid = true;
      const inputs = this.form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });
      
      return isValid;
    }

    // Obtener datos del formulario
    getFormData() {
      const formData = new FormData(this.form);
      const data = {};
      
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      return data;
    }
  }

  // ========== VALIDADORES ESPECÍFICOS ==========
  
  // Validador para formulario de contacto
  function initContactFormValidation() {
    const contactValidator = new FormValidator('contactForm');
    
    if (contactValidator.form) {
      contactValidator
        .addRule('nombre', [
          { type: 'required' },
          { type: 'name' }
        ])
        .addRule('email', [
          { type: 'required' },
          { type: 'email' }
        ])
        .addRule('telefono', [
          { type: 'required' },
          { type: 'phone' }
        ])
        .addRule('mensaje', [
          { type: 'required' },
          { type: 'minLength', value: 10 },
          { type: 'maxLength', value: 500 }
        ])
        .addRule('privacidad', [
          { type: 'required' }
        ]);

      // Override del submit success para formulario de contacto
      contactValidator.onSubmitSuccess = function() {
        console.log('Enviando formulario de contacto...');
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular envío
        setTimeout(() => {
          window.SiteUtils.showNotification(
            '¡Mensaje enviado exitosamente! Te contactaremos pronto.', 
            'success'
          );
          
          this.form.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          
          // Limpiar estilos de validación
          this.form.querySelectorAll('.success, .error').forEach(el => {
            el.classList.remove('success', 'error');
          });
        }, 2000);
      };
    }
  }

  // Validador para formulario de citas
  function initAppointmentFormValidation() {
    const appointmentValidator = new FormValidator('appointmentForm');
    
    if (appointmentValidator.form) {
      appointmentValidator
        .addRule('tipo-cita', [
          { type: 'required' }
        ])
        .addRule('nombre-completo', [
          { type: 'required' },
          { type: 'name' }
        ])
        .addRule('email-cita', [
          { type: 'required' },
          { type: 'email' }
        ])
        .addRule('telefono-cita', [
          { type: 'required' },
          { type: 'phone' }
        ])
        .addRule('edad', [
          { type: 'required' },
          { type: 'age' }
        ])
        .addRule('motivo-consulta', [
          { type: 'required' },
          { type: 'minLength', value: 10 },
          { type: 'maxLength', value: 500 }
        ])
        .addRule('privacidad-cita', [
          { type: 'required' }
        ])
        .addRule('terminos-cita', [
          { type: 'required' }
        ])
        .addRule('selected-date', [
          { 
            type: 'custom', 
            validator: (value) => value ? null : 'Debes seleccionar una fecha para tu cita'
          }
        ])
        .addRule('selected-time', [
          { 
            type: 'custom', 
            validator: (value) => value ? null : 'Debes seleccionar una hora para tu cita'
          }
        ]);

      // Override del submit success para formulario de citas
      appointmentValidator.onSubmitSuccess = function() {
        console.log('Procesando solicitud de cita...');
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;
        
        // Simular envío
        setTimeout(() => {
          window.SiteUtils.showNotification(
            '¡Solicitud de cita enviada! Te contactaremos para confirmar en las próximas 2 horas.', 
            'success'
          );
          
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2000);
      };
    }
  }

  // ========== UTILIDADES DE FORMATO ==========
  function initInputFormatting() {
    // Formateo automático de teléfonos
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
      input.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length <= 10) {
          if (value.length >= 6) {
            value = `${value.slice(0, 2)} ${value.slice(2, 6)} ${value.slice(6)}`;
          } else if (value.length >= 2) {
            value = `${value.slice(0, 2)} ${value.slice(2)}`;
          }
          this.value = value;
        } else {
          this.value = this.value.slice(0, -1);
        }
      });
    });

    // Capitalización automática de nombres
    const nameInputs = document.querySelectorAll('input[name*="nombre"], input[id*="nombre"]');
    nameInputs.forEach(input => {
      input.addEventListener('input', function() {
        const words = this.value.split(' ');
        const capitalizedWords = words.map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
        this.value = capitalizedWords.join(' ');
      });
    });

    // Límite de edad
    const ageInputs = document.querySelectorAll('input[name="edad"], input[id="edad"]');
    ageInputs.forEach(input => {
      input.addEventListener('input', function() {
        if (this.value > 120) this.value = 120;
        if (this.value < 0) this.value = 0;
      });
    });
  }

  // ========== VALIDACIÓN DE CHECKBOX MÚLTIPLE ==========
  function initCheckboxValidation() {
    const checkboxGroups = document.querySelectorAll('[name$="[]"]');
    const groupNames = [...new Set(Array.from(checkboxGroups).map(cb => cb.name))];
    
    groupNames.forEach(groupName => {
      const checkboxes = document.querySelectorAll(`[name="${groupName}"]`);
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const checked = document.querySelectorAll(`[name="${groupName}"]:checked`);
          const groupContainer = this.closest('.checkbox-grid');
          
          if (groupContainer) {
            if (checked.length > 0) {
              groupContainer.classList.remove('error');
            }
          }
        });
      });
    });
  }

  // ========== INDICADOR DE FUERZA DE CONTRASEÑA ==========
  function initPasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
      const strengthIndicator = document.createElement('div');
      strengthIndicator.className = 'password-strength';
      input.parentNode.appendChild(strengthIndicator);
      
      input.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        updateStrengthIndicator(strengthIndicator, strength);
      });
    });
  }

  function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return score;
  }

  function updateStrengthIndicator(indicator, strength) {
    const levels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];
    const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#2ecc71'];
    
    indicator.textContent = `Fuerza: ${levels[strength] || 'Muy débil'}`;
    indicator.style.color = colors[strength] || colors[0];
  }

  // ========== AUTOCOMPLETADO INTELIGENTE ==========
  function initSmartAutocomplete() {
    // Lista de síntomas comunes para el campo de motivo de consulta
    const commonSymptoms = [
      'dolor de oído', 'pérdida de audición', 'congestión nasal', 'dolor de garganta',
      'vértigo', 'mareos', 'ronquidos', 'sinusitis', 'otitis', 'amigdalitis',
      'dificultad para tragar', 'sangrado nasal', 'pérdida del olfato', 'tos persistente'
    ];

    const motivoInput = document.getElementById('motivo-consulta');
    if (motivoInput) {
      createAutocompleteDropdown(motivoInput, commonSymptoms);
    }
  }

  function createAutocompleteDropdown(input, suggestions) {
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    input.parentNode.appendChild(dropdown);

    input.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      const matches = suggestions.filter(item => 
        item.toLowerCase().includes(value) && value.length > 2
      );

      showAutocompleteMatches(dropdown, matches, input);
    });

    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

  function showAutocompleteMatches(dropdown, matches, input) {
    dropdown.innerHTML = '';
    
    if (matches.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    matches.slice(0, 5).forEach(match => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.textContent = match;
      
      item.addEventListener('click', function() {
        input.value = input.value + (input.value ? ', ' : '') + match;
        dropdown.style.display = 'none';
      });
      
      dropdown.appendChild(item);
    });

    dropdown.style.display = 'block';
  }

  // ========== INICIALIZACIÓN ==========
  function init() {
    try {
      initContactFormValidation();
      initAppointmentFormValidation();
      initInputFormatting();
      initCheckboxValidation();
      initPasswordStrength();
      initSmartAutocomplete();
      
      console.log('Sistema de validación inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar validación:', error);
    }
  }

  // ========== API PÚBLICA ==========
  window.ValidationUtils = {
    // Validar email
    isValidEmail: (email) => VALIDATION_CONFIG.email.test(email),
    
    // Validar teléfono mexicano
    isValidMexicanPhone: (phone) => {
      const cleaned = phone.replace(/\D/g, '');
      return VALIDATION_CONFIG.mexicanPhone.test(cleaned);
    },
    
    // Formatear teléfono
    formatPhone: (phone) => {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
      }
      return phone;
    },
    
    // Crear validador personalizado
    createValidator: (formId) => new FormValidator(formId)
  };

  // Inicializar
  init();
});

// ========== ESTILOS CSS PARA VALIDACIÓN ==========
const validationStyles = `
  .form-group {
    position: relative;
    margin-bottom: 20px;
  }
  
  .error-message {
    display: none;
    color: #e74c3c;
    font-size: 12px;
    margin-top: 5px;
    animation: shake 0.3s ease-in-out;
  }
  
  .form-group input.error,
  .form-group textarea.error,
  .form-group select.error {
    border-color: #e74c3c;
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
  }
  
  .form-group input.success,
  .form-group textarea.success,
  .form-group select.success {
    border-color: #27ae60;
    box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.2);
  }
  
  .checkbox-grid.error {
    border: 1px solid #e74c3c;
    border-radius: 4px;
    padding: 10px;
    background-color: rgba(231, 76, 60, 0.05);
  }
  
  .password-strength {
    font-size: 12px;
    margin-top: 5px;
    font-weight: 500;
  }
  
  .autocomplete-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
    display: none;
  }
  
  .autocomplete-item {
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;
  }
  
  .autocomplete-item:hover {
    background-color: #f8f9fa;
  }
  
  .autocomplete-item:last-child {
    border-bottom: none;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  @media (max-width: 768px) {
    .error-message {
      font-size: 11px;
    }
    
    .autocomplete-dropdown {
      font-size: 14px;
    }
    
    .autocomplete-item {
      padding: 8px 12px;
    }
  }
`;

// Agregar estilos de validación
const validationStyleSheet = document.createElement('style');
validationStyleSheet.textContent = validationStyles;
document.head.appendChild(validationStyleSheet);