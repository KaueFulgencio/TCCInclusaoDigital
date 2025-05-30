CREATE TABLE IF NOT EXISTS acessibilidade_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT,
  clickCount INTEGER,
  executionTime REAL
);

INSERT INTO acessibilidade_logs (timestamp, clickCount, executionTime) VALUES
('2025-05-19T10:00:00Z', 5, 120.5),
('2025-05-19T10:05:00Z', 3, 85.2),
('2025-05-19T10:10:00Z', 8, 300.0),
('2025-05-19T10:15:00Z', 2, 45.8),
('2025-05-19T10:20:00Z', 7, 200.3);
