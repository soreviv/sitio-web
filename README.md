# Sitio Web Médico Profesional - Otorrinolaringología

Plataforma web profesional para servicios médicos especializados en otorrinolaringología y cirugía de cabeza y cuello, desarrollada con enfoque en seguridad, cumplimiento legal y experiencia de usuario.

## 🚀 Características Principales

### Funcionalidades Médicas
- **Sistema de Citas Interactivo**: Calendario en tiempo real con gestión de horarios disponibles
- **Formularios Validados**: Validación robusta con protección XSS y sanitización de datos
- **Información de Servicios**: Catálogo completo de procedimientos y tratamientos
- **Sistema de Contacto**: Múltiples canales de comunicación (teléfono, email, WhatsApp)

### Seguridad y Cumplimiento
- **Protección de Datos**: Cumplimiento con LFPDPPP (Ley Federal de Protección de Datos Personales)
- **Consentimiento Informado**: Checkboxes obligatorios para autorización de tratamiento de datos
- **Avisos Legales**: Integración completa de avisos COFEPRIS y disclaimers médicos
- **Protección de Contenido**: Sistema de protección contra copia y descarga no autorizada

### Experiencia de Usuario
- **Diseño Responsive**: Adaptación completa a dispositivos móviles y desktop
- **Navegación Intuitiva**: Menú hamburger para móviles y navegación fluida
- **Animaciones Suaves**: Efectos de scroll y animaciones de entrada
- **Accesibilidad**: Cumplimiento con estándares de accesibilidad web

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Módulos, clases, async/await
- **Font Awesome**: Iconografía profesional

### Validación y Seguridad
- **Validación JavaScript**: Validación en tiempo real sin dependencias externas
- **Sanitización XSS**: Protección contra ataques de cross-site scripting
- **Gestión de Cookies**: Banner de consentimiento GDPR-compliant
- **Protección de Contenido**: Bloqueo de clic derecho, selección y teclas de desarrollo

### SEO y Performance
- **Meta Tags Optimizados**: Structured data y metadatos específicos por página
- **Canonical URLs**: Prevención de contenido duplicado
- **Lazy Loading**: Carga diferida de imágenes
- **Compresión**: Optimización de assets estáticos

## 📁 Estructura del Proyecto

```
/
├── index.html              # Página principal
├── servicios.html          # Catálogo de servicios médicos
├── contacto.html           # Información de contacto y formulario
├── agendar-cita.html       # Sistema de agendamiento de citas
├── aviso-privacidad.html   # Aviso de privacidad (LFPDPPP)
├── politica-cookies.html   # Política de cookies
├── terminos-condiciones.html # Términos y condiciones
├── css/
│   ├── styles.css          # Estilos principales
│   ├── cookie-banner.css   # Estilos del banner de cookies
│   └── social-media.css    # Estilos de redes sociales
├── js/
│   ├── main.js             # Funcionalidades principales
│   ├── appointment.js      # Sistema de citas interactivo
│   ├── validation.js       # Validación de formularios
│   ├── cookie-banner.js    # Gestión de cookies
│   └── content-protection.js # Protección de contenido
├── .htaccess              # Configuración Apache
├── nginx.conf             # Configuración Nginx
├── robots.txt             # Directivas para motores de búsqueda
└── sitemap.xml            # Mapa del sitio
```

## 🔒 Medidas de Seguridad Implementadas

### Protección de Datos
- Validación y sanitización de todos los inputs del usuario
- Encriptación de datos sensibles en tránsito
- Política de cookies transparente
- Consentimiento explícito para el tratamiento de datos personales

### Cumplimiento Legal Mexicano
- **COFEPRIS**: Avisos regulatorios en todas las páginas médicas
- **LFPDPPP**: Aviso de privacidad completo y consentimiento informado
- **NOM-004-SSA3**: Cumplimiento con expediente clínico electrónico
- **Disclaimers**: Avisos de resultados variables y urgencias médicas

### Protección del Sitio Web
- Protección contra XSS y CSRF
- Validación estricta de formularios
- Bloqueo de herramientas de desarrollo
- Prevención de copia de contenido

## 🚀 Instalación y Despliegue

### Requisitos del Sistema
- Servidor web (Apache/Nginx)
- PHP 7.4+ (para funcionalidades backend futuras)
- SSL/HTTPS habilitado
- Soporte para headers de seguridad

### Configuración de Seguridad Recomendada

#### Headers de Seguridad (en .htaccess o nginx.conf)
```apache
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'"
```

#### Configuración SSL
- Certificado SSL válido requerido
- Redirección automática HTTP → HTTPS
- HSTS headers habilitados

## 📱 Funcionalidades del Sistema de Citas

### Características del Calendario
- **Vista Mensual**: Navegación intuitiva por meses
- **Disponibilidad en Tiempo Real**: Horarios dinámicos basados en día de la semana
- **Validación de Fechas**: Solo fechas futuras y días hábiles
- **Gestión de Horarios**: Sistema configurable de horarios por día

### Formulario de Citas
- **Validación Completa**: Nombre, teléfono, email, fecha, hora
- **Información Médica**: Motivo de consulta, medicamentos, alergias
- **Consentimientos**: LFPDPPP, términos médicos, autorización de contacto
- **Confirmación**: Sistema de confirmación vía email/SMS

## 🎨 Personalización

### Variables CSS
El sistema utiliza variables CSS para facilitar la personalización:

```css
:root {
    --primary-color: #2c5aa0;
    --secondary-color: #4a90e2;
    --accent-color: #e8f4fd;
    --success-color: #27ae60;
    --error-color: #e74c3c;
    --whatsapp-color: #25d366;
}
```

### Configuración de Horarios
Los horarios disponibles se configuran en `js/appointment.js`:

```javascript
availableHours: {
    'monday': ['09:00', '10:00', '11:00', '15:00', '16:00', '17:00'],
    'tuesday': ['09:00', '10:00', '11:00', '15:00', '16:00', '17:00'],
    // ... más días
}
```

## 📞 Soporte y Mantenimiento

### Actualizaciones de Seguridad
- Revisar mensualmente dependencias
- Actualizar certificados SSL antes de vencimiento
- Monitorear logs de seguridad regularmente

### Monitoreo de Performance
- Google PageSpeed Insights
- GTmetrix para análisis de carga
- Google Search Console para SEO

### Respaldos
- Respaldo diario de archivos
- Respaldo semanal de base de datos (cuando se implemente)
- Versionado de código en repositorio Git

## ⚖️ Consideraciones Legales

Este sitio web está diseñado para cumplir con todas las regulaciones mexicanas aplicables a sitios web médicos, incluyendo pero no limitado a:

- Ley Federal de Protección de Datos Personales en Posesión de los Particulares
- Regulaciones COFEPRIS para publicidad médica
- NOM-004-SSA3 para expediente clínico
- Código de ética médica profesional

## 📄 Licencia

Este proyecto contiene código propietario protegido por derechos de autor. El uso, distribución o modificación sin autorización expresa está prohibido.

---

**⚠️ Importante**: Este es un sistema médico profesional. Cualquier modificación debe ser revisada por personal técnico calificado para mantener la seguridad y cumplimiento legal.
