<?php
// Incluir la configuración de la base de datos
require_once 'db_config.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
    exit;
}

// --- VERIFICACIÓN hCaptcha ---
$hcaptcha_response = $_POST['h-captcha-response'] ?? '';
$hcaptcha_secret = getenv('HCAPTCHA_SECRET') ?: 'YOUR-HCAPTCHA-SECRETKEY'; // Reemplaza por tu clave secreta o usa variable de entorno
if (empty($hcaptcha_response)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'hCaptcha es requerido.']);
    exit;
}
$verify_url = 'https://hcaptcha.com/siteverify';
$data = [
    'secret' => $hcaptcha_secret,
    'response' => $hcaptcha_response
];
$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded",
        'method'  => 'POST',
        'content' => http_build_query($data)
    ]
];
$context  = stream_context_create($options);
$result = @file_get_contents($verify_url, false, $context);
$verification = json_decode($result, true);
if (empty($verification['success'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Verificación hCaptcha fallida.']);
    exit;
}

// 1. Recolección y Saneamiento Básico de Datos
$nombre = trim($_POST['nombre'] ?? '');
$email = trim($_POST['email'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$fecha = trim($_POST['fecha'] ?? null);
$hora = trim($_POST['hora'] ?? null);
$tipo_consulta = trim($_POST['tipo_consulta'] ?? '');
$mensaje = trim($_POST['mensaje'] ?? '');
$consentimiento = isset($_POST['consentimiento']);

// 2. Validación de Datos Esenciales
if (empty($nombre) || empty($email) || empty($telefono) || !$consentimiento) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Nombre, email, teléfono y consentimiento son obligatorios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'La dirección de correo electrónico no es válida.']);
    exit;
}

// 3. Inserción en la Base de Datos (usando PDO y consultas preparadas)
$dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";user=" . DB_USER . ";password=" . DB_PASSWORD;
$status_cita = 'pendiente'; // Las citas nuevas se marcan como pendientes de confirmación

try {
    $pdo = new PDO($dsn);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "INSERT INTO citas (nombre_paciente, email_paciente, telefono_paciente, fecha_cita, hora_cita, tipo_consulta, motivo_consulta, status) VALUES (:nombre, :email, :telefono, :fecha, :hora, :tipo_consulta, :mensaje, :status)";
    
    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
    $stmt->bindParam(':fecha', $fecha, PDO::PARAM_STR);
    $stmt->bindParam(':hora', $hora, PDO::PARAM_STR);
    $stmt->bindParam(':tipo_consulta', $tipo_consulta, PDO::PARAM_STR);
    $stmt->bindParam(':mensaje', $mensaje, PDO::PARAM_STR);
    $stmt->bindParam(':status', $status_cita, PDO::PARAM_STR);

    $stmt->execute();

} catch (PDOException $e) {
    http_response_code(500);
    // Loggear el error real para depuración: error_log($e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'No se pudo procesar la solicitud. Por favor, intente más tarde.']);
    exit;
}

// 1. Recolección y Saneamiento Básico de Datos
$nombre = trim($_POST['nombre'] ?? '');
$email = trim($_POST['email'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$fecha = trim($_POST['fecha'] ?? null);
$hora = trim($_POST['hora'] ?? null);
$tipo_consulta = trim($_POST['tipo_consulta'] ?? '');
$mensaje = trim($_POST['mensaje'] ?? '');
$consentimiento = isset($_POST['consentimiento']);

// 2. Validación de Datos Esenciales
if (empty($nombre) || empty($email) || empty($telefono) || !$consentimiento) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Nombre, email, teléfono y consentimiento son obligatorios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'La dirección de correo electrónico no es válida.']);
    exit;
}

// 3. Inserción en la Base de Datos
$dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";user=" . DB_USER . ";password=" . DB_PASSWORD;
$status_cita = 'pendiente'; // Las citas nuevas se marcan como pendientes de confirmación

try {
    $pdo = new PDO($dsn);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "INSERT INTO citas (nombre_paciente, email_paciente, telefono_paciente, fecha_cita, hora_cita, tipo_consulta, motivo_consulta, status) VALUES (:nombre, :email, :telefono, :fecha, :hora, :tipo_consulta, :mensaje, :status)";
    
    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
    $stmt->bindParam(':fecha', $fecha, PDO::PARAM_STR);
    $stmt->bindParam(':hora', $hora, PDO::PARAM_STR);
    $stmt->bindParam(':tipo_consulta', $tipo_consulta, PDO::PARAM_STR);
    $stmt->bindParam(':mensaje', $mensaje, PDO::PARAM_STR);
    $stmt->bindParam(':status', $status_cita, PDO::PARAM_STR);

    $stmt->execute();

} catch (PDOException $e) {
    http_response_code(500);
    // Loggear el error real para depuración: error_log($e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'No se pudo procesar la solicitud. Por favor, intente más tarde.']);
    exit;
}

// 4. Envío de Emails de Notificación (si la inserción fue exitosa)

// -- Email para el Doctor --
$email_to_doctor = "contacto@otorrinonet.com";
$subject_doctor = "Nueva Solicitud de Cita: " . $nombre;
$body_doctor = "Se ha recibido una nueva solicitud de cita.\n\n" .
              "Nombre: $nombre\n" .
              "Email: $email\n" .
              "Teléfono: $telefono\n" .
              "Fecha Preferida: " . ($fecha ?: 'No especificada') . "\n" .
              "Hora Preferida: " . ($hora ?: 'No especificada') . "\n" .
              "Tipo de Consulta: " . ($tipo_consulta ?: 'No especificado') . "\n" .
              "Motivo: $mensaje\n\n" .
              "La cita ha sido registrada en la base de datos con estado 'pendiente'. Por favor, contacte al paciente para confirmar.";
$headers_doctor = "From: " . $nombre . " <" . $email . ">\r\n";
$headers_doctor .= "Reply-To: " . $email . "\r\n";

$doctor_mail_sent = mail($email_to_doctor, $subject_doctor, $body_doctor, $headers_doctor);

// -- Email para el Paciente --
$email_to_patient = $email;
$subject_patient = "Confirmación de tu solicitud de cita - Dr. Alejandro Viveros";
$body_patient = "Hola " . $nombre . ",\n\nHemos recibido tu solicitud de cita para el día " . ($fecha ? (new DateTime($fecha))->format('d/m/Y') : '[Fecha por confirmar]') . " a las " . ($hora ?: '[Hora por confirmar]') . ".\n\nNos pondremos en contacto contigo a la brevedad para confirmar todos los detalles.\n\nGracias por tu confianza.\n\nAtentamente,\nDr. Alejandro Viveros Domínguez";
$headers_patient = "From: Dr. Alejandro Viveros <contacto@otorrinonet.com>\r\n";
$headers_patient .= "Reply-To: contacto@otorrinonet.com\r\n";

$patient_mail_sent = mail($email_to_patient, $subject_patient, $body_patient, $headers_patient);


if ($doctor_mail_sent && $patient_mail_sent) {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => '¡Solicitud enviada! Hemos enviado un correo de confirmación a tu email.']);
} else {
    http_response_code(207); // Multi-Status
    echo json_encode(['status' => 'warning', 'message' => 'Tu cita fue registrada, pero hubo un problema al enviar los correos de confirmación. Te contactaremos pronto.']);
}
?>