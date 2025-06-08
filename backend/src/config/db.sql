CREATE DATABASE IF NOT EXISTS "desafiodb";
USE "desafiodb";

CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    equipe VARCHAR(100),
    status ENUM('inativo', 'ativado', 'pedente', 'erro', 'concluido') DEFAULT 'inativo',
    data_inicial DATE NOT NULL,
    data_final DATE NOT NULL,
    cor VARCHAR(20),
    descricao TEXT,
    criador INT NOT NULL,
    criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (criador) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_eventos_usuario_data ON eventos(usuario_id, data);