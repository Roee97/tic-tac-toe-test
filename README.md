# Tic Tac Toe Game

## Getting Started
1. Clone this repository to your local machine.
3. Install the dependencies by running `npm install` in the project directory.
4. Start the development server with `npm start`.

## Supported features:
1. Two players play locally turn by turn tic-tac-toe
2. Count point wins across games
3. Option to reset the game
4. animation on game win
5. Option to click on board to play / drag & drop a place

## Configuration Options:
1. Easily change players - from X/O to **short** different players
2. Change font size
3. Change players drag & drop bank locations
4. Change scoreboard locations
5. Change colors of background, click and win mark


### Notices:
1. General design is as follows:
   1. App.tsx contains game "brain" - score matrix, turn counter, current player etc, in addition to draw basic board functionalities
   2. Board.tsx Draws a new layer, responsible for game board. with board lines & cells, updating the board brain and keeps information about the game board layout
   3. gameEngine.tsx contains functionalities for the game itself - checking win, tie etc
   4. gameConfig.tsx contains all app configuration - colors, location (proportionate to the height & width of the screen) etc

*** checkWin function supports check board 3x3 only - not generic but better implemented, and no point making tic-tac-toe with bigger board (winning is too easy)


