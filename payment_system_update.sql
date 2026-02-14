-- Update payment_services table
ALTER TABLE payment_services 
ADD COLUMN guide_content_fr TEXT AFTER limits_info_en,
ADD COLUMN guide_content_en TEXT AFTER guide_content_fr;

-- Update payment_requests table
ALTER TABLE payment_requests 
ADD COLUMN verification_code VARCHAR(12) UNIQUE AFTER currency,
ADD COLUMN payout_status ENUM('Pending', 'Ready', 'Paid', 'Cancelled') DEFAULT 'Pending' AFTER status,
ADD COLUMN code_verified_at DATETIME NULL AFTER payout_status,
ADD COLUMN verified_by_admin INT NULL AFTER code_verified_at,
ADD INDEX (verification_code),
ADD CONSTRAINT fk_verified_by_admin FOREIGN KEY (verified_by_admin) REFERENCES admin_users(id) ON DELETE SET NULL;
