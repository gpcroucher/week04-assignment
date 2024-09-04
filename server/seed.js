import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_CONN_STRING,
});

db.query(
  `INSERT INTO messages (msg_name, content) VALUES ('hello there', 'general kenobi')`
);
