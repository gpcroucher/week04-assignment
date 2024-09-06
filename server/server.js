import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pg from "pg";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_CONN_STRING,
});

// root route, does nothing
app.get("/", function (request, response) {
  response.json("Hello world!");
});

// sends a request to the database to delete all rows, then returns a number which represents the number of rows deleted
app.delete("/clear", async (request, response) => {
  if (request.query.password === process.env.CLEAR_PASSWORD) {
    const deletedRowsResult = await db.query(`DELETE FROM messages`);
    response.json(deletedRowsResult.rowCount);
  } else {
    response.json(false);
  }
});

// returns all messages from DB
app.get("/messages", async function (request, response) {
  const messages = await db.query("SELECT * FROM messages");
  response.json(messages.rows);
});

// inserts a message into the DB and then returns it
app.post("/messages", async function (request, response) {
  console.log("request.body", request.body);
  const newMessage = await db.query(
    `INSERT INTO messages (title, content, username, time) VALUES ($1, $2, $3, $4)`,
    [
      request.body.title,
      request.body.content,
      request.body.username,
      request.body.time,
    ]
  );
  response.json(newMessage);
});

app.listen(8080, function () {
  console.log("Server is running on port 8080");
});

// testing functions not called anywhere
async function checkSeedData() {
  const seedData = await db.query(`SELECT * FROM messages`);
  console.log(seedData);
}

async function clear() {
  db.query(`DELETE FROM messages`);
}
