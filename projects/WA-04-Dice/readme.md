# Task:

#### Start
-   input field where players can set the winning
    score to change the predefined score of 100
-   players can create a new game whenever they want to

#### Loop
-   2 players
-   each turn, a player rolls 2 dice as many times as he wishes
    -   double six all his round's score gets lost
-   HOLD: result will get added to his round's score
-   next player's turn
-   the first player to reach 100 points wins

#### Extra:
1. Add how many times the player has won the game
2. Add local storage so our data will be persistent.
3. Add an AI to compete against
4. if you get 6 and 6 hold your event listeners for 1
   second and display a message that you got 6 and 6.
   Can be a funny gif or anything you can think of.
5. Add background music and sound effects.
6. Any other additions are welcome. Go crazy!

````

## 1. JS: Engine
```js
player1 = { name: "1", score: 0 };
player2 = { name: "2", score: 0 };
generateRandomNumber(1, 6);
gameOver = false;
i = 0;
while (!gameOver) {
    player[i].score += playerThrowDice(player);
    i = nextTurn();
    gameOver = checkWinLose(); // score === 100 => win
}
endGame(); // option to start again
````

## 2. HTML + CSS: Design
```js

```

## 3. JS: EventListeners + Visual Actions

```js
animateThrowDice() {
    // style
}
```
