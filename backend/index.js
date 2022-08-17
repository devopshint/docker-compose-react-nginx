const keys = require("./keys");

// Express Application setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("connect", (client) => {
  client.query("CREATE TABLE IF NOT EXISTS values (number INT)").catch((err) => console.log("PG ERROR", err));
});

//Express route definitions

app.get("/", async (req, res) => {
  let URL = "http://d3h20q5pf7hmzd.cloudfront.net/sample2.html";
  const response = await axios.get(URL, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data, "utf-8").toString();
  res.header("Content-Type", "text/html");
  res.write("test..<br>");
  res.write(buffer);
  res.end();
});

app.get("/dev", (req, res) => {
  res.send(" this is devsss");
});

app.get("/prod", (req, res) => {
  res.send(" this is pross");
});

// get the values
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");

  res.send(values);
});

// now the post -> insert value
app.post("/values", async (req, res) => {
  if (!req.body.value) res.send({ working: false });

  pgClient.query("INSERT INTO values(number) VALUES($1)", [req.body.value]);

  res.send({ working: true });
});

app.listen(5001, (err) => {
  console.log("Listening");
});
