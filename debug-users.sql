-- Verificar usuários no banco
SELECT id, name, email, role, active, 
       LENGTH(password_hash) as hash_length,
       SUBSTRING(password_hash, 1, 10) as hash_prefix
FROM users;
