-- SQL para criar as tabelas e popular o banco de dados Supabase
-- Execute no SQL Editor do Supabase Dashboard

-- Criar tabelas
CREATE TABLE IF NOT EXISTS "functions" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "gira_types" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "function_id" INTEGER REFERENCES "functions"("id"),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "giras" (
    "id" SERIAL PRIMARY KEY,
    "gira_type_id" INTEGER NOT NULL REFERENCES "gira_types"("id"),
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'aberta'
);

CREATE TABLE IF NOT EXISTS "gira_mediums" (
    "gira_id" INTEGER NOT NULL REFERENCES "giras"("id") ON DELETE CASCADE,
    "medium_id" INTEGER NOT NULL REFERENCES "users"("id"),
    PRIMARY KEY ("gira_id", "medium_id")
);

CREATE TABLE IF NOT EXISTS "queue_entries" (
    "id" SERIAL PRIMARY KEY,
    "gira_id" INTEGER NOT NULL REFERENCES "giras"("id") ON DELETE CASCADE,
    "consultant_name" TEXT NOT NULL,
    "consultant_phone" TEXT,
    "sequence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aguardando',
    "assigned_medium_id" INTEGER REFERENCES "users"("id"),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3)
);

-- Criar índices
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "giras_status_opened_at_idx" ON "giras"("status", "opened_at");
CREATE INDEX IF NOT EXISTS "queue_entries_gira_id_sequence_idx" ON "queue_entries"("gira_id", "sequence");
CREATE INDEX IF NOT EXISTS "queue_entries_status_idx" ON "queue_entries"("status");

-- Popular dados iniciais

-- Funções
INSERT INTO "functions" ("name") VALUES 
    ('Médium'),
    ('Cambone'),
    ('Ogã')
ON CONFLICT ("name") DO NOTHING;

-- Tipos de Gira
INSERT INTO "gira_types" ("name") VALUES 
    ('Preto-Velho'),
    ('Caboclo'),
    ('Exu'),
    ('Pomba-Gira')
ON CONFLICT ("name") DO NOTHING;

-- Limpar usuários existentes para recriar com senhas corretas
DELETE FROM "users";

-- Usuário Admin (senha: Admin@123)
INSERT INTO "users" ("name", "email", "password_hash", "role") VALUES 
    ('Administrador', 'admin@ogum.local', '$2b$10$Awr9bpjsDGvMxjJA4QIIc.XBc1zLBawP/ajruA8pzZITAtoaqJRoO', 'admin');

-- Usuários de teste (senha: User@123)
INSERT INTO "users" ("name", "email", "password_hash", "role", "function_id") VALUES 
    ('Maria Silva', 'maria@ogum.local', '$2b$10$HuRWTS0G8.rOGAL4Z3vH8euVkWgjuBQxfCS.A5M79EZJ9.ORllEOa', 'user', 1),
    ('João Santos', 'joao@ogum.local', '$2b$10$HuRWTS0G8.rOGAL4Z3vH8euVkWgjuBQxfCS.A5M79EZJ9.ORllEOa', 'user', 1),
    ('Ana Costa', 'ana@ogum.local', '$2b$10$HuRWTS0G8.rOGAL4Z3vH8euVkWgjuBQxfCS.A5M79EZJ9.ORllEOa', 'user', 2);
