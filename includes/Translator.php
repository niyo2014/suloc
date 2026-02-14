<?php
/**
 * SULOC - Native Translation System (High Performance)
 * Handles FR/EN local translations via JSON dictionaries.
 */

class Translator {
    private static $instance = null;
    private $currentLang = 'fr';
    private $translations = [];

    public function __construct($pdo = null) {
        if (session_status() === PHP_SESSION_NONE) { session_start(); }
        
        // Priority: Session -> Cookie -> Default (FR)
        if (isset($_SESSION['lang'])) {
            $this->currentLang = $_SESSION['lang'];
        } elseif (isset($_COOKIE['suloc_lang'])) {
            $this->currentLang = $_COOKIE['suloc_lang'];
            $_SESSION['lang'] = $this->currentLang;
        }

        $this->loadDictionary();
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function loadDictionary() {
        $file = __DIR__ . '/../lang/' . $this->currentLang . '.json';
        if (file_exists($file)) {
            $json = file_get_contents($file);
            $this->translations = json_decode($json, true) ?? [];
        }
    }

    public function get($key, $params = []) {
        $text = $this->translations[$key] ?? $key;
        foreach ($params as $k => $v) {
            $text = str_replace('{' . $k . '}', $v, $text);
        }
        return $text;
    }

    public function setLanguage($lang) {
        if (in_array($lang, ['fr', 'en'])) {
            $this->currentLang = $lang;
            $_SESSION['lang'] = $lang;
            setcookie('suloc_lang', $lang, time() + (86400 * 365), '/');
            $this->loadDictionary();
        }
    }

    public function getCurrentLang() {
        return $this->currentLang;
    }

    public function getCurrentLanguage() {
        return $this->currentLang;
    }
}

/**
 * Global Helper Function
 * Usage: __('key_name')
 */
function __($key, $params = []) {
    return Translator::getInstance()->get($key, $params);
}
