-- Database Migration: SULOC Money Transfer v2.0

-- 1. Update payment_requests table with required fields
ALTER TABLE payment_requests
ADD COLUMN sender_name VARCHAR(255) AFTER client_whatsapp,
ADD COLUMN sender_address TEXT AFTER sender_name,
ADD COLUMN receiver_name VARCHAR(255) AFTER sender_address,
ADD COLUMN receiver_id_number VARCHAR(100) AFTER receiver_name,
ADD COLUMN receiver_phone VARCHAR(50) AFTER receiver_id_number,
ADD COLUMN receiver_address TEXT AFTER receiver_phone,
ADD COLUMN receiver_photo VARCHAR(500) AFTER receiver_address,
ADD COLUMN payment_method ENUM('cash', 'bank') DEFAULT 'cash' AFTER receiver_photo,
ADD COLUMN bank_slip_proof VARCHAR(500) AFTER payment_method,
ADD COLUMN transfer_fee_percentage DECIMAL(5,2) AFTER bank_slip_proof,
ADD COLUMN transfer_fee_amount DECIMAL(15,2) AFTER transfer_fee_percentage,
ADD COLUMN total_to_pay DECIMAL(15,2) AFTER transfer_fee_amount,
ADD COLUMN amount_to_receive DECIMAL(15,2) AFTER total_to_pay,
ADD COLUMN payment_verification_status ENUM('pending', 'verified') DEFAULT 'verified' AFTER status;

-- Note: default 'verified' for cash, 'pending' for bank as per requirement.

-- 2. Add Global Transfer Fee Setting
INSERT INTO site_settings (setting_key, setting_value, setting_group, setting_type) 
VALUES ('transfer_fee_percentage', '5.97', 'payment', 'text')
ON DUPLICATE KEY UPDATE setting_value = '5.97';
