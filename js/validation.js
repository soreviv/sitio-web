// Form validation utilities
class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = {};
        this.init();
    }

    init() {
        // Add validation on submit
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });

        // Add real-time validation
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    validateForm() {
        this.errors = {};
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => this.validateField(field));
        
        if (Object.keys(this.errors).length === 0) {
            this.onSuccess();
        } else {
            this.showErrors();
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        const type = field.type;

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.errors[name] = 'Este campo es obligatorio';
            return;
        }

        // Skip other validations if field is empty and not required
        if (!value && !field.hasAttribute('required')) {
            return;
        }

        // Type-specific validations
        switch (type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.errors[name] = 'Ingresa un correo electrónico válido';
                }
                break;
            case 'tel':
                if (!this.isValidPhone(value)) {
                    this.errors[name] = 'Ingresa un número de teléfono válido (10 dígitos)';
                }
                break;
            case 'date':
                if (!this.isValidDate(value)) {
                    this.errors[name] = 'Selecciona una fecha válida';
                }
                break;
        }

        // Name validation
        if (name === 'nombre' || name === 'name') {
            if (!this.isValidName(value)) {
                this.errors[name] = 'Ingresa un nombre válido (solo letras y espacios)';
            }
        }

        // Custom validation attributes
        if (field.hasAttribute('data-min-length')) {
            const minLength = parseInt(field.getAttribute('data-min-length'));
            if (value.length < minLength) {
                this.errors[name] = `Debe tener al menos ${minLength} caracteres`;
            }
        }

        if (field.hasAttribute('data-max-length')) {
            const maxLength = parseInt(field.getAttribute('data-max-length'));
            if (value.length > maxLength) {
                this.errors[name] = `No debe exceder ${maxLength} caracteres`;
            }
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Mexican phone number validation (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    isValidName(name) {
        // Only letters, spaces, and common accented characters
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        return nameRegex.test(name) && name.length >= 2;
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if date is valid and in the future
        return date instanceof Date && !isNaN(date) && date >= today;
    }

    showErrors() {
        // Remove existing error messages
        this.form.querySelectorAll('.error-message').forEach(el => el.remove());
        this.form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));

        // Show new error messages
        Object.keys(this.errors).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.showFieldError(field, this.errors[fieldName]);
            }
        });

        // Focus on first error field
        const firstErrorField = this.form.querySelector('.field-error');
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showFieldError(field, message) {
        field.classList.add('field-error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert error message after the field
        if (field.parentNode) {
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
    }

    clearFieldError(field) {
        field.classList.remove('field-error');
        const errorMessage = field.parentNode?.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
        
        // Remove from errors object
        delete this.errors[field.name];
    }

    // Sanitize input to prevent XSS
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Get sanitized form data
    getFormData() {
        const formData = new FormData(this.form);
        const sanitizedData = {};
        
        for (let [key, value] of formData.entries()) {
            sanitizedData[key] = this.sanitizeInput(value);
        }
        
        return sanitizedData;
    }

    onSuccess() {
        // This method should be overridden by specific form implementations
        console.log('Form validation successful');
        
        // Get sanitized data
        const data = this.getFormData();
        
        // Show success message
        if (window.showNotification) {
            showNotification('Formulario enviado correctamente', 'success');
        }
        
        // Reset form
        this.form.reset();
        
        // Remove any remaining error styling
        this.form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
        this.form.querySelectorAll('.error-message').forEach(el => el.remove());
    }
}

// Contact form validator
class ContactFormValidator extends FormValidator {
    onSuccess() {
        const data = this.getFormData();
        
        // Simulate form submission
        this.showLoadingState();
        
        setTimeout(() => {
            this.hideLoadingState();
            if (window.showNotification) {
                showNotification('Tu mensaje ha sido enviado. Te contactaremos pronto.', 'success');
            }
            this.form.reset();
        }, 2000);
    }

    showLoadingState() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        }
    }

    hideLoadingState() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Enviar Mensaje';
        }
    }
}

// Initialize validators when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        new ContactFormValidator(contactForm);
    }

    // Generic forms
    document.querySelectorAll('form:not(#contact-form):not(#appointment-form)').forEach(form => {
        new FormValidator(form);
    });
});

// Add CSS for validation styling
const validationStyles = `
    .field-error {
        border-color: var(--error-color) !important;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
    }
    
    .error-message {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 5px;
        display: block;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: var(--text-color);
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        font-size: 1rem;
        transition: var(--transition);
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(44, 90, 160, 0.2);
    }
    
    .checkbox-group {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin: 15px 0;
    }
    
    .checkbox-group input[type="checkbox"] {
        width: auto;
        margin: 0;
    }
    
    .checkbox-group label {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .required {
        color: var(--error-color);
    }
`;

// Inject validation styles
const validationStyleSheet = document.createElement('style');
validationStyleSheet.textContent = validationStyles;
document.head.appendChild(validationStyleSheet);