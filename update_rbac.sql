-- Update admin_users table structure
ALTER TABLE admin_users
MODIFY COLUMN role ENUM('creator', 'super_admin', 'admin') NOT NULL DEFAULT 'admin',
ADD COLUMN is_blocked TINYINT(1) NOT NULL DEFAULT 0,
ADD COLUMN permissions TEXT DEFAULT NULL;

-- Create system_status table for global toggles
CREATE TABLE IF NOT EXISTS system_status (
    id INT PRIMARY KEY DEFAULT 1,
    maintenance_mode TINYINT(1) DEFAULT 0,
    frozen_modules JSON DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initialize system status if empty
INSERT IGNORE INTO system_status (id, maintenance_mode) VALUES (1, 0);

-- Create activity_logs for audit trail
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
