-- =============================================================================
-- EDUMATRIX ERP EDUCACIONAL - MASTER DATABASE INIT SCRIPT (POSTGRESQL)
-- =============================================================================
-- Execução:
--   psql -U postgres -d edumatrix_db -f database/init.sql
-- Ou importe no Supabase, Neon, DBeaver, pgAdmin ou Docker.
-- =============================================================================

BEGIN;

-- 1. CARREGAR ESTRUTURA / SCHEMA DDL
\i database/schema.sql

-- 2. CARREGAR DADOS INICIAIS / SEED DML
\i database/seed.sql

COMMIT;
