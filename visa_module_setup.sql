-- Visa Assistance Module Schema

-- 1. Visa Assistance Requests Table
CREATE TABLE IF NOT EXISTS visa_assistance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),
    origin_country VARCHAR(100) NOT NULL,
    destination_country VARCHAR(100) NOT NULL,
    visa_type ENUM('tourist', 'business', 'student', 'work', 'medical', 'transit') NOT NULL,
    travel_purpose TEXT,
    departure_date DATE,
    duration_stay VARCHAR(50),
    status ENUM('received', 'analyzing', 'docs_incomplete', 'docs_complete', 'submitted', 'pending_response', 'accepted', 'rejected', 'closed') DEFAULT 'received',
    assigned_agent_id INT,
    admin_notes TEXT,
    checklist_status JSON, -- To store documentary checklist state
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_agent_id) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Visa Assistance Documents Table
CREATE TABLE IF NOT EXISTS visa_assistance_docs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES visa_assistance_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Visa Assistance Logs Table
CREATE TABLE IF NOT EXISTS visa_assistance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    admin_id INT,
    action_type VARCHAR(50) NOT NULL,
    action_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES visa_assistance_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Visa Module Settings Table (for notification templates)
CREATE TABLE IF NOT EXISTS visa_assistance_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description VARCHAR(255),
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default Notification Templates
INSERT INTO visa_assistance_settings (setting_key, setting_value, description) VALUES
('template_received', 'Bonjour {client_name}, nous avons bien reçu votre demande d\'assistance visa pour {destination}. Un agent va l\'analyser prochainement.', 'Message auto: Demande reçue'),
('template_docs_incomplete', 'Bonjour {client_name}, votre dossier pour le visa {destination} est incomplet. Veuillez nous fournir les documents manquants.', 'Message auto: Documents incomplets'),
('template_docs_complete', 'Bonjour {client_name}, bonne nouvelle ! Votre dossier pour le visa {destination} est maintenant complet.', 'Message auto: Dossier complet'),
('template_result', 'Bonjour {client_name}, une réponse a été reçue pour votre demande de visa pour {destination}. Merci de nous contacter.', 'Message auto: Résultat communiqué');
