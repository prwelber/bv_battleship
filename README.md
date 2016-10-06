## Battleship

### Getting Started

`git clone` --> `npm install` --> `webpack --progress --colors --watch` and also run `node server.js` --> open `localhost:3000` in your browser


#### How To Play

Enter your name, click the 'New Game' button, and plot your 10 battleships. After your 10 ships have been designated in their squares, you can start trying to hit the computer's ships by clicking. Gray means you missed, orange means you hit! First player to sink all the other ships will win the game. If you want to start over or play another game, simply click the 'New Game' button.

#### Observations & Thoughts

##### Client Architecture
`app.js` is the top level component that holds the `board` component, renders directions and guiding information, and holds some game operational state data, such as if the game should be reset or if the player is making ship position choices. This component also handles the API call for resetting a game, upon which the `state` of the component is changed, and is then passed down to the children as `props`.

`Board.js` is the second level component, which has three main responsibilities.
1) Keeping track of player and computer scores.
2) Keeping track of computer hits (successful guesses by the computer).
3) Passing information and data through `props` to the `Square` component, as well as manufacturing the `Square` component and giving it an `id`, which corresponds to where it is placed on the board.

This component also renders the top and side headings. The most important aspect of the `Board` component is the data is passes to `Square`. It passes, as props, data that alerts the `Square` component when to reset, when the player is selecting ship positions versus playing, and how to handle a succesful computer guess.

`Square.js` is the lowermost child component, which when they all render, creates the actual playing board. The main function of `Square` is to show the user, visually, what is happening: if it holds the user ship, if the user hits a computer ship, if the user misses, or if the computer has hit a user ship. These visual cues are displayed via `background-color` and `border`. There is also an `id` for each component, which is used to keep track of the place on the board, and is also used to check if the computer has hit a user ship. There is also a click handler which calls the API and sends the player move information, and upon return data, designates hit or miss.

##### Server Architecture

For this exercise, I did not use a database. Instead, I used global variables, mainly in the form of counters, arrays, sets and objects. There are numerous endpoints, but two are of greater importance than the others. `GET /api/new` triggers a new game, including resetting many of the global variables to their original state. This route also generates 10 random computer ship locations, and pushes them into a `Set`. It returns the locations of the computer's ships to the client.

The other important route is `POST /api/playermove`. This route receives the player's move in the form of the board placement, and converts it to the corresponding number. This number is used to check the `Set` holding the computer ship locations, and then will register a hit or miss. After the route handles the player move, it generates a random computer move in the form of a number, translates it to a square on the board, and sends it off to the client, where it is resolved as a hit or miss.
