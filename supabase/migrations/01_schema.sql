-- =============================================================================
-- Artha Sales Automation — Supabase Database Schema & RLS
-- Aligned exactly with typescript types and frontend assumptions
-- =============================================================================

-- 1. Create custom ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'ceo', 'country_head', 'sales_head', 'sales_rep');
CREATE TYPE user_status AS ENUM ('active', 'invited', 'disabled');
CREATE TYPE lead_score AS ENUM ('Hot', 'Warm', 'Cold');
CREATE TYPE lead_stage AS ENUM ('NEW', 'CONTACTED', 'CURIOUS', 'ENGAGED', 'QUALIFIED', 'MEETING_BOOKED', 'CLOSED', 'DNC', 'COLD_LOGGED');
CREATE TYPE appointment_status AS ENUM ('qc_confirmed', 'ai_booked', 'meeting_scheduled');

-- 2. Create Users Table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'sales_rep'::user_role NOT NULL,
  status user_status DEFAULT 'invited'::user_status NOT NULL,
  country TEXT, -- for country_head scoping
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_login TIMESTAMPTZ
);

-- 3. Create Leads Table
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  industry TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  score lead_score DEFAULT 'Cold'::lead_score NOT NULL,
  stage lead_stage DEFAULT 'NEW'::lead_stage NOT NULL,
  opening_line TEXT,
  pain_point TEXT,
  date_added TIMESTAMPTZ DEFAULT now() NOT NULL,
  message_sent TIMESTAMPTZ,
  brief TEXT,
  last_contacted TIMESTAMPTZ,
  last_reply_at TIMESTAMPTZ,
  signals JSONB NOT NULL, -- intent_score, fit_score, etc.
  next_action TEXT,
  handoff_required BOOLEAN DEFAULT false NOT NULL,
  handoff_reason TEXT,
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Create Conversations Table
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  history TEXT NOT NULL,
  stage lead_stage DEFAULT 'NEW'::lead_stage NOT NULL,
  turn_count INTEGER DEFAULT 0 NOT NULL,
  summary TEXT,
  last_updated TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_user_message TEXT,
  last_bot_message TEXT,
  last_action TEXT,
  alert_sent BOOLEAN DEFAULT false NOT NULL,
  meeting_link_sent BOOLEAN DEFAULT false NOT NULL,
  brochure_sent BOOLEAN DEFAULT false NOT NULL,
  last_alert_reason TEXT,
  last_signal TEXT,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Create Appointments Table
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status appointment_status DEFAULT 'ai_booked'::appointment_status NOT NULL,
  meeting_link TEXT,
  conversation_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Create Messages Table (optional for individual parsed messages)
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  sender TEXT CHECK (sender IN ('bot', 'lead')) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users Table Policies
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Only admins can update users" ON public.users FOR UPDATE 
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- Leads Table Policies
-- Admins, CEOs, and Heads can view all leads. Sales Reps can only view their assigned leads.
CREATE POLICY "View Leads Policy" ON public.leads FOR SELECT 
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'ceo', 'country_head', 'sales_head')
  OR assigned_to = auth.uid()
);

-- Authorized roles can insert/update leads
CREATE POLICY "Insert Leads Policy" ON public.leads FOR INSERT 
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'country_head', 'sales_head', 'sales_rep')
);

CREATE POLICY "Update Leads Policy" ON public.leads FOR UPDATE 
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'country_head', 'sales_head')
  OR assigned_to = auth.uid()
);

-- Conversations Table Policies
CREATE POLICY "View Conversations Policy" ON public.conversations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = public.conversations.lead_id 
    AND (
      (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'ceo', 'country_head', 'sales_head')
      OR l.assigned_to = auth.uid()
    )
  )
);

CREATE POLICY "Manage Conversations Policy" ON public.conversations FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = public.conversations.lead_id 
    AND (
      (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'country_head', 'sales_head')
      OR l.assigned_to = auth.uid()
    )
  )
);

-- Appointments Table Policies
CREATE POLICY "View Appointments Policy" ON public.appointments FOR SELECT 
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'ceo', 'country_head', 'sales_head')
  OR assigned_to = auth.uid()
);

CREATE POLICY "Insert/Update Appointments Policy" ON public.appointments FOR ALL 
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'country_head', 'sales_head')
  OR assigned_to = auth.uid()
);

-- Messages Table Policies
CREATE POLICY "View Messages Policy" ON public.messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = public.messages.lead_id 
    AND (
      (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'ceo', 'country_head', 'sales_head')
      OR l.assigned_to = auth.uid()
    )
  )
);

-- Realtime Publication
-- Expose these tables to Supabase Realtime for websocket updates
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.leads;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.appointments;
alter publication supabase_realtime add table public.messages;
