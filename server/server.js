// server.js
// import our node modules
import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

// setup the server
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// connect to our database
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.delete("/quotes/:id", async function (req, res) {
  const id = req.params.id;
  db.query("DELETE FROM quotes WHERE id = $1", [id]);
  res.json("success");
});

app.get("/quotes", async function (req, res) {
  const quotes = await db.query("SELECT * FROM quotes");
  res.json(quotes.rows);
});

app.post("/quotes", async function (req, res) {
  const character = req.body.character;
  const quote = req.body.quote;
  const newQuote = await db.query(
    "INSERT INTO quotes (character, quote) VALUES ($1, $2) RETURNING *",
    [character, quote]
  );
  res.json(newQuote.rows[0]);
});

app.post("/quotes/:id/like", async function (req, res) {
  const id = req.params.id;
  await db.query("UPDATE quotes SET likes = likes + 1 WHERE id = $1", [id]);
  const updatedQuote = await db.query("SELECT * FROM quotes WHERE id = $1", [
    id,
  ]);
  res.json(updatedQuote.rows[0]);
});

app.listen(8080, function () {
  console.log(`Server is running on port 8080`);
});
