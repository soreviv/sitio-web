// Protección de contenido
document.addEventListener('DOMContentLoaded', function() {
    // Deshabilitar clic derecho
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Deshabilitar selección de texto
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Deshabilitar arrastrar imágenes
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // Deshabilitar copiar
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });

    // Deshabilitar cortar
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });

    // Mostrar mensaje al intentar usar clic derecho
    document.oncontextmenu = function() {
        showProtectionMessage();
        return false;
    };

    // Deshabilitar teclas de función y combinaciones de teclas comunes
    document.onkeydown = function(e) {
        // Deshabilitar F12
        if(e.keyCode == 123) {
            return false;
        }
        // Deshabilitar Ctrl+U (ver código fuente)
        if(e.ctrlKey && e.keyCode == 85) {
            return false;
        }
        // Deshabilitar Ctrl+Shift+I (herramientas de desarrollo)
        if(e.ctrlKey && e.shiftKey && e.keyCode == 73) {
            return false;
        }
        // Deshabilitar Ctrl+Shift+C (inspector de elementos)
        if(e.ctrlKey && e.shiftKey && e.keyCode == 67) {
            return false;
        }
        // Deshabilitar Ctrl+C (copiar)
        if(e.ctrlKey && e.keyCode == 67) {
            return false;
        }
    };

    // Función para mostrar mensaje de protección
    function showProtectionMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            text-align: center;
            animation: fadeOut 2s forwards;
        `;
        messageDiv.innerHTML = 'Este contenido está protegido';
        document.body.appendChild(messageDiv);

        // Eliminar el mensaje después de 2 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }

    // Agregar estilo para la animación de desvanecimiento
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
