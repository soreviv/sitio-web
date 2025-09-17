<?php
$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://js.hcaptcha.com https://hcaptcha.com 'nonce-$nonce'; connect-src 'self' https://www.google-analytics.com https://hcaptcha.com; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'unsafe-inline';");
?>
<!DOCTYPE html>
<html lang="es-MX">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Las etiquetas title, meta description/keywords y canonical deben ser específicas de cada página -->
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="stylesheet" href="/css/cookie-banner.css">
  <link rel="stylesheet" href="/css/social-media.css">

  <!-- Favicon -->
  <link rel="icon" href="/images/favicon.ico" type="image/x-icon">

  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <!-- FullCalendar -->
  <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.14/index.global.min.js'></script>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-N3VQ2LNFFP"></script>
  <script nonce="<?php echo htmlspecialchars($nonce, ENT_QUOTES); ?>">
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-N3VQ2LNFFP');
  </script>
  <!-- hCaptcha -->
  <script src="https://hcaptcha.com/1/api.js" async defer></script>
</head>

<body>
  <!-- Skip link for accessibility -->
  <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
  
  <!-- Header -->
  <header>
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <a href="index.php" class="brand" aria-label="Inicio - Marca registrada Dr. Alejandro Viveros Domínguez">
            <picture>
              <source type="image/webp" srcset="images/logo.webp">
              <img src="images/logo.png" alt="Logo Dr. Alejandro Viveros Domínguez" width="132" height="100" decoding="async">
            </picture>
          </a>
        </div>
        <ul class="nav-menu" id="nav-menu" role="navigation" aria-label="Navegación principal">
          <li><a href="index.php">Inicio</a></li>
          <li><a href="servicios.php">Servicios</a></li>
          <li><a href="agendar-cita.php">Agendar Cita</a></li>
          <li><a href="contacto.php">Contacto</a></li>
        </ul>
        <button class="hamburger" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Abrir menú de navegación">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </nav>
  </header>

  <main id="main-content">