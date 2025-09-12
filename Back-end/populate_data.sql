-- Script para popular o banco de dados com dados de teste
-- Este arquivo deve ser executado após a criação das tabelas

INSERT INTO solicitacoes (data, hora, status, delegacia, cidade, tipo_ocorrencia, numero_protocolo, perito_responsavel, observacoes, created_at, updated_at) VALUES
-- Novas Solicitações
('2025-09-02', '09:30:00', 'Nova', '1ª DP Centro', 'Fortaleza', 'Homicídio', 'SOL-2025-001', NULL, 'Caso urgente', '2025-09-02 09:30:00', '2025-09-02 09:30:00'),
('2025-09-02', '10:15:00', 'Nova', '5ª DP Antônio Bezerra', 'Fortaleza', 'Roubo', 'SOL-2025-002', NULL, 'Roubo em residência', '2025-09-02 10:15:00', '2025-09-02 10:15:00'),
('2025-09-02', '11:00:00', 'Nova', '2ª DP Aldeota', 'Fortaleza', 'Furto', 'SOL-2025-003', NULL, 'Furto de veículo', '2025-09-02 11:00:00', '2025-09-02 11:00:00'),
('2025-09-02', '14:30:00', 'Nova', '3ª DP Pirambu', 'Fortaleza', 'Lesão Corporal', 'SOL-2025-004', NULL, 'Agressão física', '2025-09-02 14:30:00', '2025-09-02 14:30:00'),
('2025-09-02', '15:45:00', 'Nova', '4ª DP Montese', 'Fortaleza', 'Estupro', 'SOL-2025-005', NULL, 'Crime sexual', '2025-09-02 15:45:00', '2025-09-02 15:45:00'),

-- Solicitações Recebidas
('2025-09-01', '08:00:00', 'Recebida', '1ª DP Centro', 'Fortaleza', 'Homicídio', 'SOL-2025-006', NULL, 'Aguardando distribuição', '2025-09-01 08:00:00', '2025-09-01 16:30:00'),
('2025-09-01', '09:15:00', 'Recebida', '6ª DP Messejana', 'Fortaleza', 'Roubo', 'SOL-2025-007', NULL, 'Roubo a banco', '2025-09-01 09:15:00', '2025-09-01 17:00:00'),
('2025-09-01', '10:30:00', 'Recebida', '7ª DP Barra do Ceará', 'Fortaleza', 'Tráfico', 'SOL-2025-008', NULL, 'Apreensão de drogas', '2025-09-01 10:30:00', '2025-09-01 18:15:00'),
('2025-09-01', '11:45:00', 'Recebida', '8ª DP Canindezinho', 'Fortaleza', 'Falsificação', 'SOL-2025-009', NULL, 'Documentos falsos', '2025-09-01 11:45:00', '2025-09-01 19:00:00'),
('2025-09-01', '13:20:00', 'Recebida', 'DP Caucaia', 'Caucaia', 'Furto', 'SOL-2025-010', NULL, 'Furto em estabelecimento', '2025-09-01 13:20:00', '2025-09-01 20:30:00'),
('2025-09-01', '14:10:00', 'Recebida', 'DP Maracanaú', 'Maracanaú', 'Homicídio', 'SOL-2025-011', NULL, 'Crime de trânsito', '2025-09-01 14:10:00', '2025-09-01 21:00:00'),

-- Solicitações Distribuídas
('2025-08-31', '07:30:00', 'Distribuída', '9ª DP Bom Jardim', 'Fortaleza', 'Latrocínio', 'SOL-2025-012', 'Dr. João Silva', 'Distribuído para perito especializado', '2025-08-31 07:30:00', '2025-09-01 08:00:00'),
('2025-08-31', '08:45:00', 'Distribuída', '10ª DP Conjunto Ceará', 'Fortaleza', 'Estupro', 'SOL-2025-013', 'Dra. Maria Santos', 'Caso prioritário', '2025-08-31 08:45:00', '2025-09-01 09:30:00'),
('2025-08-31', '09:20:00', 'Distribuída', '11ª DP Parangaba', 'Fortaleza', 'Roubo', 'SOL-2025-014', 'Dr. Carlos Pereira', 'Roubo seguido de morte', '2025-08-31 09:20:00', '2025-09-01 10:15:00'),
('2025-08-31', '10:15:00', 'Distribuída', '12ª DP Novo Mondubim', 'Fortaleza', 'Homicídio', 'SOL-2025-015', 'Dr. João Silva', 'Múltiplas vítimas', '2025-08-31 10:15:00', '2025-09-01 11:00:00'),
('2025-08-31', '11:30:00', 'Distribuída', 'DP Sobral', 'Sobral', 'Falsificação', 'SOL-2025-016', 'Dra. Ana Costa', 'Falsificação de moeda', '2025-08-31 11:30:00', '2025-09-01 12:30:00'),
('2025-08-31', '13:15:00', 'Distribuída', 'DP Juazeiro do Norte', 'Juazeiro do Norte', 'Tráfico', 'SOL-2025-017', 'Dr. Pedro Lima', 'Grande quantidade de drogas', '2025-08-31 13:15:00', '2025-09-01 14:00:00'),
('2025-08-31', '14:30:00', 'Distribuída', 'DP Crato', 'Crato', 'Lesão Corporal', 'SOL-2025-018', 'Dra. Lucia Almeida', 'Violência doméstica', '2025-08-31 14:30:00', '2025-09-01 15:30:00'),

-- Recebidas por Perito
('2025-08-30', '08:00:00', 'Recebida por Perito', '13ª DP Parangaba', 'Fortaleza', 'Homicídio', 'SOL-2025-019', 'Dr. João Silva', 'Perito confirmou recebimento', '2025-08-30 08:00:00', '2025-08-30 16:30:00'),
('2025-08-30', '09:15:00', 'Recebida por Perito', '14ª DP Benfica', 'Fortaleza', 'Roubo', 'SOL-2025-020', 'Dra. Maria Santos', 'Aguardando início da perícia', '2025-08-30 09:15:00', '2025-08-30 17:45:00'),
('2025-08-30', '10:30:00', 'Recebida por Perito', '15ª DP Aldeota', 'Fortaleza', 'Furto', 'SOL-2025-021', 'Dr. Carlos Pereira', 'Material coletado', '2025-08-30 10:30:00', '2025-08-30 18:20:00'),
('2025-08-30', '11:45:00', 'Recebida por Perito', '16ª DP Aeroporto', 'Fortaleza', 'Estelionato', 'SOL-2025-022', 'Dra. Ana Costa', 'Documentos em análise', '2025-08-30 11:45:00', '2025-08-30 19:15:00'),
('2025-08-30', '13:20:00', 'Recebida por Perito', 'DP Iguatu', 'Iguatu', 'Homicídio', 'SOL-2025-023', 'Dr. Pedro Lima', 'Local preservado', '2025-08-30 13:20:00', '2025-08-30 20:00:00'),
('2025-08-30', '14:35:00', 'Recebida por Perito', 'DP Quixadá', 'Quixadá', 'Latrocínio', 'SOL-2025-024', 'Dra. Lucia Almeida', 'Vítima identificada', '2025-08-30 14:35:00', '2025-08-30 21:10:00'),

-- Perícias Em Andamento
('2025-08-29', '07:30:00', 'Em Andamento', '17ª DP Messejana', 'Fortaleza', 'Homicídio', 'SOL-2025-025', 'Dr. João Silva', 'Perícia em execução', '2025-08-29 07:30:00', '2025-08-29 15:30:00'),
('2025-08-29', '08:45:00', 'Em Andamento', '18ª DP Antônio Bezerra', 'Fortaleza', 'Estupro', 'SOL-2025-026', 'Dra. Maria Santos', 'Coletando evidências', '2025-08-29 08:45:00', '2025-08-29 16:45:00'),
('2025-08-29', '09:20:00', 'Em Andamento', '19ª DP Barra do Ceará', 'Fortaleza', 'Roubo', 'SOL-2025-027', 'Dr. Carlos Pereira', 'Análise balística', '2025-08-29 09:20:00', '2025-08-29 17:20:00'),
('2025-08-29', '10:15:00', 'Em Andamento', '20ª DP Canindezinho', 'Fortaleza', 'Tráfico', 'SOL-2025-028', 'Dra. Ana Costa', 'Análise química em curso', '2025-08-29 10:15:00', '2025-08-29 18:15:00'),
('2025-08-29', '11:30:00', 'Em Andamento', 'DP Itapipoca', 'Itapipoca', 'Falsificação', 'SOL-2025-029', 'Dr. Pedro Lima', 'Perícia grafotécnica', '2025-08-29 11:30:00', '2025-08-29 19:30:00'),
('2025-08-29', '13:15:00', 'Em Andamento', 'DP Camocim', 'Camocim', 'Furto', 'SOL-2025-030', 'Dra. Lucia Almeida', 'Levantamento papiloscópico', '2025-08-29 13:15:00', '2025-08-29 21:15:00'),
('2025-08-29', '14:30:00', 'Em Andamento', 'DP Aracati', 'Aracati', 'Lesão Corporal', 'SOL-2025-031', 'Dr. João Silva', 'Exame necroscópico', '2025-08-29 14:30:00', '2025-08-29 22:30:00'),
('2025-08-29', '15:45:00', 'Em Andamento', 'DP Limoeiro do Norte', 'Limoeiro do Norte', 'Homicídio', 'SOL-2025-032', 'Dra. Maria Santos', 'Reconstituição dos fatos', '2025-08-29 15:45:00', '2025-08-29 23:45:00'),

-- Perícias Concluídas
('2025-08-28', '08:00:00', 'Concluída', '1ª DP Centro', 'Fortaleza', 'Roubo', 'SOL-2025-033', 'Dr. Carlos Pereira', 'Perícia finalizada', '2025-08-28 08:00:00', '2025-08-28 17:00:00'),
('2025-08-28', '09:15:00', 'Concluída', '2ª DP Aldeota', 'Fortaleza', 'Furto', 'SOL-2025-034', 'Dra. Ana Costa', 'Material analisado', '2025-08-28 09:15:00', '2025-08-28 18:15:00'),
('2025-08-28', '10:30:00', 'Concluída', '3ª DP Pirambu', 'Fortaleza', 'Homicídio', 'SOL-2025-035', 'Dr. Pedro Lima', 'Laudo em elaboração', '2025-08-28 10:30:00', '2025-08-28 19:30:00'),
('2025-08-28', '11:45:00', 'Concluída', '4ª DP Montese', 'Fortaleza', 'Estupro', 'SOL-2025-036', 'Dra. Lucia Almeida', 'Evidências coletadas', '2025-08-28 11:45:00', '2025-08-28 20:45:00'),
('2025-08-28', '13:20:00', 'Concluída', '5ª DP Antônio Bezerra', 'Fortaleza', 'Latrocínio', 'SOL-2025-037', 'Dr. João Silva', 'Análise completa', '2025-08-28 13:20:00', '2025-08-28 22:20:00'),
('2025-08-28', '14:35:00', 'Concluída', 'DP Pacajus', 'Pacajus', 'Tráfico', 'SOL-2025-038', 'Dra. Maria Santos', 'Substâncias identificadas', '2025-08-28 14:35:00', '2025-08-28 23:35:00'),

-- Laudos Pendentes
('2025-08-27', '07:30:00', 'Laudo Pendente', '6ª DP Messejana', 'Fortaleza', 'Falsificação', 'SOL-2025-039', 'Dr. Carlos Pereira', 'Aguardando redação do laudo', '2025-08-27 07:30:00', '2025-08-27 16:30:00'),
('2025-08-27', '08:45:00', 'Laudo Pendente', '7ª DP Barra do Ceará', 'Fortaleza', 'Lesão Corporal', 'SOL-2025-040', 'Dra. Ana Costa', 'Laudo em elaboração', '2025-08-27 08:45:00', '2025-08-27 17:45:00'),
('2025-08-27', '09:20:00', 'Laudo Pendente', '8ª DP Canindezinho', 'Fortaleza', 'Roubo', 'SOL-2025-041', 'Dr. Pedro Lima', 'Revisão técnica pendente', '2025-08-27 09:20:00', '2025-08-27 18:20:00'),
('2025-08-27', '10:15:00', 'Laudo Pendente', '9ª DP Bom Jardim', 'Fortaleza', 'Furto', 'SOL-2025-042', 'Dra. Lucia Almeida', 'Conclusões em elaboração', '2025-08-27 10:15:00', '2025-08-27 19:15:00'),
('2025-08-27', '11:30:00', 'Laudo Pendente', 'DP Russas', 'Russas', 'Homicídio', 'SOL-2025-043', 'Dr. João Silva', 'Laudo técnico pendente', '2025-08-27 11:30:00', '2025-08-27 20:30:00'),

-- Não Pertencem ao SIP
('2025-08-26', '08:00:00', 'Não Pertence ao SIP', '10ª DP Conjunto Ceará', 'Fortaleza', 'Contravenção', 'SOL-2025-044', NULL, 'Caso não é competência do SIP', '2025-08-26 08:00:00', '2025-08-26 16:00:00'),
('2025-08-26', '09:15:00', 'Não Pertence ao SIP', '11ª DP Parangaba', 'Fortaleza', 'Infração Administrativa', 'SOL-2025-045', NULL, 'Fora da competência', '2025-08-26 09:15:00', '2025-08-26 17:15:00'),
('2025-08-26', '10:30:00', 'Não Pertence ao SIP', 'DP Horizonte', 'Horizonte', 'Acidente de Trânsito', 'SOL-2025-046', NULL, 'Competência de outro órgão', '2025-08-26 10:30:00', '2025-08-26 18:30:00'),

-- Pendentes de envio ao SIP
('2025-08-25', '07:30:00', 'Pendente de Envio ao SIP', '12ª DP Novo Mondubim', 'Fortaleza', 'Homicídio', 'SOL-2025-047', 'Dr. Carlos Pereira', 'Laudo pronto, aguarda envio', '2025-08-25 07:30:00', '2025-08-25 15:30:00'),
('2025-08-25', '08:45:00', 'Pendente de Envio ao SIP', '13ª DP Parangaba', 'Fortaleza', 'Estupro', 'SOL-2025-048', 'Dra. Ana Costa', 'Documentação completa', '2025-08-25 08:45:00', '2025-08-25 16:45:00'),
('2025-08-25', '09:20:00', 'Pendente de Envio ao SIP', 'DP Cascavel', 'Cascavel', 'Latrocínio', 'SOL-2025-049', 'Dr. Pedro Lima', 'Pronto para envio', '2025-08-25 09:20:00', '2025-08-25 17:20:00'),
('2025-08-25', '10:15:00', 'Pendente de Envio ao SIP', 'DP Canindé', 'Canindé', 'Roubo', 'SOL-2025-050', 'Dra. Lucia Almeida', 'Aguardando protocolo', '2025-08-25 10:15:00', '2025-08-25 18:15:00'),

-- Enviados ao SIP
('2025-08-24', '08:00:00', 'Enviado ao SIP', '14ª DP Benfica', 'Fortaleza', 'Tráfico', 'SOL-2025-051', 'Dr. João Silva', 'Enviado com sucesso', '2025-08-24 08:00:00', '2025-08-24 14:00:00'),
('2025-08-24', '09:15:00', 'Enviado ao SIP', '15ª DP Aldeota', 'Fortaleza', 'Falsificação', 'SOL-2025-052', 'Dra. Maria Santos', 'Protocolo SIP confirmado', '2025-08-24 09:15:00', '2025-08-24 15:15:00'),
('2025-08-24', '10:30:00', 'Enviado ao SIP', 'DP Crateús', 'Crateús', 'Furto', 'SOL-2025-053', 'Dr. Carlos Pereira', 'Recebido pelo SIP', '2025-08-24 10:30:00', '2025-08-24 16:30:00'),
('2025-08-24', '11:45:00', 'Enviado ao SIP', 'DP Tianguá', 'Tianguá', 'Lesão Corporal', 'SOL-2025-054', 'Dra. Ana Costa', 'Processamento no SIP', '2025-08-24 11:45:00', '2025-08-24 17:45:00'),
('2025-08-24', '13:20:00', 'Enviado ao SIP', 'DP Tauá', 'Tauá', 'Homicídio', 'SOL-2025-055', 'Dr. Pedro Lima', 'Integrado ao sistema', '2025-08-24 13:20:00', '2025-08-24 19:20:00'),

-- Em custódia do Núcleo
('2025-08-23', '08:00:00', 'Em Custódia do Núcleo', '16ª DP Aeroporto', 'Fortaleza', 'Roubo', 'SOL-2025-056', 'Dra. Lucia Almeida', 'Material em custódia', '2025-08-23 08:00:00', '2025-08-23 16:00:00'),
('2025-08-23', '09:15:00', 'Em Custódia do Núcleo', '17ª DP Messejana', 'Fortaleza', 'Estupro', 'SOL-2025-057', 'Dr. João Silva', 'Evidências preservadas', '2025-08-23 09:15:00', '2025-08-23 17:15:00'),
('2025-08-23', '10:30:00', 'Em Custódia do Núcleo', 'DP Icó', 'Icó', 'Latrocínio', 'SOL-2025-058', 'Dra. Maria Santos', 'Aguardando destinação', '2025-08-23 10:30:00', '2025-08-23 18:30:00'),

-- Cobrança
('2025-08-22', '08:00:00', 'Cobrança', '18ª DP Antônio Bezerra', 'Fortaleza', 'Homicídio', 'SOL-2025-059', 'Dr. Carlos Pereira', 'Cobrança de informações', '2025-08-22 08:00:00', '2025-08-22 16:00:00'),
('2025-08-22', '09:15:00', 'Cobrança', '19ª DP Barra do Ceará', 'Fortaleza', 'Tráfico', 'SOL-2025-060', 'Dra. Ana Costa', 'Dados complementares solicitados', '2025-08-22 09:15:00', '2025-08-22 17:15:00'),
('2025-08-22', '10:30:00', 'Cobrança', 'DP Morada Nova', 'Morada Nova', 'Falsificação', 'SOL-2025-061', 'Dr. Pedro Lima', 'Aguardando resposta', '2025-08-22 10:30:00', '2025-08-22 18:30:00'),

-- Solicitações Devolvidas
('2025-08-21', '08:00:00', 'Devolvida', '20ª DP Canindezinho', 'Fortaleza', 'Furto', 'SOL-2025-062', NULL, 'Documentação incompleta', '2025-08-21 08:00:00', '2025-08-21 16:00:00'),
('2025-08-21', '09:15:00', 'Devolvida', 'DP Paracuru', 'Paracuru', 'Roubo', 'SOL-2025-063', NULL, 'Falta de elementos técnicos', '2025-08-21 09:15:00', '2025-08-21 17:15:00'),
('2025-08-21', '10:30:00', 'Devolvida', 'DP São Gonçalo do Amarante', 'São Gonçalo do Amarante', 'Lesão Corporal', 'SOL-2025-064', NULL, 'Requisitos não atendidos', '2025-08-21 10:30:00', '2025-08-21 18:30:00'),

-- Solicitações Pausadas
('2025-08-20', '08:00:00', 'Pausada', '1ª DP Centro', 'Fortaleza', 'Homicídio', 'SOL-2025-065', 'Dra. Lucia Almeida', 'Aguardando laudo complementar', '2025-08-20 08:00:00', '2025-08-20 16:00:00'),
('2025-08-20', '09:15:00', 'Pausada', '2ª DP Aldeota', 'Fortaleza', 'Estupro', 'SOL-2025-066', 'Dr. João Silva', 'Pendente de exame especializado', '2025-08-20 09:15:00', '2025-08-20 17:15:00'),

-- Laudos Para Revisão
('2025-08-19', '08:00:00', 'Laudo para Revisão', '3ª DP Pirambu', 'Fortaleza', 'Latrocínio', 'SOL-2025-067', 'Dra. Maria Santos', 'Revisão técnica solicitada', '2025-08-19 08:00:00', '2025-08-19 16:00:00'),
('2025-08-19', '09:15:00', 'Laudo para Revisão', '4ª DP Montese', 'Fortaleza', 'Tráfico', 'SOL-2025-068', 'Dr. Carlos Pereira', 'Necessária segunda opinião', '2025-08-19 09:15:00', '2025-08-19 17:15:00'),
('2025-08-19', '10:30:00', 'Laudo para Revisão', 'DP Maranguape', 'Maranguape', 'Falsificação', 'SOL-2025-069', 'Dra. Ana Costa', 'Revisão por especialista', '2025-08-19 10:30:00', '2025-08-19 18:30:00'),

-- Laudos para Correção
('2025-08-18', '08:00:00', 'Laudo para Correção', '5ª DP Antônio Bezerra', 'Fortaleza', 'Furto', 'SOL-2025-070', 'Dr. Pedro Lima', 'Correções apontadas', '2025-08-18 08:00:00', '2025-08-18 16:00:00'),
('2025-08-18', '09:15:00', 'Laudo para Correção', '6ª DP Messejana', 'Fortaleza', 'Roubo', 'SOL-2025-071', 'Dra. Lucia Almeida', 'Ajustes necessários', '2025-08-18 09:15:00', '2025-08-18 17:15:00'),

-- SVO - Laudos Pendentes
('2025-08-17', '08:00:00', 'SVO - Laudo Pendente', '7ª DP Barra do Ceará', 'Fortaleza', 'Homicídio', 'SOL-2025-072', 'Dr. João Silva', 'SVO aguarda laudo necroscópico', '2025-08-17 08:00:00', '2025-08-17 16:00:00'),
('2025-08-17', '09:15:00', 'SVO - Laudo Pendente', '8ª DP Canindezinho', 'Fortaleza', 'Lesão Corporal', 'SOL-2025-073', 'Dra. Maria Santos', 'Exame de corpo de delito pendente', '2025-08-17 09:15:00', '2025-08-17 17:15:00'),
('2025-08-17', '10:30:00', 'SVO - Laudo Pendente', 'DP Eusébio', 'Eusébio', 'Latrocínio', 'SOL-2025-074', 'Dr. Carlos Pereira', 'Necropsia em andamento', '2025-08-17 10:30:00', '2025-08-17 18:30:00');