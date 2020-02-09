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

// POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", (req, res) => {
  let note = req.body;
  // console.log(note);
  // read existing db.json file
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) throw err;
    // parse data in db.json file
    let db = JSON.parse(data);
    // push note to update db
    db.push(note);
    
    // add an ID to each note in the db file starting with 1 then increment by 1
    let dbIDKey = 1;
    db.forEach(element => {
      element.id = dbIDKey++;
    });

    fs.writeFile("./db/db.json", JSON.stringify(db), err => {
      if (err) throw err;
      return res.status(200).send("Note Added");
    });
  });
});

// DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete("/api/notes/:id", (req, res) => {
  // read the db.json file
  fs.readFile("./db/db.json", "utf-8", (err, data) =>{
    if (err) throw err;
    // parse the db data
    let db = JSON.parse(data);

    let dbID = parseInt(req.params.id);
    
    let updatedDB = db.filter(Object => Object.id !== dbID);
    
    fs.writeFile("./db/db.json", JSON.stringify(updatedDB), err => {
      if (err) throw err;
      return res.status(200).send("Note Deleted");
    });
  });
});



app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
