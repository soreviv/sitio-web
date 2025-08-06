// Archivo principal de JavaScript para el sitio web
// Dr. Alejandro Viveros Domínguez - Otorrinolaringología

document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar todas las funciones
    initNavigation();
    initForms();
    initSmoothScroll();
    initAnimations();
    
    console.log('Sitio web cargado correctamente');
});

// ====================================
// NAVEGACIÓN Y MENÚ HAMBURGUESA
// ====================================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Toggle del menú hamburguesa
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Agregar estilos CSS para el menú responsive si no existen
    addResponsiveStyles();
}

function addResponsiveStyles() {
    // Verificar si ya existen los estilos responsive
    if (document.querySelector('#responsive-nav-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'responsive-nav-styles';
    style.textContent = `
        @media (max-width: 768px) {
            .hamburger {
                display: flex !important;
            }
            
            .nav-menu {
                position: fixed;
                left: -100%;
                top: 70px;
                flex-direction: column;
                background-color: white;
                width: 100%;
                text-align: center;
                transition: 0.3s;
                box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
                z-index: 999;
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-menu li {
                margin: 1rem 0;
            }
            
            .hamburger.active .bar:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active .bar:nth-child(1) {
                transform: translateY(8px) rotate(45deg);
            }
            
            .hamburger.active .bar:nth-child(3) {
                transform: translateY(-8px) rotate(-45deg);
            }
        }
    `;
    document.head.appendChild(style);
}

// ====================================
// FORMULARIOS
// ====================================

function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validar formulario
    if (!validateForm(form)) {
        showNotification('Por favor, completa todos los campos requeridos correctamente.', 'error');
        return;
    }
    
    // Mostrar estado de carga
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío (aquí se conectaría con el backend)
    setTimeout(() => {
        // Restablecer botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Limpiar formulario
        form.reset();
        
        // Mostrar mensaje de éxito
        if (form.classList.contains('appointment-form')) {
            showNotification('¡Solicitud de cita enviada! Te contactaremos pronto para confirmar.', 'success');
        } else {
            showNotification('¡Mensaje enviado correctamente! Te responderemos pronto.', 'success');
        }
        
        // Redirigir a WhatsApp como alternativa
        setTimeout(() => {
            const whatsappMsg = encodeURIComponent(getWhatsAppMessage(formData));
            window.open(`https://wa.me/525512345678?text=${whatsappMsg}`, '_blank');
        }, 2000);
        
    }, 1500);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar errores previos
    clearError(e);
    
    // Validar campo requerido
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Este campo es requerido';
        isValid = false;
    }
    
    // Validaciones específicas por tipo
    if (value && field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Ingresa un email válido';
            isValid = false;
        }
    }
    
    if (value && field.type === 'tel') {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Ingresa un teléfono válido';
            isValid = false;
        }
    }
    
    // Mostrar error si existe
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Crear o actualizar mensaje de error
    let errorEl = field.parentNode.querySelector('.error-message');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
    
    // Agregar estilos de error si no existen
    addErrorStyles();
}

function clearError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorEl = field.parentNode.querySelector('.error-message');
    if (errorEl) {
        errorEl.remove();
    }
}

function addErrorStyles() {
    if (document.querySelector('#form-error-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'form-error-styles';
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: #e74c3c !important;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: block;
        }
    `;
    document.head.appendChild(style);
}

function getWhatsAppMessage(formData) {
    let message = "Hola, me contacto desde el sitio web:\n\n";
    
    for (let [key, value] of formData.entries()) {
        if (value.trim()) {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            message += `${label}: ${value}\n`;
        }
    }
    
    message += "\nGracias.";
    return message;
}

// ====================================
// NOTIFICACIONES
// ====================================

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
    
    // Agregar estilos si no existen
    addNotificationStyles();
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-cerrar después de 5 segundos
    const autoClose = setTimeout(() => closeNotification(notification), 5000);
    
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

function addNotificationStyles() {
    if (document.querySelector('#notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            background: #27ae60;
            color: white;
        }
        
        .notification-error {
            background: #e74c3c;
            color: white;
        }
        
        .notification-info {
            background: #3498db;
            color: white;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        
        .notification-close:hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
}

// ====================================
// SCROLL SUAVE
// ====================================

function initSmoothScroll() {
    // Scroll suave para enlaces internos
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ====================================
// ANIMACIONES
// ====================================

function initAnimations() {
    // Animación para elementos que entran en el viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que se pueden animar
    const animatableElements = document.querySelectorAll('.service-card, .contact-item, .info-card, .service-item');
    animatableElements.forEach(el => observer.observe(el));
    
    // Agregar estilos de animación
    addAnimationStyles();
}

function addAnimationStyles() {
    if (document.querySelector('#animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
        .service-card,
        .contact-item,
        .info-card,
        .service-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .service-card.animate-in,
        .contact-item.animate-in,
        .info-card.animate-in,
        .service-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ====================================
// UTILIDADES
// ====================================

// Función para detectar dispositivos móviles
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para formatear teléfonos
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})(\d{4})$/);
    if (match) {
        return `+${match[1]} ${match[2]} ${match[3]}-${match[4]}`;
    }
    return phone;
}

// Función para debug en desarrollo
function debug(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[DEBUG] ${message}`, data);
    }
}

// Exportar funciones para uso global si es necesario
window.otorrinoSite = {
    showNotification,
    formatPhone,
    debug
};
