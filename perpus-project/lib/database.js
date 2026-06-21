import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'db_perpusproject',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default connection;
