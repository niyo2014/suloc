
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
