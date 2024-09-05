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
  title VARCHAR(64),
  content VARCHAR(255)
)`);
  console.log("Finished making table");

  await db.query(
    `INSERT INTO messages (title, content) VALUES ('First seed message', 'The database is seeded'), ('Second seed message', 'Just checking...'), ('Final seed message', 'And one for luck!')`
  );
  console.log("Finished seeding table");
}
