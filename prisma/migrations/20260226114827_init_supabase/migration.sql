-- CreateEnum
CREATE TYPE "site_settings_setting_type" AS ENUM ('text', 'textarea', 'image', 'boolean', 'json');

-- CreateEnum
CREATE TYPE "vehicles_transmission" AS ENUM ('automatic', 'manual');

-- CreateEnum
CREATE TYPE "admin_users_role" AS ENUM ('creator', 'super_admin', 'admin');

-- CreateEnum
CREATE TYPE "vehicles_fuel_type" AS ENUM ('petrol', 'diesel', 'hybrid', 'electric');

-- CreateEnum
CREATE TYPE "contact_submissions_status" AS ENUM ('new', 'read', 'replied');

-- CreateEnum
CREATE TYPE "vehicle_requests_status" AS ENUM ('new', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "visa_assistance_requests_visa_type" AS ENUM ('tourist', 'business', 'student', 'work', 'medical', 'transit');

-- CreateEnum
CREATE TYPE "vehicles_status" AS ENUM ('available', 'negotiating', 'sold');

-- CreateEnum
CREATE TYPE "import_requests_transit_port" AS ENUM ('Mombasa', 'Dar es Salaam', 'Other');

-- CreateEnum
CREATE TYPE "vehicles_vehicle_condition" AS ENUM ('new', 'used', 'certified');

-- CreateEnum
CREATE TYPE "import_requests_container_size" AS ENUM ('20ft', '40ft', 'LCL/Groupage');

-- CreateEnum
CREATE TYPE "visa_requests_status" AS ENUM ('new', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "import_requests_incoterm" AS ENUM ('EXW', 'FOB', 'CIF', 'DAP');

-- CreateEnum
CREATE TYPE "visa_assistance_requests_status" AS ENUM ('received', 'analyzing', 'docs_incomplete', 'docs_complete', 'submitted', 'pending_response', 'accepted', 'rejected', 'closed');

-- CreateEnum
CREATE TYPE "payment_requests_payment_method" AS ENUM ('cash', 'bank');

-- CreateEnum
CREATE TYPE "import_requests_status" AS ENUM ('new', 'quote_sent', 'docs_pending', 'in_transit', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "payment_requests_transaction_type" AS ENUM ('send', 'receive', 'exchange');

-- CreateEnum
CREATE TYPE "payment_requests_status" AS ENUM ('new', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "payment_requests_payment_verification_status" AS ENUM ('pending', 'verified');

-- CreateEnum
CREATE TYPE "payment_requests_payout_status" AS ENUM ('Pending', 'Ready', 'Paid', 'Cancelled');

-- CreateTable
CREATE TABLE "about_content" (
    "id" SERIAL NOT NULL,
    "section_key" VARCHAR(255) NOT NULL,
    "section_value" TEXT,

    CONSTRAINT "about_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_section" (
    "id" SERIAL NOT NULL,
    "title_fr" VARCHAR(255) NOT NULL,
    "title_en" VARCHAR(255),
    "content_fr" TEXT NOT NULL,
    "content_en" TEXT,
    "image_url" VARCHAR(500),
    "mission_fr" TEXT,
    "mission_en" TEXT,
    "vision_fr" TEXT,
    "vision_en" TEXT,
    "values_fr" TEXT,
    "values_en" TEXT,
    "updated_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "about_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" SERIAL NOT NULL,
    "title_fr" VARCHAR(255) NOT NULL,
    "title_en" VARCHAR(255),
    "subtitle_fr" TEXT,
    "subtitle_en" TEXT,
    "description_fr" TEXT,
    "description_en" TEXT,
    "image_url" VARCHAR(500) NOT NULL,
    "learn_more_link" VARCHAR(500),
    "whatsapp_number" VARCHAR(50),
    "cta_text_fr" VARCHAR(100) DEFAULT 'En savoir plus',
    "cta_text_en" VARCHAR(100) DEFAULT 'Learn more',
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action_type" VARCHAR(50) NOT NULL,
    "details" TEXT,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(100),
    "email" VARCHAR(100),
    "role" "admin_users_role" NOT NULL DEFAULT 'admin',
    "is_active" BOOLEAN DEFAULT true,
    "last_login" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "permissions" TEXT,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "service_type" VARCHAR(100),
    "message" TEXT NOT NULL,
    "status" "contact_submissions_status" DEFAULT 'new',
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_requests" (
    "id" SERIAL NOT NULL,
    "import_service_id" INTEGER,
    "client_name" VARCHAR(100) NOT NULL,
    "client_email" VARCHAR(100),
    "client_phone" VARCHAR(50) NOT NULL,
    "client_whatsapp" VARCHAR(50),
    "origin_country" VARCHAR(100),
    "destination_country" VARCHAR(100),
    "transit_port" "import_requests_transit_port",
    "cargo_type" VARCHAR(100),
    "container_size" "import_requests_container_size",
    "incoterm" "import_requests_incoterm",
    "cargo_description" TEXT,
    "commodity_type" TEXT,
    "estimated_weight" DECIMAL(10,2),
    "status" "import_requests_status" DEFAULT 'new',
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "import_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_services" (
    "id" SERIAL NOT NULL,
    "service_name_fr" VARCHAR(200) NOT NULL,
    "service_name_en" VARCHAR(200),
    "slug" VARCHAR(255),
    "description_fr" TEXT,
    "description_en" TEXT,
    "steps_fr" TEXT,
    "steps_en" TEXT,
    "countries_served" TEXT,
    "base_price" DECIMAL(10,2),
    "currency" VARCHAR(10) DEFAULT 'USD',
    "icon" VARCHAR(50) DEFAULT 'fas fa-ship',
    "is_active" BOOLEAN DEFAULT true,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "title_fr" VARCHAR(255) NOT NULL,
    "title_en" VARCHAR(255),
    "content_fr" TEXT,
    "content_en" TEXT,
    "meta_description_fr" VARCHAR(500),
    "meta_description_en" VARCHAR(500),
    "featured_image" VARCHAR(500),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_requests" (
    "id" SERIAL NOT NULL,
    "payment_service_id" INTEGER,
    "client_name" VARCHAR(100) NOT NULL,
    "client_phone" VARCHAR(50) NOT NULL,
    "client_whatsapp" VARCHAR(50),
    "sender_name" VARCHAR(255),
    "sender_address" TEXT,
    "receiver_name" VARCHAR(255),
    "receiver_id_number" VARCHAR(100),
    "receiver_phone" VARCHAR(50),
    "receiver_address" TEXT,
    "receiver_photo" VARCHAR(500),
    "payment_method" "payment_requests_payment_method" DEFAULT 'cash',
    "bank_slip_proof" VARCHAR(500),
    "transfer_fee_percentage" DECIMAL(5,2),
    "transfer_fee_amount" DECIMAL(15,2),
    "total_to_pay" DECIMAL(15,2),
    "amount_to_receive" DECIMAL(15,2),
    "operator" VARCHAR(100),
    "amount" DECIMAL(15,2),
    "currency" VARCHAR(10),
    "verification_code" VARCHAR(12),
    "transaction_type" "payment_requests_transaction_type" DEFAULT 'send',
    "status" "payment_requests_status" DEFAULT 'new',
    "payment_verification_status" "payment_requests_payment_verification_status" DEFAULT 'verified',
    "payout_status" "payment_requests_payout_status" DEFAULT 'Pending',
    "code_verified_at" TIMESTAMP(0),
    "verified_by_admin" INTEGER,
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "payment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_services" (
    "id" SERIAL NOT NULL,
    "operator_name" VARCHAR(100) NOT NULL,
    "operator_logo" VARCHAR(500),
    "description_fr" TEXT,
    "description_en" TEXT,
    "limits_info_fr" TEXT,
    "limits_info_en" TEXT,
    "guide_content_fr" TEXT,
    "guide_content_en" TEXT,
    "daily_limit" DECIMAL(15,2),
    "monthly_limit" DECIMAL(15,2),
    "exchange_rate" DECIMAL(10,4),
    "currency_pair" VARCHAR(20),
    "is_active" BOOLEAN DEFAULT true,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_content" (
    "id" SERIAL NOT NULL,
    "content_key" VARCHAR(255) NOT NULL,
    "content_value" TEXT,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" SERIAL NOT NULL,
    "setting_key" VARCHAR(100) NOT NULL,
    "setting_value" TEXT,
    "setting_group" VARCHAR(50) DEFAULT 'general',
    "setting_type" "site_settings_setting_type" DEFAULT 'text',
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_status" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "maintenance_mode" BOOLEAN DEFAULT false,
    "frozen_modules" TEXT,
    "updated_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_images" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "image_url" VARCHAR(500) NOT NULL,
    "alt_text" VARCHAR(255),
    "order_index" INTEGER DEFAULT 0,

    CONSTRAINT "vehicle_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_requests" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER,
    "client_name" VARCHAR(100) NOT NULL,
    "client_email" VARCHAR(100),
    "client_phone" VARCHAR(50) NOT NULL,
    "client_whatsapp" VARCHAR(50),
    "message" TEXT,
    "status" "vehicle_requests_status" DEFAULT 'new',
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "vehicle_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "year" INTEGER,
    "transmission" "vehicles_transmission" DEFAULT 'automatic',
    "fuel_type" "vehicles_fuel_type" DEFAULT 'petrol',
    "price" DECIMAL(15,2),
    "status" "vehicles_status" NOT NULL DEFAULT 'available',
    "currency" VARCHAR(10) DEFAULT 'USD',
    "vehicle_condition" "vehicles_vehicle_condition" DEFAULT 'used',
    "description_fr" TEXT,
    "description_en" TEXT,
    "main_image" VARCHAR(500),
    "mileage" INTEGER,
    "color" VARCHAR(50),
    "engine_size" VARCHAR(20),
    "doors" INTEGER DEFAULT 4,
    "seats" INTEGER DEFAULT 5,
    "is_featured" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visa_assistance_docs" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_type" VARCHAR(50),
    "file_size" INTEGER,
    "uploaded_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visa_assistance_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visa_assistance_logs" (
    "id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "admin_id" INTEGER,
    "action_type" VARCHAR(50) NOT NULL,
    "action_description" TEXT,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visa_assistance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visa_assistance_requests" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "whatsapp" VARCHAR(50),
    "origin_country" VARCHAR(100) NOT NULL,
    "destination_country" VARCHAR(100) NOT NULL,
    "visa_type" "visa_assistance_requests_visa_type" NOT NULL,
    "travel_purpose" TEXT,
    "departure_date" DATE,
    "duration_stay" VARCHAR(50),
    "status" "visa_assistance_requests_status" DEFAULT 'received',
    "assigned_agent_id" INTEGER,
    "admin_notes" TEXT,
    "checklist_status" TEXT,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "visa_assistance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visa_assistance_settings" (
    "id" SERIAL NOT NULL,
    "setting_key" VARCHAR(100) NOT NULL,
    "setting_value" TEXT,
    "description" VARCHAR(255),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "visa_assistance_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visa_requests" (
    "id" SERIAL NOT NULL,
    "visa_service_id" INTEGER,
    "client_name" VARCHAR(100) NOT NULL,
    "client_email" VARCHAR(100),
    "client_phone" VARCHAR(50) NOT NULL,
    "client_whatsapp" VARCHAR(50),
    "destination_country" VARCHAR(100),
    "visa_type" VARCHAR(100),
    "travel_date" DATE,
    "additional_info" TEXT,
    "status" "visa_requests_status" DEFAULT 'new',
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "visa_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visa_services" (
    "id" SERIAL NOT NULL,
    "country_code" VARCHAR(3) NOT NULL,
    "country_name_fr" VARCHAR(100) NOT NULL,
    "country_name_en" VARCHAR(100),
    "flag_icon" VARCHAR(100),
    "requirements_fr" TEXT,
    "requirements_en" TEXT,
    "documents_needed_fr" TEXT,
    "documents_needed_en" TEXT,
    "processing_time" VARCHAR(50),
    "service_fee" DECIMAL(10,2),
    "currency" VARCHAR(10) DEFAULT 'USD',
    "is_active" BOOLEAN DEFAULT true,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visa_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "section_key" ON "about_content"("section_key");

-- CreateIndex
CREATE INDEX "user_id" ON "activity_logs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "username" ON "admin_users"("username");

-- CreateIndex
CREATE INDEX "import_service_id" ON "import_requests"("import_service_id");

-- CreateIndex
CREATE UNIQUE INDEX "import_services_slug_key" ON "import_services"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "verification_code" ON "payment_requests"("verification_code");

-- CreateIndex
CREATE INDEX "fk_verified_by_admin" ON "payment_requests"("verified_by_admin");

-- CreateIndex
CREATE INDEX "idx_receiver_id" ON "payment_requests"("receiver_id_number");

-- CreateIndex
CREATE INDEX "idx_receiver_name" ON "payment_requests"("receiver_name");

-- CreateIndex
CREATE INDEX "idx_receiver_phone" ON "payment_requests"("receiver_phone");

-- CreateIndex
CREATE INDEX "idx_sender_name" ON "payment_requests"("sender_name");

-- CreateIndex
CREATE INDEX "payment_service_id" ON "payment_requests"("payment_service_id");

-- CreateIndex
CREATE INDEX "verification_code_2" ON "payment_requests"("verification_code");

-- CreateIndex
CREATE UNIQUE INDEX "content_key" ON "site_content"("content_key");

-- CreateIndex
CREATE UNIQUE INDEX "setting_key" ON "site_settings"("setting_key");

-- CreateIndex
CREATE INDEX "vehicle_images_vehicle_id_idx" ON "vehicle_images"("vehicle_id");

-- CreateIndex
CREATE INDEX "vehicle_requests_vehicle_id_idx" ON "vehicle_requests"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_slug_key" ON "vehicles"("slug");

-- CreateIndex
CREATE INDEX "idx_price" ON "vehicles"("price");

-- CreateIndex
CREATE INDEX "idx_status" ON "vehicles"("status");

-- CreateIndex
CREATE INDEX "idx_year" ON "vehicles"("year");

-- CreateIndex
CREATE INDEX "visa_assistance_docs_request_id_idx" ON "visa_assistance_docs"("request_id");

-- CreateIndex
CREATE INDEX "admin_id" ON "visa_assistance_logs"("admin_id");

-- CreateIndex
CREATE INDEX "visa_assistance_logs_request_id_idx" ON "visa_assistance_logs"("request_id");

-- CreateIndex
CREATE INDEX "assigned_agent_id" ON "visa_assistance_requests"("assigned_agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "visa_assistance_settings_key_idx" ON "visa_assistance_settings"("setting_key");

-- CreateIndex
CREATE INDEX "visa_requests_visa_service_id_idx" ON "visa_requests"("visa_service_id");

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "import_requests" ADD CONSTRAINT "import_requests_ibfk_1" FOREIGN KEY ("import_service_id") REFERENCES "import_services"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "fk_rel_verified_by_admin" FOREIGN KEY ("verified_by_admin") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_ibfk_1" FOREIGN KEY ("payment_service_id") REFERENCES "payment_services"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "vehicle_images" ADD CONSTRAINT "vehicle_images_ibfk_1" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "vehicle_requests" ADD CONSTRAINT "vehicle_requests_ibfk_1" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "visa_assistance_docs" ADD CONSTRAINT "visa_assistance_docs_ibfk_1" FOREIGN KEY ("request_id") REFERENCES "visa_assistance_requests"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "visa_assistance_logs" ADD CONSTRAINT "visa_assistance_logs_ibfk_1" FOREIGN KEY ("request_id") REFERENCES "visa_assistance_requests"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "visa_assistance_logs" ADD CONSTRAINT "visa_assistance_logs_ibfk_2" FOREIGN KEY ("admin_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "visa_assistance_requests" ADD CONSTRAINT "visa_assistance_requests_ibfk_1" FOREIGN KEY ("assigned_agent_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "visa_requests" ADD CONSTRAINT "visa_requests_ibfk_1" FOREIGN KEY ("visa_service_id") REFERENCES "visa_services"("id") ON DELETE SET NULL ON UPDATE RESTRICT;
