// script.js
// Aquí puedes agregar funcionalidades JavaScript para tu sitio web

document.addEventListener('DOMContentLoaded', function() {
  // Ejemplo: Mostrar un mensaje en consola
  console.log('Sitio web cargado correctamente');

  // Variables globales
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const appointmentForm = document.getElementById('appointmentForm');
  const contactForm = document.getElementById('contactForm');

  // Validación de formulario de cita
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      let valid = true;
      const nombre = appointmentForm.nombre.value.trim();
      const email = appointmentForm.email.value.trim();
      const telefono = appointmentForm.telefono.value.trim();
      const fecha = appointmentForm.fecha.value.trim();
      if (!nombre) {
        valid = false;
        alert('Por favor ingresa tu nombre.');
      } else if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        valid = false;
        alert('Por favor ingresa un correo electrónico válido.');
      } else if (!telefono || telefono.length < 8) {
        valid = false;
        alert('Por favor ingresa un teléfono válido.');
      } else if (!fecha) {
        valid = false;
        alert('Por favor selecciona una fecha.');
      }
      if (!valid) e.preventDefault();
    });
  }

  // Validación de formulario de contacto
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      let valid = true;
      const nombre = contactForm.nombre.value.trim();
      const email = contactForm.email.value.trim();
      const mensaje = contactForm.mensaje.value.trim();
      if (!nombre) {
        valid = false;
        alert('Por favor ingresa tu nombre.');
      } else if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        valid = false;
        alert('Por favor ingresa un correo electrónico válido.');
      } else if (!mensaje) {
        valid = false;
        alert('Por favor ingresa tu mensaje.');
      }
      if (!valid) e.preventDefault();
    });
  }

  // Puedes agregar más scripts aquí
});