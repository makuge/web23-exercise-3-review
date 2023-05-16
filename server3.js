const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const movieModel = require("./movie-model.js");

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, "files")));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get("/genres", function (req, res) {
  let movies = Object.values(movieModel);
  const genres = new Set();
  for (let i = 0; i < movies.length; i++) {
    for (let j = 0; j < movies[i].Genres.length; j++) {
      genres.add(movies[i].Genres[j]);
    }
  }
  res.send([...genres].sort());
});

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get("/movies", function (req, res) {
  let movies = Object.values(movieModel);

  if (req.query.genre == "undefined") {
    res.send(movies);
    return;
  }
  if (req.query.genre == null) {
    res.send(movies);
    return;
  }
  movies = movies.filter((movie) => {
    return movie.Genres.some((genre) => {
      return genre === req.query.genre;
    });
  });
  res.send(movies);
});

// Configure a 'get' endpoint for a specific movie
app.get("/movies/:imdbID", function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  if (exists) {
    res.send(movieModel[id]);
  } else {
    res.sendStatus(404);
  }
});

app.put("/movies/:imdbID", function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  movieModel[req.params.imdbID] = req.body;

  if (!exists) {
    res.status(201);
    res.send(req.body);
  } else {
    res.sendStatus(200);
  }
});

app.listen(3000);

console.log("Server now listening on http://localhost:3000/");
