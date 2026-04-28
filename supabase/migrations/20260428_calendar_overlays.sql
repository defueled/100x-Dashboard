-- Adds the calendar_overlays array used by /app Kalendārs marketplace.
-- /api/calendar/activate writes/reads this column so subscriptions persist
-- across sessions instead of living only in component state.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS calendar_overlays TEXT[] DEFAULT ARRAY[]::TEXT[];
