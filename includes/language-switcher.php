<?php
/**
 * SULOC - Native Language Switcher component
 * Replaces Google Translate with high-speed local switching.
 */
require_once __DIR__ . '/Translator.php';

require_once __DIR__ . '/Translator.php';

$currentLang = Translator::getInstance()->getCurrentLang();
?>

<div class="suloc-lang-switcher">
    <a href="?lang=fr" class="lang-btn <?php echo $currentLang === 'fr' ? 'active' : ''; ?>">
        <img src="https://flagcdn.com/w40/fr.png" alt="FR">
        <span>FR</span>
    </a>
    <a href="?lang=en" class="lang-btn <?php echo $currentLang === 'en' ? 'active' : ''; ?>">
        <img src="https://flagcdn.com/w40/gb.png" alt="EN">
        <span>EN</span>
    </a>
</div>

<style>
    .suloc-lang-switcher {
        display: flex;
        gap: 10px;
        background: #f8fafc;
        padding: 4px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        vertical-align: middle;
    }
    .lang-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-weight: 800;
        font-size: 13px;
        color: #003060;
        text-decoration: none;
        transition: all 0.3s;
    }
    .lang-btn img {
        width: 18px;
        height: auto;
        border-radius: 2px;
        filter: grayscale(100%);
        opacity: 0.6;
    }
    .lang-btn:hover {
        background: white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .lang-btn.active {
        background: #003060;
        color: white;
    }
    .lang-btn.active img {
        filter: none;
        opacity: 1;
    }
    @media (max-width: 768px) {
        .suloc-lang-switcher { margin-top: 10px; width: 100%; justify-content: center; }
    }
</style>
