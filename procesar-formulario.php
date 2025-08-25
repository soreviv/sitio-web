<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // --- CONFIGURACIÓN ---
    $email_to = "contacto@otorrinonet.com"; // El email donde recibirás los mensajes
    $email_subject_prefix = "Contacto desde el Sitio Web";

    // --- VALIDACIÓN BÁSICA ---
    if (!isset($_POST['nombre']) || !isset($_POST['email'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Nombre y email son requeridos.']);
        exit;
    }

    // --- RECOLECCIÓN DE DATOS ---
    // Sanitiza el nombre para prevenir inyección de cabeceras de email
    $nombre = str_replace(array("\r", "\n"), '', strip_tags(trim($_POST["nombre"])));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $telefono = isset($_POST['telefono']) ? strip_tags(trim($_POST['telefono'])) : 'No proporcionado';
    $asunto_form = isset($_POST['asunto']) ? strip_tags(trim($_POST['asunto'])) : 'Contacto General';
    $mensaje = isset($_POST['mensaje']) ? strip_tags(trim($_POST["mensaje"])) : 'No proporcionado';

    // --- VALIDACIÓN DE EMAIL ---
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Dirección de email inválida.']);
        exit;
    }

    // --- CONSTRUCCIÓN DEL MENSAJE ---
    $email_subject = "$email_subject_prefix: $asunto_form";
    $email_body = "Has recibido un nuevo mensaje desde tu sitio web.\n\n";
    $email_body .= "Nombre: $nombre\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Teléfono: $telefono\n\n";
    $email_body .= "Mensaje:\n$mensaje\n";

    // --- ENVÍO DEL EMAIL ---
    $headers = "From: $nombre <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";

    if (mail($email_to, $email_subject, $email_body, $headers)) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => '¡Mensaje enviado correctamente!']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Hubo un error al enviar el mensaje.']);
    }

} else {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
}
?>