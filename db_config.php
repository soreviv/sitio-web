<?php
// Configuración de la base de datos
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '5432');
define('DB_NAME', getenv('DB_NAME') ?: 'mi_base');
define('DB_USER', getenv('DB_USER') ?: 'usuario');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: 'secreto');
?>