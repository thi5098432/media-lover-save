-- =========================================
-- SAVECLIP - MIGRATION INICIAL
-- =========================================
-- Este arquivo cria as tabelas necessárias
-- Execute com: psql -U postgres -d saveclip -f 001_initial.sql
-- =========================================

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de logs de downloads (opcional - para analytics)
CREATE TABLE IF NOT EXISTS download_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    platform VARCHAR(50),
    quality VARCHAR(20),
    type VARCHAR(20) DEFAULT 'video',
    ip_hash VARCHAR(64), -- Hash do IP para privacidade
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para queries comuns
CREATE INDEX IF NOT EXISTS idx_download_logs_created_at ON download_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_download_logs_platform ON download_logs(platform);

-- Tabela de rate limiting (se usar PostgreSQL ao invés de Redis)
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_hash VARCHAR(64) NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ip_hash, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(ip_hash, endpoint, window_start);

-- Função para limpar logs antigos (executar via cron)
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM download_logs WHERE created_at < NOW() - INTERVAL '30 days';
    DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Comentários nas tabelas
COMMENT ON TABLE download_logs IS 'Logs de downloads para analytics';
COMMENT ON TABLE rate_limits IS 'Controle de rate limiting por IP';
