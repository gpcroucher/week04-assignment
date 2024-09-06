import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_CONN_STRING,
});

makeTable();

async function makeTable() {
  await db.query(`DROP TABLE IF EXISTS messages`);
  console.log("Deleted table 'messages' (if it existed)");

  await db.query(`CREATE TABLE messages (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255),
  content VARCHAR(10000),
  username VARCHAR(255),
  time TIMESTAMPTZ
)`);
  console.log("Finished making table");

  const time = new Date();
  await db.query(
    `INSERT INTO messages (title, content, username, time) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)`,
    [
      "First seed message",
      "The database is seeded",
      "Server",
      time,
      "Second seed message",
      "A second message...",
      "Server",
      time,
      "Final seed message",
      "And one for luck!",
      "Server",
      time,
    ]
  );
  console.log("Finished seeding table");
}
