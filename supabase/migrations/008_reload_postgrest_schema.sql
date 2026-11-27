-- Migration 008: Create reload_postgrest_schema function
--
-- PostgREST caches the database schema at startup and only refreshes it
-- when notified on the `pgrst` channel. Migration 006 added the `feedback`
-- column to `participant_tasks` but did not create (or did not invoke) a
-- schema reload mechanism, so PostgREST's cache remained stale and could
-- not see the new column.
--
-- This function emits NOTIFY pgrst, 'reload schema' so PostgREST reloads
-- its schema cache and recognizes newly added columns.
--
-- The POST /api/v1/admin/schema/reload endpoint (implemented on the
-- Community API Worker backend) should invoke this function after any
-- schema change.
--
-- Rollback: DROP FUNCTION IF EXISTS public.reload_postgrest_schema();

CREATE OR REPLACE FUNCTION public.reload_postgrest_schema()
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
    NOTIFY pgrst, 'reload schema';
END;
$$;
