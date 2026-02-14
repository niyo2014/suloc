/**
 * CICESE - Forms JavaScript
 * Handles form submissions and validations
 */

// Contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';
            
            // Send form data via fetch
            const formAction = this.action || 'includes/submit-contact.php';
            fetch(formAction, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Merci pour votre demande de devis ! Nous vous contacterons dans les plus brefs délais.');
                    this.reset();
                } else {
                    alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
        });
    }
});

