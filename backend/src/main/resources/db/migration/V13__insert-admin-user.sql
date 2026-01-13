-- Migration V13: Insere usuario administrativo inicial
-- Este usuario e criado para permitir acesso inicial ao sistema
-- IMPORTANTE: Alterar senha apos primeiro acesso em producao

-- Hash BCrypt da senha "admin123" (12 rounds)
-- Hash valido: $2a$12$P0yvBoH9ucTiDfcUjG5T2uWsfyPLfRsJbpvsSOJ9Aqh1vWvdUOMtK
-- PRODUCAO: Alterar esta senha imediatamente apos primeiro acesso

INSERT INTO tb_users (
    id,
    name,
    email,
    password_hash,
    role,
    status,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Administrador',
    'admin@livraria.com',
    '$2a$12$P0yvBoH9ucTiDfcUjG5T2uWsfyPLfRsJbpvsSOJ9Aqh1vWvdUOMtK',
    'ADMIN',
    'ACTIVE',
    NOW(),
    NOW()
);

-- Log de criacao do usuario admin
-- Email: admin@livraria.com
-- Senha inicial: admin123
-- IMPORTANTE: Alterar senha em producao imediatamente

