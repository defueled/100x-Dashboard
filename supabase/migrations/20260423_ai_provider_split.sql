-- 2026-04-23 — Forum channel URLs + provider-tagged AI catalog rewrite
-- Applied via Supabase MCP; this file is the repo audit mirror.
--
-- Three logical changes:
--   1. Swap forum_url from /home landings to per-pillar "Pārdomas, viedokļi" channel deep-links.
--   2. Add task_catalog.provider column (+ partial index).
--   3. Deactivate the 8 generic AI tasks; seed 13 provider-tagged AI tasks
--      (OpenAI×4, Anthropic×3, Grok×2, Gemini×4) with educational instructions_lv.
--
-- The SQL below is idempotent — safe to re-run.

-- ======================================================================
-- Part 1: Forum channel URLs
-- ======================================================================

UPDATE task_catalog
SET forum_url = CASE pillar
    WHEN 'ai'      THEN 'https://platforma.100x.lv/communities/groups/aii/channels/%E2%81%89%EF%B8%8F-P%C4%81rdomas,-viedok%C4%BCi-4sUto'
    WHEN 'defi'    THEN 'https://platforma.100x.lv/communities/groups/defi/channels/%E2%81%89%EF%B8%8F-P%C4%81rdomas,-viedok%C4%BCi-7wZJvf'
    WHEN 'tradfi'  THEN 'https://platforma.100x.lv/communities/groups/tradfi/channels/%E2%81%89%EF%B8%8F-P%C4%81rdomas,-viedok%C4%BCi-1pMzr'
    WHEN 'culture' THEN 'https://platforma.100x.lv/communities/groups/kultura/channels/%E2%81%89%EF%B8%8F-P%C4%81rdomas,-viedok%C4%BCi-6pOoYE'
    ELSE forum_url
END
WHERE pillar IN ('ai','defi','tradfi','culture')
  AND forum_url IS NOT NULL;

-- ======================================================================
-- Part 2: provider column
-- ======================================================================

ALTER TABLE task_catalog ADD COLUMN IF NOT EXISTS provider TEXT;
CREATE INDEX IF NOT EXISTS task_catalog_provider_idx ON task_catalog (provider) WHERE provider IS NOT NULL;

-- ======================================================================
-- Part 3: Deactivate generic AI tasks (xp_claims rows stay intact; FK preserves history)
-- ======================================================================

UPDATE task_catalog
SET active = false
WHERE pillar = 'ai'
  AND id IN (
    'ai_t1_chatgpt_account', 'ai_t1_prompt_basics',
    'ai_t2_content_creation', 'ai_t2_prompt_post', 'ai_t2_text_to_image',
    'ai_t3_ai_income', 'ai_t3_automation', 'ai_t3_ship_ai_tool'
  );

-- ======================================================================
-- Part 4: Seed provider-tagged AI tasks
-- Full instructions_lv + external_links + forum_template_lv are applied via
-- Supabase MCP migrations. The mirror below captures IDs + shape; for full
-- content see Supabase schema_migrations table versions starting 20260423122622.
-- ======================================================================

-- OpenAI
INSERT INTO task_catalog (id, pillar, provider, tier, title_lv, xp_amount, proof_type, auto_approve, position, requires_forum_proof)
VALUES
    ('ai_t1_openai_chatgpt', 'ai', 'openai', 1, 'Izveido ChatGPT kontu un padalies pirmajā sarunā', 100, 'url', true, 10, true),
    ('ai_t2_openai_gpt_content', 'ai', 'openai', 2, 'Radi saturu ar ChatGPT un publicē forumā', 500, 'url', false, 20, true),
    ('ai_t2_openai_dalle', 'ai', 'openai', 2, 'Ģenerē attēlu ar DALL-E 3 un publicē forumā', 500, 'url', false, 30, true),
    ('ai_t3_openai_custom_gpt', 'ai', 'openai', 3, 'Uzbūvē savu Custom GPT un dalies ar to', 1500, 'admin_review', false, 40, true)
ON CONFLICT (id) DO NOTHING;

-- Anthropic
INSERT INTO task_catalog (id, pillar, provider, tier, title_lv, xp_amount, proof_type, auto_approve, position, requires_forum_proof)
VALUES
    ('ai_t1_anthropic_claude', 'ai', 'anthropic', 1, 'Izveido Claude kontu un uzraksti pirmo promptu', 100, 'url', true, 50, true),
    ('ai_t2_anthropic_artifacts', 'ai', 'anthropic', 2, 'Izveido interaktīvu Artifact ar Claude', 500, 'url', false, 60, true),
    ('ai_t3_anthropic_claude_code', 'ai', 'anthropic', 3, 'Uzbūvē reālu projektu ar Claude Code', 1500, 'admin_review', false, 70, true)
ON CONFLICT (id) DO NOTHING;

-- Grok
INSERT INTO task_catalog (id, pillar, provider, tier, title_lv, xp_amount, proof_type, auto_approve, position, requires_forum_proof)
VALUES
    ('ai_t1_grok_chat', 'ai', 'grok', 1, 'Izveido Grok pieeju un uzsāc sarunu', 100, 'url', true, 80, true),
    ('ai_t2_grok_deepsearch', 'ai', 'grok', 2, 'Izmanto Grok DeepSearch reāllaika analīzei', 500, 'url', false, 90, true)
ON CONFLICT (id) DO NOTHING;

-- Gemini
INSERT INTO task_catalog (id, pillar, provider, tier, title_lv, xp_amount, proof_type, auto_approve, position, requires_forum_proof)
VALUES
    ('ai_t1_gemini_studio', 'ai', 'gemini', 1, 'Izveido Google AI Studio pieeju un pirmais prompts', 100, 'url', true, 100, true),
    ('ai_t2_gemini_nanobanana', 'ai', 'gemini', 2, 'Ģenerē attēlu ar Nano Banana (Imagen 3)', 500, 'url', false, 110, true),
    ('ai_t2_gemini_veo', 'ai', 'gemini', 2, 'Ģenerē video ar Veo 3', 500, 'url', false, 120, true),
    ('ai_t3_gemini_workspace', 'ai', 'gemini', 3, 'Integrē Gemini savā ikdienas darbplūsmā (Gmail, Docs, Sheets)', 1500, 'admin_review', false, 130, true)
ON CONFLICT (id) DO NOTHING;
