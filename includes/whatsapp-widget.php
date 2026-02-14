<!-- WhatsApp Floating Widget -->
<style>
    .whatsapp-float {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    }
    
    .whatsapp-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
        cursor: pointer;
        transition: all 0.3s;
        text-decoration: none;
        animation: pulse 2s infinite;
    }
    
    .whatsapp-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
    }
    
    .whatsapp-popup {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 300px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        display: none;
        overflow: hidden;
    }
    
    .whatsapp-popup.active {
        display: block;
        animation: slideUp 0.3s ease-out;
    }
    
    .whatsapp-header {
        background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .whatsapp-header h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
    }
    
    .whatsapp-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .whatsapp-body {
        padding: 16px;
    }
    
    .whatsapp-message {
        background: #f0f0f0;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #333;
    }
    
    .whatsapp-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .whatsapp-option {
        background: white;
        border: 2px solid #25D366;
        color: #25D366;
        padding: 10px 16px;
        border-radius: 8px;
        text-align: center;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .whatsapp-option:hover {
        background: #25D366;
        color: white;
    }
    
    .whatsapp-option i {
        margin-right: 8px;
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
        .whatsapp-float {
            bottom: 15px;
            right: 15px;
        }
        
        .whatsapp-button {
            width: 56px;
            height: 56px;
            font-size: 28px;
        }
        
        .whatsapp-popup {
            width: calc(100vw - 30px);
            right: -15px;
        }
    }
</style>

<div class="whatsapp-float">
    <!-- Popup Menu -->
    <div class="whatsapp-popup" id="whatsapp-popup">
        <div class="whatsapp-header">
            <h3><i class="fab fa-whatsapp"></i> Contactez-nous</h3>
            <button class="whatsapp-close" onclick="closeWhatsAppPopup()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="whatsapp-body">
            <div class="whatsapp-message">
                Bonjour! Comment pouvons-nous vous aider aujourd'hui?
            </div>
            <div class="whatsapp-options">
                <a href="https://wa.me/25762400920?text=Bonjour%20SULOC%2C%20je%20souhaite%20des%20informations%20sur%20vos%20services." 
                   class="whatsapp-option" target="_blank">
                    <i class="fas fa-info-circle"></i> Informations Générales
                </a>
                <a href="https://wa.me/25762400920?text=Bonjour%20SULOC%2C%20je%20suis%20intéressé%20par%20un%20véhicule." 
                   class="whatsapp-option" target="_blank">
                    <i class="fas fa-car"></i> Véhicules
                </a>
                <a href="https://wa.me/25762400920?text=Bonjour%20SULOC%2C%20j'ai%20besoin%20d'aide%20pour%20un%20visa." 
                   class="whatsapp-option" target="_blank">
                    <i class="fas fa-passport"></i> Services Visa
                </a>
                <a href="https://wa.me/25762400920?text=Bonjour%20SULOC%2C%20je%20souhaite%20des%20informations%20sur%20l'import/logistique." 
                   class="whatsapp-option" target="_blank">
                    <i class="fas fa-ship"></i> Import/Logistique
                </a>
                <a href="https://wa.me/25762400920?text=Bonjour%20SULOC%2C%20j'ai%20une%20question%20sur%20les%20paiements." 
                   class="whatsapp-option" target="_blank">
                    <i class="fas fa-money-bill-wave"></i> Services Paiement
                </a>
            </div>
        </div>
    </div>
    
    <!-- Floating Button -->
    <a href="javascript:void(0)" class="whatsapp-button" id="whatsapp-button" onclick="toggleWhatsAppPopup()">
        <i class="fab fa-whatsapp"></i>
    </a>
</div>

<script>
    function toggleWhatsAppPopup() {
        const popup = document.getElementById('whatsapp-popup');
        popup.classList.toggle('active');
    }
    
    function closeWhatsAppPopup() {
        const popup = document.getElementById('whatsapp-popup');
        popup.classList.remove('active');
    }
    
    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        const popup = document.getElementById('whatsapp-popup');
        const button = document.getElementById('whatsapp-button');
        
        if (!popup.contains(e.target) && !button.contains(e.target)) {
            popup.classList.remove('active');
        }
    });
    
    // Show popup automatically after 5 seconds (first visit only)
    if (!sessionStorage.getItem('whatsapp-shown')) {
        setTimeout(() => {
            document.getElementById('whatsapp-popup').classList.add('active');
            sessionStorage.setItem('whatsapp-shown', 'true');
        }, 5000);
    }
</script>
