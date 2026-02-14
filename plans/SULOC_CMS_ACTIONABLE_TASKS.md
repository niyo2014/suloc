# ✅ SULOC CMS Actionable Tasks (Extracted from Plan)

This checklist converts the remaining sections of the plan into implementable tasks. Source: [`plans/SULOC_CMS_DEVELOPMENT_PLAN.md`](plans/SULOC_CMS_DEVELOPMENT_PLAN.md).

---

## 1) System Architecture → File Structure Deltas

- [ ] Compare planned file structure with current repo contents.
- [ ] Identify missing public pages (e.g., `vehicles.php`, `visa.php`, `logistics.php`, `payments.php`, `contact.php`).
- [ ] Identify missing admin modules (e.g., `admin/vehicles.php`, `admin/visa-services.php`, `admin/import-services.php`, `admin/payment-services.php`, `admin/requests/*`, `admin/pages.php`).
- [ ] Identify missing UI assets (e.g., `css/admin.css`, `css/mobile.css`, `js/filters.js`, `js/whatsapp.js`).
- [ ] Identify missing includes (e.g., `includes/whatsapp-widget.php`, `includes/language-switcher.php`, `includes/submit-handlers/*`).

---

## 2) Admin Backoffice Architecture

### Navigation & Dashboard

- [ ] Update admin navigation to match plan: Dashboard, Vehicles, Visa, Logistics, Payments, Requests, Pages, Settings.
- [ ] Define dashboard statistic cards (new requests, active vehicles, pending visa requests, monthly revenue).
- [ ] Add Quick Actions (add vehicle, view requests, WhatsApp bulk message).
- [ ] Add Recent Activity list (latest requests + quick status update, recent vehicles + edit/delete).

### Vehicle Management (Admin)

- [ ] Create add/edit vehicle form: brand, model, year, price + currency, transmission, fuel, condition, featured, active.
- [ ] Implement multi-image upload with drag & drop and reordering.
- [ ] Enforce image compression target (< 200KB) + alt text.
- [ ] Add main image selection and gallery ordering.
- [ ] Build request center inbox with status workflow.

---

## 3) Public Frontend Architecture

### Homepage Sections

- [ ] Implement hero banner with CTA + WhatsApp quick contact.
- [ ] Implement services slideshow (auto-rotate, CTA buttons, WhatsApp buttons).
- [ ] Add 4 mission cards (Visa, Logistics, Admin Consulting, Intermediary).
- [ ] Add featured vehicles carousel with “View All” link.
- [ ] Add services overview + quick links.
- [ ] Add contact form + map + WhatsApp integration.
- [ ] Add floating widgets (WhatsApp button + back-to-top).

---

## 4) Services Slideshow (HTML/CSS/JS Integration)

- [ ] Implement slideshow markup per plan: 4 slides, overlay, buttons, arrows, dots.
- [ ] Apply slideshow styles for desktop and mobile.
- [ ] Add JS class for autoplay (5s), hover pause, swipe, keyboard, dot/arrows navigation.
- [ ] Integrate WhatsApp data-message per slide.
- [ ] Ensure images are optimized (< 200KB) and lazy-load if possible.

---

## 5) Floating WhatsApp Button

- [ ] Implement floating button markup site-wide.
- [ ] Apply CSS animation + tooltip, with mobile adjustments.
- [ ] Wire click handler to open WhatsApp with default message.

---

## 6) Vehicle Catalog Features (Public)

- [ ] Advanced filters: price range, brand, transmission, fuel, year, condition.
- [ ] Sorting: price low/high, newest, most popular.
- [ ] Vehicle card UI with hover gallery, key specs, price, WhatsApp inquiry button, quick view.

---

## 7) Visa Hub Features (Public)

- [ ] Country selection grid with flag icons and search.
- [ ] Highlight popular destinations.
- [ ] Requirements display: checklist, processing time, service fee.
- [ ] Request assistance CTA (form + WhatsApp prefill).

---

## 8) Payment Services Guide (Public)

- [ ] Operator cards (Orange, MTN, Airtel, M‑Pesa).
- [ ] Display limits, exchange rates, service fees, how-to guides.

---

## 9) WhatsApp Integration

- [ ] Centralize WhatsApp config (number + FR/EN default messages).
- [ ] Add context-aware prefilled messages for vehicle/visa/services.
- [ ] Add online/offline indicator + response time (if planned).

---

## 10) Mobile-First Optimization

- [ ] Enforce image optimization on upload (resize + WebP + quality).
- [ ] Add lazy-loading for images and media.
- [ ] Inline critical CSS and defer non-critical CSS.
- [ ] Add service worker for caching/offline fallback.
- [ ] Validate performance targets: FCP <2s, TTI <4s, weight <1MB.

---

## 11) Multilingual Support (FR/EN)

- [ ] Implement language detection and switcher.
- [ ] Create `lang/fr.php` and `lang/en.php` translation maps.
- [ ] Add FR/EN fields in admin for translatable content.
- [ ] Add fallback logic (French default).

---

## 12) Security Implementation

- [ ] Enforce `password_hash()` + prepared statements across modules.
- [ ] Add CSRF tokens to all forms.
- [ ] Apply `htmlspecialchars()` on output.
- [ ] Secure sessions (HTTPOnly, Secure cookies).
- [ ] Harden file upload validation (type/size/rename).
- [ ] Force HTTPS + rate limiting.
- [ ] Add security headers in entry points.

---

## 13) Development Phases → Deliverables

- [ ] Phase 1: Structure + DB + auth + admin dashboard + branding.
- [ ] Phase 2: Vehicle CRUD + gallery + catalog + detail + inquiry.
- [ ] Phase 3: Visa/Logistics/Payments modules + request forms.
- [ ] Phase 4: Unified request center + workflow + export + notifications.
- [ ] Phase 5: Mobile optimization + WhatsApp widget + low-bandwidth testing.
- [ ] Phase 6: Multilingual + translations + admin translation UI + polish.
- [ ] Phase 7: Security audit + testing + deployment + documentation.

---

## 14) Reuse from CICESE (Current Codebase)

- [ ] Reuse DB connection: [`config/database.php`](config/database.php).
- [ ] Reuse auth flow: [`admin/login.php`](admin/login.php), update branding.
- [ ] Reuse upload handler: [`admin/upload-image.php`](admin/upload-image.php), add compression.
- [ ] Extend settings: [`admin/settings.php`](admin/settings.php), add fields.
- [ ] Extend forms JS: [`js/forms.js`](js/forms.js), add WhatsApp integration.
- [ ] Update admin header: [`admin/includes/admin-header.php`](admin/includes/admin-header.php), new nav.
