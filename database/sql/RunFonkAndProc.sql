SELECT proname, pg_get_functiondef(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.prokind = 'f'; --fonksiyonların listesini getirir.

SELECT proname, pg_get_function_arguments(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.prokind = 'p'; --prosedürlerin listesini getirir.

SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'; --fonksiyonların ve procedürlerin listesini getirir.