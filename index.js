import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
  const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [username]);
  if (checkUser.rows.length > 0 ) {
    res.send("Email already exist. Try logging in");
  } else {
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [username, password]);
      console.log("New user added");
      res.render("secrets.ejs");
    }
    } catch (err) {
      console.log(err);
    }
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.query("SELECT * FROM users");
    const users = result.rows;
    const currentUser = users.find((user) => user.email == username);
    if (currentUser.password == password) {
      console.log("matched");
      res.render("secrets.ejs");
    } else {
      console.log("wrong password");
      res.send("Wrong email or password");
    }
    } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
