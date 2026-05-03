-- Allow 'quiz' as a valid claim_type for the Pratība wizard's quiz-scored XP.
-- The original CHECK constraint predates the wizard and only allowed legacy
-- values ('base', 'bonus'); the wizard inserts claim_type='quiz' rows alongside
-- claim_type='bonus' rows for the gated Prakse path.

ALTER TABLE public.xp_claims DROP CONSTRAINT IF EXISTS xp_claims_claim_type_check;

ALTER TABLE public.xp_claims
  ADD CONSTRAINT xp_claims_claim_type_check
  CHECK (claim_type IN ('base', 'quiz', 'bonus'));
