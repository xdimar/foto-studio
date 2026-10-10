-- =========================================================================
-- ORIGINE CREATIVE STUDIO — DATABASE SCHEMA FOR SUPABASE (POSTGRESQL)
-- 5 Roles: 'owner', 'admin', 'kasir', 'magang', 'user'
-- =========================================================================

-- 1. ENUM FOR ROLES
CREATE TYPE studio_role_type AS ENUM ('owner', 'admin', 'kasir', 'magang', 'user');
CREATE TYPE payment_status_type AS ENUM ('unpaid', 'dp_paid', 'paid', 'refunded');
CREATE TYPE booking_status_type AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- 2. USERS & STAFF TABLE
CREATE TABLE IF NOT EXISTS studio_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  passcode TEXT NOT NULL, -- Access code / PIN for staff
  password TEXT, -- For email/password login
  role studio_role_type NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'active',
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

-- 3. STUDIO ROOMS & PRICING
CREATE TABLE IF NOT EXISTS studio_rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  half_day_price NUMERIC NOT NULL,
  full_day_price NUMERIC NOT NULL,
  hourly_rate NUMERIC NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE
);

-- 4. STUDIO ADDONS & SERVICES
CREATE TABLE IF NOT EXISTS studio_addons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL DEFAULT 'service',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- 5. BOOKINGS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS studio_bookings (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT NOT NULL,
  room_id TEXT REFERENCES studio_rooms(id),
  room_name TEXT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  duration TEXT NOT NULL,
  selected_addons JSONB DEFAULT '[]'::jsonb,
  total_price NUMERIC NOT NULL,
  deposit_paid NUMERIC NOT NULL DEFAULT 0,
  payment_status payment_status_type NOT NULL DEFAULT 'unpaid',
  booking_status booking_status_type NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  handled_by TEXT
);

-- 6. GALLERY & PORTFOLIO
CREATE TABLE IF NOT EXISTS studio_gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  photographer TEXT,
  capture_date DATE DEFAULT CURRENT_DATE,
  client TEXT,
  featured BOOLEAN DEFAULT FALSE,
  aspect_ratio TEXT DEFAULT 'portrait'
);

-- 7. INITIAL SEED DATA
INSERT INTO studio_users (id, name, email, username, passcode, role, status, phone, notes)
VALUES
  ('usr-owner-01', 'Ratna Kusuma (Owner)', 'owner@originestudio.com', 'owner_ratna', 'orig8899', 'owner', 'active', '+6285196671398', 'Pemilik Utama Studio'),
  ('usr-admin-01', 'Aditya Pratama (Studio Admin)', 'admin@originestudio.com', 'admin_studio', 'admin123', 'admin', 'active', '+6281234567890', 'Administrator Operasional'),
  ('usr-kasir-01', 'Siti Rahma (Kasir Studio)', 'kasir@originestudio.com', 'kasir_belung', 'kasir77', 'kasir', 'active', '+6285233445566', 'Kasir & Pembayaran'),
  ('usr-magang-01', 'Bima Arya (Kru Magang Visual)', 'magang@originestudio.com', 'magang_visual', 'magang2026', 'magang', 'active', '+6287811223344', 'Kru Magang Studio'),
  ('usr-client-01', 'Clarissa Sutedja', 'clarissa@vogue.id', 'klien_clarissa', 'klien123', 'user', 'active', '+6281987654321', 'Klien Editorial')
ON CONFLICT (id) DO NOTHING;
