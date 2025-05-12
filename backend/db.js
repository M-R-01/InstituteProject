import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

let db;

function handleConnect () {

  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: 3306
    })

  db.connect((err) => {
    if (err) {
      console.log(err);
      setTimeout(handleConnect, 2000);
    } else {
      console.log("Connected to database");
    }
  });

  db.on('error', err => {
    console.error('Database error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleConnect(); // reconnect
    } else {
      throw err;
    }
  });
}

export {handleConnect, db};
