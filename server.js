var express = require("express");

var path = require("path");
const fs = require("fs");

// Sets up the Express App

//=============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// routes

app.get("/", (req, res) => {
    res.sendFile(
      path.resolve(
        (__dirname, "./public/index.html"),
      ),
    );
});
app.get("/notes", (req, res) => {
    res.sendFile(path.resolve(
      __dirname,
      "./public/notes.html",
    ));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./db/db.json"));
});



app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
