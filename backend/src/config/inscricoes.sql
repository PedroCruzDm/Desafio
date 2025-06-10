CREATE TABLE IF NOT EXISTS inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    evento_id INT NULL,
    equipe_id INT NULL,
    tipo ENUM('evento', 'equipe') NOT NULL,
    status ENUM('pendente', 'aprovado', 'recusado') DEFAULT 'pendente',
    data_inscricao DATE NOT NULL,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
    FOREIGN KEY (equipe_id) REFERENCES equipes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_inscricoes_usuario ON inscricoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_evento ON inscricoes(evento_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_equipe ON inscricoes(equipe_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_tipo_status ON inscricoes(tipo, status);
