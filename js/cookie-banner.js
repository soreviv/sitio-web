// Gestión del banner de cookies
function initCookieBanner() {
  if (localStorage.getItem('cookiesAccepted')) {
    return;
  }

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>Utilizamos cookies para mejorar tu experiencia en nuestro sitio. Al continuar navegando, aceptas nuestra 
    <a href="/politica-cookies.html">Política de Cookies</a>.</p>
    <div class="cookie-buttons">
      <button class="reject-cookies">Rechazar</button>
      <button class="accept-cookies">Aceptar</button>
    </div>
  `;

  document.body.appendChild(banner);
  
  // Mostrar el banner después de un pequeño retraso
  setTimeout(() => {
    banner.classList.add('visible');
  }, 500);

  // Manejadores de eventos
  banner.querySelector('.accept-cookies').addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    banner.classList.remove('visible');
    setTimeout(() => {
      banner.remove();
    }, 300);
  });

  banner.querySelector('.reject-cookies').addEventListener('click', () => {
    localStorage.setItem('cookiesRejected', 'true');
    banner.classList.remove('visible');
    setTimeout(() => {
      banner.remove();
    }, 300);
  });
}

// Inicializar el banner de cookies cuando se carga la página
document.addEventListener('DOMContentLoaded', initCookieBanner);
