-- Migration 007: Add feedback column to participant_tasks
--
-- The `feedback` column is required by the Community API backend when
-- creating and reading tasks. Migration 006 was applied to production but
-- either did not add this column or did not refresh the PostgREST schema
-- cache after doing so.
--
-- This migration safely adds the `feedback` column only if it does not
-- already exist, preserving all existing task records.
--
-- Rollback: ALTER TABLE public.participant_tasks DROP COLUMN feedback;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'participant_tasks'
          AND column_name = 'feedback'
    ) THEN
        ALTER TABLE public.participant_tasks
        ADD COLUMN feedback TEXT NULL;
    END IF;
END $$;
