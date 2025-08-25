// ==============================================================================
// Protección de Contenido
// ==============================================================================
// ADVERTENCIA: Estas medidas afectan negativamente la experiencia de usuario y
// la accesibilidad. No ofrecen una protección real contra usuarios decididos.
// Úsese con precaución.
// ==============================================================================

document.addEventListener('DOMContentLoaded', function() {

  // Bloquea el menú contextual (clic derecho) en todo el documento.
  document.addEventListener('contextmenu', function(e) {
    // Muestra una alerta opcional al usuario. Puedes eliminar esta línea.
    // alert('El clic derecho ha sido deshabilitado en este sitio.');
    e.preventDefault();
  });

});