
var PORT = process.env.PORT || 3000;

var express = require('express');
var app = express();
var request = require('request');
var engine = require('ejs-locals')
var bodyParser = require('body-parser');
var _ = require('lodash');

app.engine('ejs', engine)
app.set('view engine', 'ejs');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));


// -------- FUNCTIONS AND GLOBAL VARIABLES FOR GAME -------- //

const getRandomInt = function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const boardMap = {
  1: 'a1',
  2: 'b1',
  3: 'c1',
  4: 'd1',
  5: 'e1',
  6: 'a2',
  7: 'b2',
  8: 'c2',
  9: 'd2',
  10: 'e2',
  11: 'a3',
  12: 'b3',
  13: 'c3',
  14: 'd3',
  15: 'e3',
  16: 'a4',
  17: 'b4',
  18: 'c4',
  19: 'd4',
  20: 'e4',
  21: 'a5',
  22: 'b5',
  23: 'c5',
  24: 'd5',
  25: 'e5'
}

let playerShipCount = 0;
let playerShipLocations = [];
let playerHitCounter = 0;
let playerMoveCounter = 0;
// player moves contains all the guesses the player has made
let playerMoves = [];

// holds moves the comp has made
let computerMoves = [];
let computerMoveCounter = 0;
let computerHitCounter = 0;
let computerShipLocations = []; // this will contain alphaNum locations rather than int's


// computerShips is the location of the computers ships
const computerShips = new Set();

/*
 GET API/NEW
*/
app.get('/api/new', (req, res) => {
  // clear everything on new game event
  computerShips.clear();
  playerShipCount = 0;
  playerHitCounter = 0;
  playerMoveCounter = 0;
  playerMoves = [];
  playerShipLocations = [];
  computerShipLocations = [];


  // produce 10 random numbers that will represent each boat
  for (let i = 0; i < 10; i++) {
  	computerShips.add(getRandomInt(1,26))
  }
  while (computerShips.size < 10) {
  	computerShips.add(getRandomInt(1, 26))
  }


  for (let item of computerShips) {
    console.log('item in computerShips', boardMap[item]);
    computerShipLocations.push(boardMap[item]);
  }

  res.json({computerShipLocations: computerShipLocations});
});

/*
 GET API/GETPLAYERSCORE
*/
app.get('/api/getPlayerScore', (req, res) => {
  res.json({playerHitCounter: playerHitCounter});
});

/*
 POST API/PLAYERMOVE
*/
app.post('/api/playerMove', (req, res) => {

  // had to make key into an INT, not a string
  const key = parseFloat(_.findKey(boardMap, function(o) { return o === req.body.square }));

  // is the player move a duplicate, hit or miss
  let result;
  if (playerMoves.indexOf(req.body.square) >= 0) {
    result = 'duplicate';
  } else if (computerShips.has(key)) {
    playerMoveCounter++;
    playerHitCounter++;
    result = 'hit';
  } else {
    playerMoveCounter++;
    result = 'miss';
  }


  // generate computer move
  let compMove = getRandomInt(1, 26);

  // check if compMove has been made already, and if it has, gen new num
  while (computerMoves.indexOf(compMove) >= 0) {
    compMove = getRandomInt(1, 26);
  }

  // get corresponding square ID - compSquare should be 'a1', 'b4', etc.
  const computerMoveSquare = boardMap[compMove];

  let computerMoveResult = false;
  // check to see if comp move will be a hit or miss
  if (playerShipLocations.indexOf(computerMoveSquare) >= 0) {
    computerMoveResult = true;
  }


  // put compMove into the computerMoves array and increase counter
  computerMoveCounter++;
  computerMoves.push(compMove);

  // put moves in an array so we can check for duplicate moves
  playerMoves.push(req.body.square);

  res.json({result: result, computerMove: computerMoveSquare, computerMoveHit: computerMoveResult});
});

/*
 POST API/PLAYERSHIPLOCATION
*/
app.post('/api/playerShipLocation', (req, res) => {
  playerShipLocations.push(req.body.location)
  playerShipCount++;
  res.json({count: playerShipCount})
});




app.listen(PORT, () => {
  console.log(`Alive and well on port ${PORT}`)
});
