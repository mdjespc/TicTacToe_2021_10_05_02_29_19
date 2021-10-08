var scoreTable = 
{
    'X' : 1,
    'O' : -1,
    'tie' : 0
};

/*
Recursively checks all possible moves and their respective outcomes. 
Inside the decision tree, wins count as a score of +1, losses count as -1,
and ties count as 0. When the end of the tree is reached, the AI chooses the
branch (AKA the move) that will lend the highest possible score given the
current state of the board.

The argument "depth" keeps track of the number of times the algorithm has
recursed (also lets us know how deep inside the decision tree we are).

The argument "isMaximizing" is a boolean that makes the algorithm behave
differently depending on whether it is checking all possible moves for
the maximizing player (the AI) or the minimizing player (the human).
*/

function minimaxTurn(currentBoard, currentAvailable, depth, isMaximizing)
{
    if(currentPlayer == human_player) return;   
    //This will hold the coordinates to the maximizing play
    let bestMoveFound = null;
    let bestScoreFound = isMaximizing ? -Infinity : Infinity;
    let potentialWinner = checkWinner(false);
    /*
    Terminal case -- the algorithm has recursed to the max depth,
    where a winner is found
    */
    if(potentialWinner !== null) return scoreTable[potentialWinner];
    //Maximizing player's turn
    if(isMaximizing)
    {
        currentAvailable.forEach(element =>{
            let copy = currentAvailable.slice(0, currentAvailable.length - 1);
            let y = element[0];
            let x = element[1];
            board[y][x] = AI_player;
            copy.splice(indexHelper(currentAvailable, element), 1);
            let currentScore = minimaxTurn(board, copy, depth + 1, false);
            //Undo the change to the board since it's an imaginary one
            board[y][x] = '';
            //Update maximizingScore with the best score found at the moment
            //bestScoreFound = max(currentScore, bestScoreFound);
            if(currentScore > bestScoreFound)
            {
                bestScoreFound = currentScore;
                bestMoveFound = [y, x];
            }
        });
        if(depth > 0)
            return bestScoreFound;
    }
    //Minimizing player's turn
    else
    {
        currentAvailable.forEach(element =>{
            let copy = currentAvailable.slice(0, currentAvailable.length - 1);
            let y = element[0];
            let x = element[1];
            board[y][x] = human_player;
            copy.splice(indexHelper(currentAvailable, element), 1);
            let currentScore = minimaxTurn(board, copy, depth + 1, true);
            //Undo the change to the board since it's an imaginary one
            board[y][x] = '';
            //Update maximizingScore with the best score found at the moment
            //bestScoreFound = min(currentScore, bestScoreFound);
            if(currentScore < bestScoreFound)
            {
                bestScoreFound = currentScore;
                bestMoveFound = [y, x];
            }
        });
        if(depth > 0)
            return bestScoreFound;
    }

//After recursively obtaining a maximizing score and a maximizing move, 
//take the turn and update the board
let index = indexHelper(available, [bestMoveFound[0], bestMoveFound[1]]);
available.splice(index, 1); 
board[bestMoveFound[0]][bestMoveFound[1]] = AI_player;
currentPlayer = human_player;
}