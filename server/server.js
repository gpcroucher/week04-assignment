import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

let messages = [];

const db = new pg.Pool({
  connectionString: process.env.DB_CONN_STRING,
});

async function checkSeedData() {
  const seedData = await db.query(`SELECT * FROM messages`);
  console.log(seedData);
}
checkSeedData();
console.log({ whatisthis: "this is an object" });

app.get("/", function (request, response) {
  response.json("Hello world!");
});

app.get("/messages", async function (request, response) {
  const messages = await db.query("SELECT * FROM messages");
  response.json(messages.rows);
});

app.post("/messages", async function (request, response) {
  console.log("request.body", request.body);
  // messages.push(request.body.message);
  const newMessage = await db.query(
    `INSERT INTO messages (title, content) VALUES ($1, $2)`,
    [request.body.title, request.body.content]
  );
  response.json(newMessage);
});

// app.get("/messages/random", function (request, response) {
//   let random = Math.floor(Math.random() * messages.length);
//   console.log(random);
//   response.json({ message: messages[random] });
// });

app.listen(8080, function () {
  console.log("Server is running on port 8080");
});
