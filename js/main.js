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

class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        this.overlay = this.createOverlay();
        this.isOpen = false;
        this.touchStartY = 0;
        
        this.init();
    }
    
    createOverlay() {
        let overlay = document.querySelector('.nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
        }
        return overlay;
    }
    
    init() {
        if (!this.hamburger || !this.navMenu) return;
        
        // Hamburger click event
        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // Overlay click event
        this.overlay.addEventListener('click', () => {
            this.closeMenu();
        });
        
        // Navigation link click events
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Close menu on window resize if screen becomes larger
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Touch events for smooth mobile interaction
        this.navMenu.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        this.navMenu.addEventListener('touchmove', (e) => {
            if (this.isOpen) {
                const touchY = e.touches[0].clientY;
                const deltaY = touchY - this.touchStartY;
                
                // Only prevent default if scrolling up at the top
                if (deltaY > 0 && this.navMenu.scrollTop === 0) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.hamburger.classList.add('active');
        this.navMenu.classList.add('active');
        this.overlay.classList.add('active');
        document.body.classList.add('menu-open');
        this.isOpen = true;
        
        // Add aria attributes for accessibility
        this.hamburger.setAttribute('aria-expanded', 'true');
        this.navMenu.setAttribute('aria-hidden', 'false');
        
        // Focus trap
        const firstLink = this.navMenu.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.isOpen = false;
        
        // Update aria attributes
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.navMenu.setAttribute('aria-hidden', 'true');
    }
}

function initNavigation() {
    // Initialize mobile navigation
    new MobileNavigation();
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
    
    // Enviar a backend con fetch
    fetch('procesar-formulario.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showNotification(data.message, 'success');
            form.reset();
        } else {
            throw new Error(data.message || 'Ocurrió un error.');
        }
    })
    .catch(error => {
        showNotification(`Error: ${error.message}`, 'error');
        // Como fallback, se puede abrir WhatsApp
        const openWhatsapp = confirm('No pudimos enviar el formulario. ¿Deseas intentarlo por WhatsApp?');
        if (openWhatsapp) {
            const whatsappMsg = encodeURIComponent(getWhatsAppMessage(formData));
            window.open(`https://wa.me/525512345678?text=${whatsappMsg}`, '_blank');
        }
    })
    .finally(() => {
        // Restablecer botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
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
    
}

function clearError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorEl = field.parentNode.querySelector('.error-message');
    if (errorEl) {
        errorEl.remove();
    }
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
