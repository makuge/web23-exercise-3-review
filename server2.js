const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get("/genres", (req, res) => {
  let genreSet = new Array();
  for(const key of Object.keys(movieModel)){
    for(const genre of movieModel[key].Genres){
      if(genreSet.indexOf(genre) === -1){
        genreSet.push(genre);
      }
    }
  }
  genreSet = genreSet.sort((a, b) => a.localeCompare(b));
  res.send(genreSet);
})

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
  let movies = Object.values(movieModel)
  if(req.query.genre && req.query.genre !== "All"){
    movies = movies.filter(movie => movie.Genres.find(genre => genre.toLowerCase() === req.query.genre.toLowerCase()));
  }
  res.send(movies);
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
