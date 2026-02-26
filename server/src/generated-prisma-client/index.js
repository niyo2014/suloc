
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/library.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.About_contentScalarFieldEnum = {
  id: 'id',
  section_key: 'section_key',
  section_value: 'section_value'
};

exports.Prisma.About_sectionScalarFieldEnum = {
  id: 'id',
  title_fr: 'title_fr',
  title_en: 'title_en',
  content_fr: 'content_fr',
  content_en: 'content_en',
  image_url: 'image_url',
  mission_fr: 'mission_fr',
  mission_en: 'mission_en',
  vision_fr: 'vision_fr',
  vision_en: 'vision_en',
  values_fr: 'values_fr',
  values_en: 'values_en',
  updated_at: 'updated_at'
};

exports.Prisma.Hero_slidesScalarFieldEnum = {
  id: 'id',
  title_fr: 'title_fr',
  title_en: 'title_en',
  subtitle_fr: 'subtitle_fr',
  subtitle_en: 'subtitle_en',
  description_fr: 'description_fr',
  description_en: 'description_en',
  image_url: 'image_url',
  learn_more_link: 'learn_more_link',
  whatsapp_number: 'whatsapp_number',
  cta_text_fr: 'cta_text_fr',
  cta_text_en: 'cta_text_en',
  order_index: 'order_index',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Activity_logsScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  action_type: 'action_type',
  details: 'details',
  ip_address: 'ip_address',
  created_at: 'created_at'
};

exports.Prisma.Admin_usersScalarFieldEnum = {
  id: 'id',
  username: 'username',
  password_hash: 'password_hash',
  full_name: 'full_name',
  email: 'email',
  role: 'role',
  is_active: 'is_active',
  last_login: 'last_login',
  created_at: 'created_at',
  is_blocked: 'is_blocked',
  permissions: 'permissions'
};

exports.Prisma.Contact_submissionsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  service_type: 'service_type',
  message: 'message',
  status: 'status',
  created_at: 'created_at'
};

exports.Prisma.Import_requestsScalarFieldEnum = {
  id: 'id',
  import_service_id: 'import_service_id',
  client_name: 'client_name',
  client_email: 'client_email',
  client_phone: 'client_phone',
  client_whatsapp: 'client_whatsapp',
  origin_country: 'origin_country',
  destination_country: 'destination_country',
  transit_port: 'transit_port',
  cargo_type: 'cargo_type',
  container_size: 'container_size',
  incoterm: 'incoterm',
  cargo_description: 'cargo_description',
  commodity_type: 'commodity_type',
  estimated_weight: 'estimated_weight',
  status: 'status',
  admin_notes: 'admin_notes',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Import_servicesScalarFieldEnum = {
  id: 'id',
  service_name_fr: 'service_name_fr',
  service_name_en: 'service_name_en',
  slug: 'slug',
  description_fr: 'description_fr',
  description_en: 'description_en',
  steps_fr: 'steps_fr',
  steps_en: 'steps_en',
  countries_served: 'countries_served',
  base_price: 'base_price',
  currency: 'currency',
  icon: 'icon',
  is_active: 'is_active',
  order_index: 'order_index',
  created_at: 'created_at'
};

exports.Prisma.PagesScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  title_fr: 'title_fr',
  title_en: 'title_en',
  content_fr: 'content_fr',
  content_en: 'content_en',
  meta_description_fr: 'meta_description_fr',
  meta_description_en: 'meta_description_en',
  featured_image: 'featured_image',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Payment_requestsScalarFieldEnum = {
  id: 'id',
  payment_service_id: 'payment_service_id',
  client_name: 'client_name',
  client_phone: 'client_phone',
  client_whatsapp: 'client_whatsapp',
  sender_name: 'sender_name',
  sender_address: 'sender_address',
  receiver_name: 'receiver_name',
  receiver_id_number: 'receiver_id_number',
  receiver_phone: 'receiver_phone',
  receiver_address: 'receiver_address',
  receiver_photo: 'receiver_photo',
  payment_method: 'payment_method',
  bank_slip_proof: 'bank_slip_proof',
  transfer_fee_percentage: 'transfer_fee_percentage',
  transfer_fee_amount: 'transfer_fee_amount',
  total_to_pay: 'total_to_pay',
  amount_to_receive: 'amount_to_receive',
  operator: 'operator',
  amount: 'amount',
  currency: 'currency',
  verification_code: 'verification_code',
  transaction_type: 'transaction_type',
  status: 'status',
  payment_verification_status: 'payment_verification_status',
  payout_status: 'payout_status',
  code_verified_at: 'code_verified_at',
  verified_by_admin: 'verified_by_admin',
  admin_notes: 'admin_notes',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Payment_servicesScalarFieldEnum = {
  id: 'id',
  operator_name: 'operator_name',
  operator_logo: 'operator_logo',
  description_fr: 'description_fr',
  description_en: 'description_en',
  limits_info_fr: 'limits_info_fr',
  limits_info_en: 'limits_info_en',
  guide_content_fr: 'guide_content_fr',
  guide_content_en: 'guide_content_en',
  daily_limit: 'daily_limit',
  monthly_limit: 'monthly_limit',
  exchange_rate: 'exchange_rate',
  currency_pair: 'currency_pair',
  is_active: 'is_active',
  order_index: 'order_index',
  created_at: 'created_at'
};

exports.Prisma.Site_contentScalarFieldEnum = {
  id: 'id',
  content_key: 'content_key',
  content_value: 'content_value',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Site_settingsScalarFieldEnum = {
  id: 'id',
  setting_key: 'setting_key',
  setting_value: 'setting_value',
  setting_group: 'setting_group',
  setting_type: 'setting_type',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.System_statusScalarFieldEnum = {
  id: 'id',
  maintenance_mode: 'maintenance_mode',
  frozen_modules: 'frozen_modules',
  updated_at: 'updated_at'
};

exports.Prisma.Vehicle_imagesScalarFieldEnum = {
  id: 'id',
  vehicle_id: 'vehicle_id',
  image_url: 'image_url',
  alt_text: 'alt_text',
  order_index: 'order_index'
};

exports.Prisma.Vehicle_requestsScalarFieldEnum = {
  id: 'id',
  vehicle_id: 'vehicle_id',
  client_name: 'client_name',
  client_email: 'client_email',
  client_phone: 'client_phone',
  client_whatsapp: 'client_whatsapp',
  message: 'message',
  status: 'status',
  admin_notes: 'admin_notes',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.VehiclesScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  brand: 'brand',
  model: 'model',
  year: 'year',
  transmission: 'transmission',
  fuel_type: 'fuel_type',
  price: 'price',
  status: 'status',
  currency: 'currency',
  vehicle_condition: 'vehicle_condition',
  description_fr: 'description_fr',
  description_en: 'description_en',
  main_image: 'main_image',
  mileage: 'mileage',
  color: 'color',
  engine_size: 'engine_size',
  doors: 'doors',
  seats: 'seats',
  is_featured: 'is_featured',
  is_active: 'is_active',
  order_index: 'order_index',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Visa_assistance_docsScalarFieldEnum = {
  id: 'id',
  request_id: 'request_id',
  file_name: 'file_name',
  file_path: 'file_path',
  file_type: 'file_type',
  file_size: 'file_size',
  uploaded_at: 'uploaded_at'
};

exports.Prisma.Visa_assistance_logsScalarFieldEnum = {
  id: 'id',
  request_id: 'request_id',
  admin_id: 'admin_id',
  action_type: 'action_type',
  action_description: 'action_description',
  created_at: 'created_at'
};

exports.Prisma.Visa_assistance_requestsScalarFieldEnum = {
  id: 'id',
  full_name: 'full_name',
  email: 'email',
  phone: 'phone',
  whatsapp: 'whatsapp',
  origin_country: 'origin_country',
  destination_country: 'destination_country',
  visa_type: 'visa_type',
  travel_purpose: 'travel_purpose',
  departure_date: 'departure_date',
  duration_stay: 'duration_stay',
  status: 'status',
  assigned_agent_id: 'assigned_agent_id',
  admin_notes: 'admin_notes',
  checklist_status: 'checklist_status',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Visa_assistance_settingsScalarFieldEnum = {
  id: 'id',
  setting_key: 'setting_key',
  setting_value: 'setting_value',
  description: 'description',
  updated_at: 'updated_at'
};

exports.Prisma.Visa_requestsScalarFieldEnum = {
  id: 'id',
  visa_service_id: 'visa_service_id',
  client_name: 'client_name',
  client_email: 'client_email',
  client_phone: 'client_phone',
  client_whatsapp: 'client_whatsapp',
  destination_country: 'destination_country',
  visa_type: 'visa_type',
  travel_date: 'travel_date',
  additional_info: 'additional_info',
  status: 'status',
  admin_notes: 'admin_notes',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Visa_servicesScalarFieldEnum = {
  id: 'id',
  country_code: 'country_code',
  country_name_fr: 'country_name_fr',
  country_name_en: 'country_name_en',
  flag_icon: 'flag_icon',
  requirements_fr: 'requirements_fr',
  requirements_en: 'requirements_en',
  documents_needed_fr: 'documents_needed_fr',
  documents_needed_en: 'documents_needed_en',
  processing_time: 'processing_time',
  service_fee: 'service_fee',
  currency: 'currency',
  is_active: 'is_active',
  order_index: 'order_index',
  created_at: 'created_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.admin_users_role = exports.$Enums.admin_users_role = {
  creator: 'creator',
  super_admin: 'super_admin',
  admin: 'admin'
};

exports.contact_submissions_status = exports.$Enums.contact_submissions_status = {
  new: 'new',
  read: 'read',
  replied: 'replied'
};

exports.import_requests_transit_port = exports.$Enums.import_requests_transit_port = {
  Mombasa: 'Mombasa',
  Dar_es_Salaam: 'Dar_es_Salaam',
  Other: 'Other'
};

exports.import_requests_container_size = exports.$Enums.import_requests_container_size = {
  ft_20: 'ft_20',
  ft_40: 'ft_40',
  LCL_Groupage: 'LCL_Groupage'
};

exports.import_requests_incoterm = exports.$Enums.import_requests_incoterm = {
  EXW: 'EXW',
  FOB: 'FOB',
  CIF: 'CIF',
  DAP: 'DAP'
};

exports.import_requests_status = exports.$Enums.import_requests_status = {
  new: 'new',
  quote_sent: 'quote_sent',
  docs_pending: 'docs_pending',
  in_transit: 'in_transit',
  completed: 'completed',
  cancelled: 'cancelled'
};

exports.payment_requests_payment_method = exports.$Enums.payment_requests_payment_method = {
  cash: 'cash',
  bank: 'bank'
};

exports.payment_requests_transaction_type = exports.$Enums.payment_requests_transaction_type = {
  send: 'send',
  receive: 'receive',
  exchange: 'exchange'
};

exports.payment_requests_status = exports.$Enums.payment_requests_status = {
  new: 'new',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled'
};

exports.payment_requests_payment_verification_status = exports.$Enums.payment_requests_payment_verification_status = {
  pending: 'pending',
  verified: 'verified'
};

exports.payment_requests_payout_status = exports.$Enums.payment_requests_payout_status = {
  Pending: 'Pending',
  Ready: 'Ready',
  Paid: 'Paid',
  Cancelled: 'Cancelled'
};

exports.site_settings_setting_type = exports.$Enums.site_settings_setting_type = {
  text: 'text',
  textarea: 'textarea',
  image: 'image',
  boolean: 'boolean',
  json: 'json'
};

exports.vehicle_requests_status = exports.$Enums.vehicle_requests_status = {
  new: 'new',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled'
};

exports.vehicles_transmission = exports.$Enums.vehicles_transmission = {
  automatic: 'automatic',
  manual: 'manual'
};

exports.vehicles_fuel_type = exports.$Enums.vehicles_fuel_type = {
  petrol: 'petrol',
  diesel: 'diesel',
  hybrid: 'hybrid',
  electric: 'electric'
};

exports.vehicles_status = exports.$Enums.vehicles_status = {
  available: 'available',
  negotiating: 'negotiating',
  sold: 'sold'
};

exports.vehicles_vehicle_condition = exports.$Enums.vehicles_vehicle_condition = {
  new: 'new',
  used: 'used',
  certified: 'certified'
};

exports.visa_assistance_requests_visa_type = exports.$Enums.visa_assistance_requests_visa_type = {
  tourist: 'tourist',
  business: 'business',
  student: 'student',
  work: 'work',
  medical: 'medical',
  transit: 'transit'
};

exports.visa_assistance_requests_status = exports.$Enums.visa_assistance_requests_status = {
  received: 'received',
  analyzing: 'analyzing',
  docs_incomplete: 'docs_incomplete',
  docs_complete: 'docs_complete',
  submitted: 'submitted',
  pending_response: 'pending_response',
  accepted: 'accepted',
  rejected: 'rejected',
  closed: 'closed'
};

exports.visa_requests_status = exports.$Enums.visa_requests_status = {
  new: 'new',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled'
};

exports.Prisma.ModelName = {
  about_content: 'about_content',
  about_section: 'about_section',
  hero_slides: 'hero_slides',
  activity_logs: 'activity_logs',
  admin_users: 'admin_users',
  contact_submissions: 'contact_submissions',
  import_requests: 'import_requests',
  import_services: 'import_services',
  pages: 'pages',
  payment_requests: 'payment_requests',
  payment_services: 'payment_services',
  site_content: 'site_content',
  site_settings: 'site_settings',
  system_status: 'system_status',
  vehicle_images: 'vehicle_images',
  vehicle_requests: 'vehicle_requests',
  vehicles: 'vehicles',
  visa_assistance_docs: 'visa_assistance_docs',
  visa_assistance_logs: 'visa_assistance_logs',
  visa_assistance_requests: 'visa_assistance_requests',
  visa_assistance_settings: 'visa_assistance_settings',
  visa_requests: 'visa_requests',
  visa_services: 'visa_services'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/home/nzimapp/Documents/SULOC_2/server/src/generated-prisma-client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "debian-openssl-3.0.x",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "debian-openssl-1.1.x"
      },
      {
        "fromEnvVar": null,
        "value": "rhel-openssl-1.0.x"
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "/home/nzimapp/Documents/SULOC_2/server/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../.env"
  },
  "relativePath": "../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider      = \"prisma-client-js\"\n  output        = \"../src/generated-prisma-client\"\n  binaryTargets = [\"native\", \"debian-openssl-1.1.x\", \"rhel-openssl-1.0.x\"]\n}\n\ndatasource db {\n  provider  = \"postgresql\"\n  url       = env(\"DATABASE_URL\")\n  directUrl = env(\"DIRECT_URL\")\n}\n\nmodel about_content {\n  id            Int     @id @default(autoincrement())\n  section_key   String  @unique(map: \"section_key\") @db.VarChar(255)\n  section_value String? @db.Text\n}\n\nmodel about_section {\n  id         Int       @id @default(autoincrement())\n  title_fr   String    @db.VarChar(255)\n  title_en   String?   @db.VarChar(255)\n  content_fr String    @db.Text\n  content_en String?   @db.Text\n  image_url  String?   @db.VarChar(500)\n  mission_fr String?   @db.Text\n  mission_en String?   @db.Text\n  vision_fr  String?   @db.Text\n  vision_en  String?   @db.Text\n  values_fr  String?   @db.Text\n  values_en  String?   @db.Text\n  updated_at DateTime? @default(now()) @db.Timestamp(0)\n}\n\nmodel hero_slides {\n  id              Int       @id @default(autoincrement())\n  title_fr        String    @db.VarChar(255)\n  title_en        String?   @db.VarChar(255)\n  subtitle_fr     String?   @db.Text\n  subtitle_en     String?   @db.Text\n  description_fr  String?   @db.Text\n  description_en  String?   @db.Text\n  image_url       String    @db.VarChar(500)\n  learn_more_link String?   @db.VarChar(500)\n  whatsapp_number String?   @db.VarChar(50)\n  cta_text_fr     String?   @default(\"En savoir plus\") @db.VarChar(100)\n  cta_text_en     String?   @default(\"Learn more\") @db.VarChar(100)\n  order_index     Int       @default(0)\n  is_active       Boolean   @default(true)\n  created_at      DateTime? @default(now()) @db.Timestamp(0)\n  updated_at      DateTime? @db.Timestamp(0)\n}\n\nmodel activity_logs {\n  id          Int          @id @default(autoincrement())\n  user_id     Int?\n  action_type String       @db.VarChar(50)\n  details     String?      @db.Text\n  ip_address  String?      @db.VarChar(45)\n  created_at  DateTime?    @default(now()) @db.Timestamp(0)\n  admin_users admin_users? @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: Restrict, map: \"activity_logs_ibfk_1\")\n\n  @@index([user_id], map: \"user_id\")\n}\n\nmodel admin_users {\n  id                       Int                        @id @default(autoincrement())\n  username                 String                     @unique(map: \"username\") @db.VarChar(50)\n  password_hash            String                     @db.VarChar(255)\n  full_name                String?                    @db.VarChar(100)\n  email                    String?                    @db.VarChar(100)\n  role                     admin_users_role           @default(admin)\n  is_active                Boolean?                   @default(true)\n  last_login               DateTime?                  @db.Timestamp(0)\n  created_at               DateTime?                  @default(now()) @db.Timestamp(0)\n  is_blocked               Boolean                    @default(false)\n  permissions              String?                    @db.Text\n  activity_logs            activity_logs[]\n  payment_requests         payment_requests[]\n  visa_assistance_logs     visa_assistance_logs[]\n  visa_assistance_requests visa_assistance_requests[]\n}\n\nmodel contact_submissions {\n  id           Int                         @id @default(autoincrement())\n  name         String                      @db.VarChar(255)\n  email        String                      @db.VarChar(255)\n  phone        String                      @db.VarChar(50)\n  service_type String?                     @db.VarChar(100)\n  message      String                      @db.Text\n  status       contact_submissions_status? @default(new)\n  created_at   DateTime?                   @default(now()) @db.Timestamp(0)\n}\n\nmodel import_requests {\n  id                  Int                             @id @default(autoincrement())\n  import_service_id   Int?\n  client_name         String                          @db.VarChar(100)\n  client_email        String?                         @db.VarChar(100)\n  client_phone        String                          @db.VarChar(50)\n  client_whatsapp     String?                         @db.VarChar(50)\n  origin_country      String?                         @db.VarChar(100)\n  destination_country String?                         @db.VarChar(100)\n  transit_port        import_requests_transit_port?\n  cargo_type          String?                         @db.VarChar(100)\n  container_size      import_requests_container_size?\n  incoterm            import_requests_incoterm?\n  cargo_description   String?                         @db.Text\n  commodity_type      String?                         @db.Text\n  estimated_weight    Decimal?                        @db.Decimal(10, 2)\n  status              import_requests_status?         @default(new)\n  admin_notes         String?                         @db.Text\n  created_at          DateTime?                       @default(now()) @db.Timestamp(0)\n  updated_at          DateTime?                       @db.Timestamp(0)\n  import_services     import_services?                @relation(fields: [import_service_id], references: [id], onUpdate: Restrict, map: \"import_requests_ibfk_1\")\n\n  @@index([import_service_id], map: \"import_service_id\")\n}\n\nmodel import_services {\n  id               Int               @id @default(autoincrement())\n  service_name_fr  String            @db.VarChar(200)\n  service_name_en  String?           @db.VarChar(200)\n  slug             String?           @unique @db.VarChar(255)\n  description_fr   String?           @db.Text\n  description_en   String?           @db.Text\n  steps_fr         String?           @db.Text\n  steps_en         String?           @db.Text\n  countries_served String?           @db.Text\n  base_price       Decimal?          @db.Decimal(10, 2)\n  currency         String?           @default(\"USD\") @db.VarChar(10)\n  icon             String?           @default(\"fas fa-ship\") @db.VarChar(50)\n  is_active        Boolean?          @default(true)\n  order_index      Int?              @default(0)\n  created_at       DateTime?         @default(now()) @db.Timestamp(0)\n  import_requests  import_requests[]\n}\n\nmodel pages {\n  id                  Int       @id @default(autoincrement())\n  slug                String    @unique @db.VarChar(100)\n  title_fr            String    @db.VarChar(255)\n  title_en            String?   @db.VarChar(255)\n  content_fr          String?   @db.Text\n  content_en          String?   @db.Text\n  meta_description_fr String?   @db.VarChar(500)\n  meta_description_en String?   @db.VarChar(500)\n  featured_image      String?   @db.VarChar(500)\n  is_active           Boolean?  @default(true)\n  created_at          DateTime? @default(now()) @db.Timestamp(0)\n  updated_at          DateTime? @db.Timestamp(0)\n}\n\nmodel payment_requests {\n  id                          Int                                           @id @default(autoincrement())\n  payment_service_id          Int?\n  client_name                 String                                        @db.VarChar(100)\n  client_phone                String                                        @db.VarChar(50)\n  client_whatsapp             String?                                       @db.VarChar(50)\n  sender_name                 String?                                       @db.VarChar(255)\n  sender_address              String?                                       @db.Text\n  receiver_name               String?                                       @db.VarChar(255)\n  receiver_id_number          String?                                       @db.VarChar(100)\n  receiver_phone              String?                                       @db.VarChar(50)\n  receiver_address            String?                                       @db.Text\n  receiver_photo              String?                                       @db.VarChar(500)\n  payment_method              payment_requests_payment_method?              @default(cash)\n  bank_slip_proof             String?                                       @db.VarChar(500)\n  transfer_fee_percentage     Decimal?                                      @db.Decimal(5, 2)\n  transfer_fee_amount         Decimal?                                      @db.Decimal(15, 2)\n  total_to_pay                Decimal?                                      @db.Decimal(15, 2)\n  amount_to_receive           Decimal?                                      @db.Decimal(15, 2)\n  operator                    String?                                       @db.VarChar(100)\n  amount                      Decimal?                                      @db.Decimal(15, 2)\n  currency                    String?                                       @db.VarChar(10)\n  verification_code           String?                                       @unique(map: \"verification_code\") @db.VarChar(12)\n  transaction_type            payment_requests_transaction_type?            @default(send)\n  status                      payment_requests_status?                      @default(new)\n  payment_verification_status payment_requests_payment_verification_status? @default(verified)\n  payout_status               payment_requests_payout_status?               @default(Pending)\n  code_verified_at            DateTime?                                     @db.Timestamp(0)\n  verified_by_admin           Int?\n  admin_notes                 String?                                       @db.Text\n  created_at                  DateTime?                                     @default(now()) @db.Timestamp(0)\n  updated_at                  DateTime?                                     @db.Timestamp(0)\n  admin_users                 admin_users?                                  @relation(fields: [verified_by_admin], references: [id], onUpdate: Restrict, map: \"fk_rel_verified_by_admin\")\n  payment_services            payment_services?                             @relation(fields: [payment_service_id], references: [id], onUpdate: Restrict, map: \"payment_requests_ibfk_1\")\n\n  @@index([verified_by_admin], map: \"fk_verified_by_admin\")\n  @@index([receiver_id_number], map: \"idx_receiver_id\")\n  @@index([receiver_name], map: \"idx_receiver_name\")\n  @@index([receiver_phone], map: \"idx_receiver_phone\")\n  @@index([sender_name], map: \"idx_sender_name\")\n  @@index([payment_service_id], map: \"payment_service_id\")\n  @@index([verification_code], map: \"verification_code_2\")\n}\n\nmodel payment_services {\n  id               Int                @id @default(autoincrement())\n  operator_name    String             @db.VarChar(100)\n  operator_logo    String?            @db.VarChar(500)\n  description_fr   String?            @db.Text\n  description_en   String?            @db.Text\n  limits_info_fr   String?            @db.Text\n  limits_info_en   String?            @db.Text\n  guide_content_fr String?            @db.Text\n  guide_content_en String?            @db.Text\n  daily_limit      Decimal?           @db.Decimal(15, 2)\n  monthly_limit    Decimal?           @db.Decimal(15, 2)\n  exchange_rate    Decimal?           @db.Decimal(10, 4)\n  currency_pair    String?            @db.VarChar(20)\n  is_active        Boolean?           @default(true)\n  order_index      Int?               @default(0)\n  created_at       DateTime?          @default(now()) @db.Timestamp(0)\n  payment_requests payment_requests[]\n}\n\nmodel site_content {\n  id            Int       @id @default(autoincrement())\n  content_key   String    @unique(map: \"content_key\") @db.VarChar(255)\n  content_value String?   @db.Text\n  created_at    DateTime? @default(now()) @db.Timestamp(0)\n  updated_at    DateTime? @default(now()) @db.Timestamp(0)\n}\n\nmodel site_settings {\n  id            Int                         @id @default(autoincrement())\n  setting_key   String                      @unique(map: \"setting_key\") @db.VarChar(100)\n  setting_value String?                     @db.Text\n  setting_group String?                     @default(\"general\") @db.VarChar(50)\n  setting_type  site_settings_setting_type? @default(text)\n  created_at    DateTime?                   @default(now()) @db.Timestamp(0)\n  updated_at    DateTime?                   @db.Timestamp(0)\n}\n\nmodel system_status {\n  id               Int       @id @default(1)\n  maintenance_mode Boolean?  @default(false)\n  frozen_modules   String?   @db.Text\n  updated_at       DateTime? @default(now()) @db.Timestamp(0)\n}\n\nmodel vehicle_images {\n  id          Int      @id @default(autoincrement())\n  vehicle_id  Int\n  image_url   String   @db.VarChar(500)\n  alt_text    String?  @db.VarChar(255)\n  order_index Int?     @default(0)\n  vehicles    vehicles @relation(fields: [vehicle_id], references: [id], onDelete: Cascade, onUpdate: Restrict, map: \"vehicle_images_ibfk_1\")\n\n  @@index([vehicle_id], map: \"vehicle_images_vehicle_id_idx\")\n}\n\nmodel vehicle_requests {\n  id              Int                      @id @default(autoincrement())\n  vehicle_id      Int?\n  client_name     String                   @db.VarChar(100)\n  client_email    String?                  @db.VarChar(100)\n  client_phone    String                   @db.VarChar(50)\n  client_whatsapp String?                  @db.VarChar(50)\n  message         String?                  @db.Text\n  status          vehicle_requests_status? @default(new)\n  admin_notes     String?                  @db.Text\n  created_at      DateTime?                @default(now()) @db.Timestamp(0)\n  updated_at      DateTime?                @db.Timestamp(0)\n  vehicles        vehicles?                @relation(fields: [vehicle_id], references: [id], onUpdate: Restrict, map: \"vehicle_requests_ibfk_1\")\n\n  @@index([vehicle_id], map: \"vehicle_requests_vehicle_id_idx\")\n}\n\nmodel vehicles {\n  id                Int                         @id @default(autoincrement())\n  slug              String                      @unique @db.VarChar(255)\n  brand             String                      @db.VarChar(100)\n  model             String                      @db.VarChar(100)\n  year              Int?\n  transmission      vehicles_transmission?      @default(automatic)\n  fuel_type         vehicles_fuel_type?         @default(petrol)\n  price             Decimal?                    @db.Decimal(15, 2)\n  status            vehicles_status             @default(available)\n  currency          String?                     @default(\"USD\") @db.VarChar(10)\n  vehicle_condition vehicles_vehicle_condition? @default(used)\n  description_fr    String?                     @db.Text\n  description_en    String?                     @db.Text\n  main_image        String?                     @db.VarChar(500)\n  mileage           Int?\n  color             String?                     @db.VarChar(50)\n  engine_size       String?                     @db.VarChar(20)\n  doors             Int?                        @default(4)\n  seats             Int?                        @default(5)\n  is_featured       Boolean?                    @default(false)\n  is_active         Boolean?                    @default(true)\n  order_index       Int?                        @default(0)\n  created_at        DateTime?                   @default(now()) @db.Timestamp(0)\n  updated_at        DateTime?                   @db.Timestamp(0)\n  vehicle_images    vehicle_images[]\n  vehicle_requests  vehicle_requests[]\n\n  @@index([price], map: \"idx_price\")\n  @@index([status], map: \"idx_status\")\n  @@index([year], map: \"idx_year\")\n}\n\nmodel visa_assistance_docs {\n  id                       Int                      @id @default(autoincrement())\n  request_id               Int\n  file_name                String                   @db.VarChar(255)\n  file_path                String                   @db.VarChar(500)\n  file_type                String?                  @db.VarChar(50)\n  file_size                Int?\n  uploaded_at              DateTime?                @default(now()) @db.Timestamp(0)\n  visa_assistance_requests visa_assistance_requests @relation(fields: [request_id], references: [id], onDelete: Cascade, onUpdate: Restrict, map: \"visa_assistance_docs_ibfk_1\")\n\n  @@index([request_id], map: \"visa_assistance_docs_request_id_idx\")\n}\n\nmodel visa_assistance_logs {\n  id                       Int                      @id @default(autoincrement())\n  request_id               Int\n  admin_id                 Int?\n  action_type              String                   @db.VarChar(50)\n  action_description       String?                  @db.Text\n  created_at               DateTime?                @default(now()) @db.Timestamp(0)\n  visa_assistance_requests visa_assistance_requests @relation(fields: [request_id], references: [id], onDelete: Cascade, onUpdate: Restrict, map: \"visa_assistance_logs_ibfk_1\")\n  admin_users              admin_users?             @relation(fields: [admin_id], references: [id], onUpdate: Restrict, map: \"visa_assistance_logs_ibfk_2\")\n\n  @@index([admin_id], map: \"admin_id\")\n  @@index([request_id], map: \"visa_assistance_logs_request_id_idx\")\n}\n\nmodel visa_assistance_requests {\n  id                   Int                                @id @default(autoincrement())\n  full_name            String                             @db.VarChar(100)\n  email                String                             @db.VarChar(100)\n  phone                String                             @db.VarChar(50)\n  whatsapp             String?                            @db.VarChar(50)\n  origin_country       String                             @db.VarChar(100)\n  destination_country  String                             @db.VarChar(100)\n  visa_type            visa_assistance_requests_visa_type\n  travel_purpose       String?                            @db.Text\n  departure_date       DateTime?                          @db.Date\n  duration_stay        String?                            @db.VarChar(50)\n  status               visa_assistance_requests_status?   @default(received)\n  assigned_agent_id    Int?\n  admin_notes          String?                            @db.Text\n  checklist_status     String?                            @db.Text\n  created_at           DateTime?                          @default(now()) @db.Timestamp(0)\n  updated_at           DateTime?                          @db.Timestamp(0)\n  visa_assistance_docs visa_assistance_docs[]\n  visa_assistance_logs visa_assistance_logs[]\n  admin_users          admin_users?                       @relation(fields: [assigned_agent_id], references: [id], onUpdate: Restrict, map: \"visa_assistance_requests_ibfk_1\")\n\n  @@index([assigned_agent_id], map: \"assigned_agent_id\")\n}\n\nmodel visa_assistance_settings {\n  id            Int       @id @default(autoincrement())\n  setting_key   String    @unique(map: \"visa_assistance_settings_key_idx\") @db.VarChar(100)\n  setting_value String?   @db.Text\n  description   String?   @db.VarChar(255)\n  updated_at    DateTime? @db.Timestamp(0)\n}\n\nmodel visa_requests {\n  id                  Int                   @id @default(autoincrement())\n  visa_service_id     Int?\n  client_name         String                @db.VarChar(100)\n  client_email        String?               @db.VarChar(100)\n  client_phone        String                @db.VarChar(50)\n  client_whatsapp     String?               @db.VarChar(50)\n  destination_country String?               @db.VarChar(100)\n  visa_type           String?               @db.VarChar(100)\n  travel_date         DateTime?             @db.Date\n  additional_info     String?               @db.Text\n  status              visa_requests_status? @default(new)\n  admin_notes         String?               @db.Text\n  created_at          DateTime?             @default(now()) @db.Timestamp(0)\n  updated_at          DateTime?             @db.Timestamp(0)\n  visa_services       visa_services?        @relation(fields: [visa_service_id], references: [id], onUpdate: Restrict, map: \"visa_requests_ibfk_1\")\n\n  @@index([visa_service_id], map: \"visa_requests_visa_service_id_idx\")\n}\n\nmodel visa_services {\n  id                  Int             @id @default(autoincrement())\n  country_code        String          @db.VarChar(3)\n  country_name_fr     String          @db.VarChar(100)\n  country_name_en     String?         @db.VarChar(100)\n  flag_icon           String?         @db.VarChar(100)\n  requirements_fr     String?         @db.Text\n  requirements_en     String?         @db.Text\n  documents_needed_fr String?         @db.Text\n  documents_needed_en String?         @db.Text\n  processing_time     String?         @db.VarChar(50)\n  service_fee         Decimal?        @db.Decimal(10, 2)\n  currency            String?         @default(\"USD\") @db.VarChar(10)\n  is_active           Boolean?        @default(true)\n  order_index         Int?            @default(0)\n  created_at          DateTime?       @default(now()) @db.Timestamp(0)\n  visa_requests       visa_requests[]\n}\n\nenum site_settings_setting_type {\n  text\n  textarea\n  image\n  boolean\n  json\n}\n\nenum vehicles_transmission {\n  automatic\n  manual\n}\n\nenum admin_users_role {\n  creator\n  super_admin\n  admin\n}\n\nenum vehicles_fuel_type {\n  petrol\n  diesel\n  hybrid\n  electric\n}\n\nenum contact_submissions_status {\n  new\n  read\n  replied\n}\n\nenum vehicle_requests_status {\n  new\n  in_progress\n  completed\n  cancelled\n}\n\nenum visa_assistance_requests_visa_type {\n  tourist\n  business\n  student\n  work\n  medical\n  transit\n}\n\nenum vehicles_status {\n  available\n  negotiating\n  sold\n}\n\nenum import_requests_transit_port {\n  Mombasa\n  Dar_es_Salaam @map(\"Dar es Salaam\")\n  Other\n}\n\nenum vehicles_vehicle_condition {\n  new\n  used\n  certified\n}\n\nenum import_requests_container_size {\n  ft_20        @map(\"20ft\")\n  ft_40        @map(\"40ft\")\n  LCL_Groupage @map(\"LCL/Groupage\")\n}\n\nenum visa_requests_status {\n  new\n  in_progress\n  completed\n  cancelled\n}\n\nenum import_requests_incoterm {\n  EXW\n  FOB\n  CIF\n  DAP\n}\n\nenum visa_assistance_requests_status {\n  received\n  analyzing\n  docs_incomplete\n  docs_complete\n  submitted\n  pending_response\n  accepted\n  rejected\n  closed\n}\n\nenum payment_requests_payment_method {\n  cash\n  bank\n}\n\nenum import_requests_status {\n  new\n  quote_sent\n  docs_pending\n  in_transit\n  completed\n  cancelled\n}\n\nenum payment_requests_transaction_type {\n  send\n  receive\n  exchange\n}\n\nenum payment_requests_status {\n  new\n  in_progress\n  completed\n  cancelled\n}\n\nenum payment_requests_payment_verification_status {\n  pending\n  verified\n}\n\nenum payment_requests_payout_status {\n  Pending\n  Ready\n  Paid\n  Cancelled\n}\n",
  "inlineSchemaHash": "941bef7fa36a32b5db1acb903b1696be42af0c6f9349746e3a1aad932c1bf0d1",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "src/generated-prisma-client",
    "generated-prisma-client",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"about_content\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"section_key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"section_value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"about_section\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"image_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mission_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mission_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vision_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vision_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"values_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"values_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"hero_slides\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subtitle_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subtitle_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"image_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"learn_more_link\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"whatsapp_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cta_text_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"En savoir plus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cta_text_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"Learn more\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order_index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"activity_logs\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"details\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ip_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"admin_users\",\"relationName\":\"activity_logsToadmin_users\",\"relationFromFields\":[\"user_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"admin_users\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"full_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"admin_users_role\",\"default\":\"admin\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"last_login\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_blocked\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"permissions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activity_logs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"activity_logs\",\"relationName\":\"activity_logsToadmin_users\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payment_requests\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"payment_requests\",\"relationName\":\"admin_usersTopayment_requests\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_assistance_logs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"visa_assistance_logs\",\"relationName\":\"admin_usersTovisa_assistance_logs\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_assistance_requests\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"visa_assistance_requests\",\"relationName\":\"admin_usersTovisa_assistance_requests\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"contact_submissions\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"contact_submissions_status\",\"default\":\"new\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"import_requests\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"import_service_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_whatsapp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"origin_country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"destination_country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transit_port\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"import_requests_transit_port\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cargo_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"container_size\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"import_requests_container_size\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"incoterm\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"import_requests_incoterm\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cargo_description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"commodity_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estimated_weight\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"import_requests_status\",\"default\":\"new\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"import_services\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"import_services\",\"relationName\":\"import_requestsToimport_services\",\"relationFromFields\":[\"import_service_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"import_services\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service_name_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service_name_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"steps_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"steps_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"countries_served\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"base_price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"USD\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"fas fa-ship\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order_index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"import_requests\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"import_requests\",\"relationName\":\"import_requestsToimport_services\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"pages\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meta_description_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"meta_description_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"featured_image\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"payment_requests\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payment_service_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_whatsapp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sender_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sender_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiver_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiver_id_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiver_phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiver_address\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receiver_photo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payment_method\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"payment_requests_payment_method\",\"default\":\"cash\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bank_slip_proof\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transfer_fee_percentage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transfer_fee_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"total_to_pay\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount_to_receive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"operator\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verification_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transaction_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"payment_requests_transaction_type\",\"default\":\"send\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"payment_requests_status\",\"default\":\"new\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payment_verification_status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"payment_requests_payment_verification_status\",\"default\":\"verified\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payout_status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"payment_requests_payout_status\",\"default\":\"Pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"code_verified_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verified_by_admin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"admin_users\",\"relationName\":\"admin_usersTopayment_requests\",\"relationFromFields\":[\"verified_by_admin\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payment_services\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"payment_services\",\"relationName\":\"payment_requestsTopayment_services\",\"relationFromFields\":[\"payment_service_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"payment_services\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"operator_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"operator_logo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"limits_info_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"limits_info_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"guide_content_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"guide_content_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"daily_limit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"monthly_limit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"exchange_rate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency_pair\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order_index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payment_requests\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"payment_requests\",\"relationName\":\"payment_requestsTopayment_services\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"site_content\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content_key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content_value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"site_settings\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"setting_key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"setting_value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"setting_group\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"general\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"setting_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"site_settings_setting_type\",\"default\":\"text\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"system_status\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maintenance_mode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"frozen_modules\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"vehicle_images\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicle_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"image_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"alt_text\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order_index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicles\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"vehicles\",\"relationName\":\"vehicle_imagesTovehicles\",\"relationFromFields\":[\"vehicle_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"vehicle_requests\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicle_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_whatsapp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"vehicle_requests_status\",\"default\":\"new\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicles\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"vehicles\",\"relationName\":\"vehicle_requestsTovehicles\",\"relationFromFields\":[\"vehicle_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"vehicles\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brand\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"model\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"year\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transmission\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"vehicles_transmission\",\"default\":\"automatic\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fuel_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"vehicles_fuel_type\",\"default\":\"petrol\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"vehicles_status\",\"default\":\"available\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"USD\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicle_condition\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"vehicles_vehicle_condition\",\"default\":\"used\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"main_image\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mileage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"color\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"engine_size\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"doors\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":4,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"seats\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":5,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_featured\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order_index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicle_images\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"vehicle_images\",\"relationName\":\"vehicle_imagesTovehicles\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicle_requests\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"vehicle_requests\",\"relationName\":\"vehicle_requestsTovehicles\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"visa_assistance_docs\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"request_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"file_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"file_path\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"file_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"file_size\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uploaded_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_assistance_requests\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"visa_assistance_requests\",\"relationName\":\"visa_assistance_docsTovisa_assistance_requests\",\"relationFromFields\":[\"request_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"visa_assistance_logs\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"request_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action_description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_assistance_requests\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"visa_assistance_requests\",\"relationName\":\"visa_assistance_logsTovisa_assistance_requests\",\"relationFromFields\":[\"request_id\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"admin_users\",\"relationName\":\"admin_usersTovisa_assistance_logs\",\"relationFromFields\":[\"admin_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"visa_assistance_requests\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"full_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"whatsapp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"origin_country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"destination_country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"visa_assistance_requests_visa_type\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"travel_purpose\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"departure_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"duration_stay\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"visa_assistance_requests_status\",\"default\":\"received\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assigned_agent_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"checklist_status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_assistance_docs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"visa_assistance_docs\",\"relationName\":\"visa_assistance_docsTovisa_assistance_requests\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_assistance_logs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"visa_assistance_logs\",\"relationName\":\"visa_assistance_logsTovisa_assistance_requests\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_users\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"admin_users\",\"relationName\":\"admin_usersTovisa_assistance_requests\",\"relationFromFields\":[\"assigned_agent_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"visa_assistance_settings\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"setting_key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"setting_value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"visa_requests\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_service_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"client_whatsapp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"destination_country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"travel_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"additional_info\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"visa_requests_status\",\"default\":\"new\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin_notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_services\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"visa_services\",\"relationName\":\"visa_requestsTovisa_services\",\"relationFromFields\":[\"visa_service_id\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"visa_services\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country_name_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country_name_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"flag_icon\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requirements_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requirements_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documents_needed_fr\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documents_needed_en\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processing_time\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service_fee\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"USD\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"is_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order_index\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visa_requests\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"visa_requests\",\"relationName\":\"visa_requestsTovisa_services\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"site_settings_setting_type\":{\"values\":[{\"name\":\"text\",\"dbName\":null},{\"name\":\"textarea\",\"dbName\":null},{\"name\":\"image\",\"dbName\":null},{\"name\":\"boolean\",\"dbName\":null},{\"name\":\"json\",\"dbName\":null}],\"dbName\":null},\"vehicles_transmission\":{\"values\":[{\"name\":\"automatic\",\"dbName\":null},{\"name\":\"manual\",\"dbName\":null}],\"dbName\":null},\"admin_users_role\":{\"values\":[{\"name\":\"creator\",\"dbName\":null},{\"name\":\"super_admin\",\"dbName\":null},{\"name\":\"admin\",\"dbName\":null}],\"dbName\":null},\"vehicles_fuel_type\":{\"values\":[{\"name\":\"petrol\",\"dbName\":null},{\"name\":\"diesel\",\"dbName\":null},{\"name\":\"hybrid\",\"dbName\":null},{\"name\":\"electric\",\"dbName\":null}],\"dbName\":null},\"contact_submissions_status\":{\"values\":[{\"name\":\"new\",\"dbName\":null},{\"name\":\"read\",\"dbName\":null},{\"name\":\"replied\",\"dbName\":null}],\"dbName\":null},\"vehicle_requests_status\":{\"values\":[{\"name\":\"new\",\"dbName\":null},{\"name\":\"in_progress\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null}],\"dbName\":null},\"visa_assistance_requests_visa_type\":{\"values\":[{\"name\":\"tourist\",\"dbName\":null},{\"name\":\"business\",\"dbName\":null},{\"name\":\"student\",\"dbName\":null},{\"name\":\"work\",\"dbName\":null},{\"name\":\"medical\",\"dbName\":null},{\"name\":\"transit\",\"dbName\":null}],\"dbName\":null},\"vehicles_status\":{\"values\":[{\"name\":\"available\",\"dbName\":null},{\"name\":\"negotiating\",\"dbName\":null},{\"name\":\"sold\",\"dbName\":null}],\"dbName\":null},\"import_requests_transit_port\":{\"values\":[{\"name\":\"Mombasa\",\"dbName\":null},{\"name\":\"Dar_es_Salaam\",\"dbName\":\"Dar es Salaam\"},{\"name\":\"Other\",\"dbName\":null}],\"dbName\":null},\"vehicles_vehicle_condition\":{\"values\":[{\"name\":\"new\",\"dbName\":null},{\"name\":\"used\",\"dbName\":null},{\"name\":\"certified\",\"dbName\":null}],\"dbName\":null},\"import_requests_container_size\":{\"values\":[{\"name\":\"ft_20\",\"dbName\":\"20ft\"},{\"name\":\"ft_40\",\"dbName\":\"40ft\"},{\"name\":\"LCL_Groupage\",\"dbName\":\"LCL/Groupage\"}],\"dbName\":null},\"visa_requests_status\":{\"values\":[{\"name\":\"new\",\"dbName\":null},{\"name\":\"in_progress\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null}],\"dbName\":null},\"import_requests_incoterm\":{\"values\":[{\"name\":\"EXW\",\"dbName\":null},{\"name\":\"FOB\",\"dbName\":null},{\"name\":\"CIF\",\"dbName\":null},{\"name\":\"DAP\",\"dbName\":null}],\"dbName\":null},\"visa_assistance_requests_status\":{\"values\":[{\"name\":\"received\",\"dbName\":null},{\"name\":\"analyzing\",\"dbName\":null},{\"name\":\"docs_incomplete\",\"dbName\":null},{\"name\":\"docs_complete\",\"dbName\":null},{\"name\":\"submitted\",\"dbName\":null},{\"name\":\"pending_response\",\"dbName\":null},{\"name\":\"accepted\",\"dbName\":null},{\"name\":\"rejected\",\"dbName\":null},{\"name\":\"closed\",\"dbName\":null}],\"dbName\":null},\"payment_requests_payment_method\":{\"values\":[{\"name\":\"cash\",\"dbName\":null},{\"name\":\"bank\",\"dbName\":null}],\"dbName\":null},\"import_requests_status\":{\"values\":[{\"name\":\"new\",\"dbName\":null},{\"name\":\"quote_sent\",\"dbName\":null},{\"name\":\"docs_pending\",\"dbName\":null},{\"name\":\"in_transit\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null}],\"dbName\":null},\"payment_requests_transaction_type\":{\"values\":[{\"name\":\"send\",\"dbName\":null},{\"name\":\"receive\",\"dbName\":null},{\"name\":\"exchange\",\"dbName\":null}],\"dbName\":null},\"payment_requests_status\":{\"values\":[{\"name\":\"new\",\"dbName\":null},{\"name\":\"in_progress\",\"dbName\":null},{\"name\":\"completed\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null}],\"dbName\":null},\"payment_requests_payment_verification_status\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"verified\",\"dbName\":null}],\"dbName\":null},\"payment_requests_payout_status\":{\"values\":[{\"name\":\"Pending\",\"dbName\":null},{\"name\":\"Ready\",\"dbName\":null},{\"name\":\"Paid\",\"dbName\":null},{\"name\":\"Cancelled\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "libquery_engine-debian-openssl-3.0.x.so.node");
path.join(process.cwd(), "src/generated-prisma-client/libquery_engine-debian-openssl-3.0.x.so.node")

// file annotations for bundling tools to include these files
path.join(__dirname, "libquery_engine-debian-openssl-1.1.x.so.node");
path.join(process.cwd(), "src/generated-prisma-client/libquery_engine-debian-openssl-1.1.x.so.node")

// file annotations for bundling tools to include these files
path.join(__dirname, "libquery_engine-rhel-openssl-1.0.x.so.node");
path.join(process.cwd(), "src/generated-prisma-client/libquery_engine-rhel-openssl-1.0.x.so.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "src/generated-prisma-client/schema.prisma")
