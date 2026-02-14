-- SULOC CMS Database Schema
-- Version 1.0

-- 1. Admin Users Table
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor',
    is_active TINYINT(1) DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Vehicles Table
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT,
    transmission ENUM('automatic', 'manual') DEFAULT 'automatic',
    fuel_type ENUM('petrol', 'diesel', 'hybrid', 'electric') DEFAULT 'petrol',
    price DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'USD',
    vehicle_condition ENUM('new', 'used', 'certified') DEFAULT 'used',
    description TEXT,
    main_image VARCHAR(500),
    mileage INT,
    color VARCHAR(50),
    engine_size VARCHAR(20),
    doors INT DEFAULT 4,
    seats INT DEFAULT 5,
    is_featured TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Vehicle Images Table
CREATE TABLE vehicle_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    order_index INT DEFAULT 0,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Visa Services Table
CREATE TABLE visa_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country_code VARCHAR(3) NOT NULL,
    country_name_fr VARCHAR(100) NOT NULL,
    country_name_en VARCHAR(100),
    flag_icon VARCHAR(100),
    requirements_fr TEXT,
    requirements_en TEXT,
    documents_needed_fr TEXT,
    documents_needed_en TEXT,
    processing_time VARCHAR(50),
    service_fee DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    is_active TINYINT(1) DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Import Services Table
CREATE TABLE import_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name_fr VARCHAR(200) NOT NULL,
    service_name_en VARCHAR(200),
    slug VARCHAR(255) UNIQUE,
    description_fr TEXT,
    description_en TEXT,
    steps_fr TEXT,
    steps_en TEXT,
    countries_served TEXT,
    base_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    icon VARCHAR(50) DEFAULT 'fas fa-ship',
    is_active TINYINT(1) DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Payment Services Table
CREATE TABLE payment_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operator_name VARCHAR(100) NOT NULL,
    operator_logo VARCHAR(500),
    description_fr TEXT,
    description_en TEXT,
    limits_info_fr TEXT,
    limits_info_en TEXT,
    daily_limit DECIMAL(15,2),
    monthly_limit DECIMAL(15,2),
    exchange_rate DECIMAL(10,4),
    currency_pair VARCHAR(20),
    is_active TINYINT(1) DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Vehicle Requests Table
CREATE TABLE vehicle_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    client_name VARCHAR(100) NOT NULL,
    client_email VARCHAR(100),
    client_phone VARCHAR(50) NOT NULL,
    client_whatsapp VARCHAR(50),
    message TEXT,
    status ENUM('new', 'in_progress', 'completed', 'cancelled') DEFAULT 'new',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Visa Requests Table
CREATE TABLE visa_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visa_service_id INT,
    client_name VARCHAR(100) NOT NULL,
    client_email VARCHAR(100),
    client_phone VARCHAR(50) NOT NULL,
    client_whatsapp VARCHAR(50),
    destination_country VARCHAR(100),
    visa_type VARCHAR(100),
    travel_date DATE,
    additional_info TEXT,
    status ENUM('new', 'in_progress', 'completed', 'cancelled') DEFAULT 'new',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (visa_service_id) REFERENCES visa_services(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Import Requests Table
CREATE TABLE import_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    import_service_id INT,
    client_name VARCHAR(100) NOT NULL,
    client_email VARCHAR(100),
    client_phone VARCHAR(50) NOT NULL,
    client_whatsapp VARCHAR(50),
    origin_country VARCHAR(100),
    destination_country VARCHAR(100),
    cargo_type VARCHAR(100),
    cargo_description TEXT,
    estimated_weight VARCHAR(50),
    status ENUM('new', 'in_progress', 'completed', 'cancelled') DEFAULT 'new',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (import_service_id) REFERENCES import_services(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Payment Requests Table
CREATE TABLE payment_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_service_id INT,
    client_name VARCHAR(100) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    client_whatsapp VARCHAR(50),
    operator VARCHAR(100),
    amount DECIMAL(15,2),
    currency VARCHAR(10),
    transaction_type ENUM('send', 'receive', 'exchange') DEFAULT 'send',
    status ENUM('new', 'in_progress', 'completed', 'cancelled') DEFAULT 'new',
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_service_id) REFERENCES payment_services(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Pages Table
CREATE TABLE pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title_fr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    content_fr LONGTEXT,
    content_en LONGTEXT,
    meta_description_fr VARCHAR(500),
    meta_description_en VARCHAR(500),
    featured_image VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Site Settings Table
CREATE TABLE site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_group VARCHAR(50) DEFAULT 'general',
    setting_type ENUM('text', 'textarea', 'image', 'boolean', 'json') DEFAULT 'text',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default Settings
INSERT INTO site_settings (setting_key, setting_value, setting_group) VALUES
('site_name', 'SULOC', 'general'),
('site_tagline_fr', 'Success Logistics Company', 'general'),
('site_tagline_en', 'Success Logistics Company', 'general'),
('phone_primary', '+25762400920', 'contact'),
('phone_whatsapp', '+25762400920', 'contact'),
('email_primary', 'contact@suloc.com', 'contact'),
('address', 'Bujumbura, Burundi', 'contact'),
('facebook_url', '', 'social'),
('instagram_url', '', 'social'),
('linkedin_url', '', 'social'),
('whatsapp_message', 'Bonjour SULOC, je souhaite des informations sur...', 'whatsapp');

-- Default Admin User (password: admin123 - CHANGE IN PRODUCTION!)
INSERT INTO admin_users (username, password_hash, full_name, email, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur SULOC', 'admin@suloc.com', 'super_admin');
