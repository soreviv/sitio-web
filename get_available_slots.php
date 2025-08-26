<?php
header('Content-Type: application/json');
require_once 'db_config.php';

// 1. OBTENER Y VALIDAR LA FECHA DE ENTRADA
$dateStr = $_GET['date'] ?? null;
if (!$dateStr) {
    http_response_code(400);
    echo json_encode(['error' => 'Fecha no proporcionada.']);
    exit;
}

try {
    $selectedDate = new DateTime($dateStr);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato de fecha inválido.']);
    exit;
}

// 2. DEFINIR HORARIOS DE TRABAJO Y REGLAS
$dayOfWeek = $selectedDate->format('N'); // 1 (Lunes) a 7 (Domingo)
$appointmentDuration = 30; // en minutos
$slots = [];

$startTime = null;
$endTime = null;

if ($dayOfWeek >= 1 && $dayOfWeek <= 3) { // Lunes a Miércoles
    $startTime = '16:00';
    $endTime = '19:30';
} elseif ($dayOfWeek >= 4 && $dayOfWeek <= 5) { // Jueves y Viernes
    $startTime = '10:00';
    $endTime = '12:30';
}

// Si no es un día laboral, devolver un array vacío
if ($startTime === null) {
    echo json_encode([]);
    exit;
}

// 3. GENERAR TODOS LOS POSIBLES HORARIOS PARA EL DÍA
$start = new DateTime($selectedDate->format('Y-m-d') . ' ' . $startTime);
$end = new DateTime($selectedDate->format('Y-m-d') . ' ' . $endTime);
$all_slots = [];

while ($start <= $end) {
    $all_slots[] = $start->format('H:i');
    $start->modify('+' . $appointmentDuration . ' minutes');
}

// 4. OBTENER CITAS YA AGENDADAS DE LA BASE DE DATOS
$booked_slots = [];
$dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";user=" . DB_USER . ";password=" . DB_PASSWORD;

try {
    $pdo = new PDO($dsn);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT hora_cita FROM citas WHERE fecha_cita = :fecha_cita";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['fecha_cita' => $selectedDate->format('Y-m-d')]);
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Formatear a H:i para consistencia
        $booked_slots[] = (new DateTime($row['hora_cita']))->format('H:i');
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos.']);
    // error_log($e->getMessage()); // Para depuración en el servidor
    exit;
}

// 5. FILTRAR PARA OBTENER SOLO HORARIOS DISPONIBLES
$available_slots = array_diff($all_slots, $booked_slots);

// 6. APLICAR REGLA DE 2 HORAS DE ANTELACIÓN SI ES HOY
$now = new DateTime();
if ($selectedDate->format('Y-m-d') === $now->format('Y-m-d')) {
    $min_time = $now->modify('+2 hours');
    $final_slots = [];
    foreach ($available_slots as $slot) {
        $slot_time = new DateTime($selectedDate->format('Y-m-d') . ' ' . $slot);
        if ($slot_time > $min_time) {
            $final_slots[] = $slot;
        }
    }
} else {
    $final_slots = array_values($available_slots); // Re-indexar el array
}

// 7. DEVOLVER RESULTADO
echo json_encode($final_slots);
?>