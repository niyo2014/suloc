<?php
/**
 * Lightweight environment loader.
 * Reads key=value pairs from a .env file so deployments
 * can override defaults without editing the source code.
 */

if (!function_exists('loadEnvironment')) {
    function loadEnvironment(?string $envPath = null): void
    {
        $path = $envPath ?? dirname(__DIR__) . '/.env';

        if (!is_file($path) || !is_readable($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || $trimmed[0] === '#') {
                continue;
            }

            [$key, $value] = array_pad(explode('=', $trimmed, 2), 2, '');
            $key = trim($key);
            if ($key === '') {
                continue;
            }

            $value = trim($value);
            $value = trim($value, "\"'");

            if (getenv($key) === false) {
                putenv(sprintf('%s=%s', $key, $value));
            }
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}

