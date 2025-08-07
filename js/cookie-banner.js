// Gestión del banner de cookies
function initCookieBanner() {
  if (localStorage.getItem('cookiesAccepted')) {
    return;
  }

  // Crear overlay de fondo
  const overlay = document.createElement('div');
  overlay.className = 'cookie-overlay';

  // Crear el banner
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>Utilizamos cookies para mejorar tu experiencia en nuestro sitio web y para proporcionar servicios personalizados. 
    Al continuar navegando, aceptas nuestras <a href="/politica-cookies.html">Política de Cookies</a> y 
    nuestro <a href="/aviso-privacidad.html">Aviso de Privacidad</a>.</p>
    <div class="cookie-buttons">
      <button class="reject-cookies">Rechazar</button>
      <button class="accept-cookies">Aceptar Cookies</button>
    </div>
  `;

  // Agregar overlay y banner al body
  document.body.appendChild(overlay);
  document.body.appendChild(banner);
  
  // Mostrar el banner después de un pequeño retraso
  setTimeout(() => {
    overlay.classList.add('visible');
    banner.classList.add('visible');
  }, 500);

  // Función para cerrar el banner
  function closeBanner() {
    overlay.classList.remove('visible');
    banner.classList.remove('visible');
    setTimeout(() => {
      overlay.remove();
      banner.remove();
    }, 300);
  }

  // Manejadores de eventos
  banner.querySelector('.accept-cookies').addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    closeBanner();
  });

  banner.querySelector('.reject-cookies').addEventListener('click', () => {
    localStorage.setItem('cookiesRejected', 'true');
    closeBanner();
  });

  // Cerrar si se hace clic en el overlay
  overlay.addEventListener('click', () => {
    localStorage.setItem('cookiesRejected', 'true');
    closeBanner();
  });
}

// Inicializar el banner de cookies cuando se carga la página
document.addEventListener('DOMContentLoaded', initCookieBanner);
