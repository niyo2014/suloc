<?php
/**
 * SULOC Admin - Logout
 */
require_once __DIR__ . '/../config/config.php';

session_destroy();
redirect(ADMIN_URL . '/login.php');

