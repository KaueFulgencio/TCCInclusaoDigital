import SQLite, { SQLiteDatabase, ResultSet, Transaction } from 'react-native-sqlite-storage';

let db: SQLiteDatabase | null = null;

export const initDB = async () => {
  db = await SQLite.openDatabase({ name: 'tcc2.db', location: 'default' });
  await db.transaction((tx: Transaction) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS acessibilidade_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        clickCount INTEGER,
        executionTime REAL
      );`
    );
  });
};

export const saveLog = async (clickCount: number, executionTime: number) => {
  if (!db) {
    db = await SQLite.openDatabase({ name: 'tcc2.db', location: 'default' });
  }
  const timestamp = new Date().toISOString();
  await db.transaction((tx: Transaction) => {
    tx.executeSql(
      'INSERT INTO acessibilidade_logs (timestamp, clickCount, executionTime) VALUES (?, ?, ?);',
      [timestamp, clickCount, executionTime]
    );
  });
};

export const getAllLogs = async (callback: (logs: any[]) => void) => {
  if (!db) {
    db = await SQLite.openDatabase({ name: 'tcc2.db', location: 'default' });
  }
  await db.transaction((tx: Transaction) => {
    tx.executeSql('SELECT * FROM acessibilidade_logs;', [], (_tx: Transaction, results: ResultSet) => {
      const rows = results.rows;
      const logs = [];
      for (let i = 0; i < rows.length; i++) {
        logs.push(rows.item(i));
      }
      callback(logs);
    });
  });
};
