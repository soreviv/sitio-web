// main.js - Funcionalidades principales del sitio web
document.addEventListener('DOMContentLoaded', function() {
  console.log('Sitio web cargado correctamente');

  // Variables globales
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');

  // ========== NAVEGACIÓN RESPONSIVE ==========
  function initMobileNavigation() {
    if (hamburger && navMenu) {
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
  }

  // ========== SCROLL TO TOP ==========
  function initScrollToTop() {
    if (scrollToTopBtn) {
      // Mostrar/ocultar botón según scroll
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          scrollToTopBtn.classList.add('visible');
        } else {
          scrollToTopBtn.classList.remove('visible');
        }
      });

      // Funcionalidad del botón
      scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // ========== ANIMACIONES ON SCROLL ==========
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Elementos a animar
    const animatedElements = document.querySelectorAll(
      '.service-card, .contact-item, .info-card, .faq-item, .about-text, .hero-content'
    );

    animatedElements.forEach(el => {
      el.classList.add('scroll-animate');
      observer.observe(el);
    });
  }

  // ========== SMOOTH SCROLLING PARA ENLACES INTERNOS ==========
  function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========== LAZY LOADING PARA IMÁGENES ==========
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ========== MANEJO DE FORMULARIOS GENÉRICO ==========
  function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        // Agregar loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
          submitBtn.disabled = true;
          
          // Simular envío (en producción se enviaría al servidor)
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }, 2000);
        }
      });
    });
  }

  // ========== NAVBAR TRANSPARENCIA EN SCROLL ==========
  function initNavbarTransparency() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ========== TOOLTIPS ==========
  function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', function() {
        const tooltipText = this.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        setTimeout(() => tooltip.classList.add('visible'), 10);
      });
      
      element.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
          tooltip.remove();
        }
      });
    });
  }

  // ========== ACCORDION PARA FAQ ==========
  function initAccordion() {
    const faqItems = document.querySelectorAll('.faq-item h3');
    
    faqItems.forEach(item => {
      item.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isActive = this.parentElement.classList.contains('active');
        
        // Cerrar todos los otros accordions
        document.querySelectorAll('.faq-item').forEach(faq => {
          faq.classList.remove('active');
        });
        
        // Abrir el seleccionado si no estaba activo
        if (!isActive) {
          this.parentElement.classList.add('active');
        }
      });
    });
  }

  // ========== DETECCIÓN DE DISPOSITIVO MÓVIL ==========
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // ========== OPTIMIZACIONES PARA MÓVIL ==========
  function initMobileOptimizations() {
    if (isMobile()) {
      // Agregar clase para estilos específicos de móvil
      document.body.classList.add('mobile-device');
      
      // Optimizar hover effects en móvil
      const hoverElements = document.querySelectorAll('.service-card, .contact-method');
      hoverElements.forEach(element => {
        element.addEventListener('touchstart', function() {
          this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
          setTimeout(() => {
            this.classList.remove('touch-active');
          }, 300);
        });
      });
    }
  }

  // ========== MANEJO DE ERRORES DE IMÁGENES ==========
  function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      img.addEventListener('error', function() {
        // Imagen placeholder o imagen por defecto
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+';
        this.alt = 'Imagen no disponible';
      });
    });
  }

  // ========== INICIALIZACIÓN ==========
  function init() {
    try {
      initMobileNavigation();
      initScrollToTop();
      initScrollAnimations();
      initSmoothScrolling();
      initLazyLoading();
      initFormHandling();
      initNavbarTransparency();
      initTooltips();
      initAccordion();
      initMobileOptimizations();
      initImageErrorHandling();
      
      console.log('Todas las funcionalidades principales inicializadas correctamente');
    } catch (error) {
      console.error('Error al inicializar funcionalidades:', error);
    }
  }

  // ========== UTILIDADES PÚBLICAS ==========
  window.SiteUtils = {
    // Mostrar notificación
    showNotification: function(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      `;
      
      document.body.appendChild(notification);
      
      // Auto cerrar después de 5 segundos
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
      }, 5000);
      
      // Cerrar manualmente
      notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
      });
    },
    
    // Validar email
    isValidEmail: function(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },
    
    // Validar teléfono mexicano
    isValidMexicanPhone: function(phone) {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length === 10 && /^[1-9]/.test(cleaned);
    },
    
    // Formatear teléfono
    formatPhone: function(phone) {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
      }
      return phone;
    }
  };

  // Inicializar todo
  init();
});

// ========== MANEJO DE REDIMENSIONAMIENTO ==========
window.addEventListener('resize', function() {
  // Recalcular elementos que dependen del tamaño de ventana
  const navbar = document.querySelector('.navbar');
  if (navbar && window.innerWidth > 768) {
    navbar.querySelector('.nav-menu').classList.remove('active');
    navbar.querySelector('.hamburger').classList.remove('active');
  }
});

// ========== PREVENIR ZOOM ACCIDENTAL EN MÓVIL ==========
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

// ========== ESTILOS CSS DINÁMICOS ==========
const dynamicStyles = `
  .scroll-animate {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .scroll-animate.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 10000;
    min-width: 300px;
    animation: slideIn 0.3s ease;
  }
  
  .notification.fade-out {
    animation: slideOut 0.3s ease forwards;
  }
  
  .notification-success { border-left: 4px solid #27ae60; }
  .notification-error { border-left: 4px solid #e74c3c; }
  .notification-info { border-left: 4px solid #3498db; }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .tooltip {
    position: absolute;
    background: #333;
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 1000;
  }
  
  .tooltip.visible {
    opacity: 1;
  }
  
  .touch-active {
    transform: scale(1.02);
    transition: transform 0.2s ease;
  }
  
  .scroll-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
  }
  
  .scroll-to-top.visible {
    opacity: 1;
    visibility: visible;
  }
  
  .scroll-to-top:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

// Agregar estilos dinámicos
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);