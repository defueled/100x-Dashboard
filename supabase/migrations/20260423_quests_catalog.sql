-- 100x Quests system: catalog + submissions
-- Run in Supabase SQL editor. Idempotent.

CREATE TABLE IF NOT EXISTS task_catalog (
  id            TEXT PRIMARY KEY,
  pillar        TEXT NOT NULL CHECK (pillar IN ('ai', 'defi', 'tradfi', 'culture', 'global')),
  tier          INT NOT NULL CHECK (tier BETWEEN 1 AND 3),
  title_lv      TEXT NOT NULL,
  description_lv TEXT,
  xp_amount     INT NOT NULL,
  proof_type    TEXT NOT NULL CHECK (proof_type IN ('url', 'tx_hash', 'admin_review')),
  proof_hint_lv TEXT,
  auto_approve  BOOLEAN DEFAULT FALSE,  -- T1 URL submits skip admin queue
  active        BOOLEAN DEFAULT TRUE,
  position      INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email    TEXT NOT NULL,
  task_id       TEXT NOT NULL REFERENCES task_catalog(id),
  proof_url     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes   TEXT,
  submitted_at  TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ,
  reviewed_by   TEXT,
  UNIQUE(user_email, task_id)
);

CREATE INDEX IF NOT EXISTS idx_task_submissions_status ON task_submissions(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_task_submissions_user ON task_submissions(user_email);

-- Starter catalog (12 tasks, 3 per pillar)
INSERT INTO task_catalog (id, pillar, tier, title_lv, description_lv, xp_amount, proof_type, proof_hint_lv, auto_approve, position) VALUES
  ('ai_t1_chatgpt_account',  'ai', 1, 'Izveido AI rīka kontu (ChatGPT / Claude)',
   'Uzstādi savu pirmo AI chat kontu, lai sāktu eksperimentēt ar promptingu.', 100, 'url',
   'Ielīmē saiti uz savu pirmo sarunu vai screenshot imgur saiti.', true, 10),
  ('ai_t2_prompt_post',      'ai', 2, 'Publicē strukturētu promptu AI forumā',
   'Uzraksti strukturētu promptu (role + context + constraints + example), publicē komūnas forumā un dalies ar rezultātu.', 500, 'url',
   'Ielīmē saiti uz forum postu vietnē platforma.100x.lv.', false, 20),
  ('ai_t3_ship_ai_tool',     'ai', 3, 'Uzbūvē un publicē savu AI rīku vai aģentu',
   'Uzbūvē nelielu AI rīku (web app, script vai MCP) un publicē kodu GitHub.', 1500, 'admin_review',
   'Ielīmē GitHub repo saiti.', false, 30),

  ('defi_t1_wallet_setup',   'defi', 1, 'Uzstādi savu pirmo Web3 maciņu',
   'Instalē MetaMask vai Rabby, saglabā savu seed frāzi drošā vietā.', 100, 'url',
   'Ielīmē savu EVM adresi (0x…) kā pierādījumu.', true, 10),
  ('defi_t2_first_swap',     'defi', 2, 'Veic pirmo swap DEX-ā',
   'Apmaini vienu tokenu pret citu uz Uniswap / Sushi / 1inch. Testnet vai mainnet.', 500, 'tx_hash',
   'Ielīmē transakcijas hash (0x…). Mēs pārbaudīsim on-chain.', false, 20),
  ('defi_t3_protocol_review','defi', 3, 'Publicē DeFi protokola analīzi',
   'Izvēlies 1 DeFi protokolu, izpēti tā mehāniku un risku, uzraksti analīzi komūnas forumā.', 1500, 'admin_review',
   'Ielīmē forum posta URL. Mēs pārskatām kvalitāti.', false, 30),

  ('tradfi_t1_watchlist',    'tradfi', 1, 'Izveido watchlist ar 5 aktīviem',
   'Izvēlies 5 aktīvus (akcijas, ETF, krypto) un izveido watchlist ar price alert.', 100, 'url',
   'Ielīmē screenshot saiti (imgur/loom).', true, 10),
  ('tradfi_t2_market_analysis','tradfi', 2, 'Publicē tirgus analīzi forumā',
   'Uzraksti 300+ vārdu tirgus analīzi par 1 tēmu un publicē forumā.', 500, 'url',
   'Ielīmē forum posta URL.', false, 20),
  ('tradfi_t3_risk_plan',    'tradfi', 3, 'Riska vadības plāns + 30 dienu izpilde',
   'Uzraksti pilnu riska vadības plānu (pozīciju izmērs, stop-loss, max drawdown) un seko tam 30 dienas.', 1500, 'admin_review',
   'Ielīmē saiti uz savu plānu + 30d journal. Mēs pārbaudīsim.', false, 30),

  ('culture_t1_intro',       'culture', 1, 'Iepazīstini sevi Kultūras forumā',
   'Uzraksti īsu iepazīstināšanās postu Kultūras forumā — kas tu esi, ko darī, kas aizrauj.', 100, 'url',
   'Ielīmē forum posta URL.', true, 10),
  ('culture_t2_original',    'culture', 2, 'Radi oriģinālu saturu un publicē',
   'Radi oriģinālu saturu (teksts/video/grafika/mūzika) par komūnai interesējošu tēmu un publicē.', 500, 'url',
   'Ielīmē publikācijas URL.', false, 20),
  ('culture_t3_ama',         'culture', 3, 'Vadi AMA vai diskusiju ar 10+ dalībniekiem',
   'Organizē un vadi "Ask Me Anything" vai diskusiju, kur piedalās vismaz 10 biedri.', 1500, 'admin_review',
   'Ielīmē saiti uz ierakstu vai forum thread.', false, 30)
ON CONFLICT (id) DO UPDATE SET
  title_lv = EXCLUDED.title_lv,
  description_lv = EXCLUDED.description_lv,
  xp_amount = EXCLUDED.xp_amount,
  proof_type = EXCLUDED.proof_type,
  proof_hint_lv = EXCLUDED.proof_hint_lv,
  auto_approve = EXCLUDED.auto_approve,
  position = EXCLUDED.position,
  active = EXCLUDED.active;
