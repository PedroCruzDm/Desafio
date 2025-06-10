-- Tabela para equipes com armazenamento de membros como JSON
CREATE TABLE IF NOT EXISTS equipes_json (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    lider VARCHAR(100),
    membros_lista TEXT, -- Armazenará a lista de membros como JSON
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_equipes_json_nome ON equipes_json(nome);